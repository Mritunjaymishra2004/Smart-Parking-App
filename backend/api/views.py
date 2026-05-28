
import random
from django.utils import timezone
from datetime import timedelta   # ✅ FIXED
from decimal import Decimal      # ✅ FIXED
from django.db.models import Sum
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import transaction

from .models import (
    Slot, Vehicle, VehiclePosition,
    Reservation, Session, Payment,
    Profile, ParkingLot, Violation
)

from .serializers import (
    SlotSerializer,
    VehicleSerializer,
    ReservationSerializer,
    SessionSerializer,
    PaymentSerializer,
    ViolationSerializer,
    AdminSessionSerializer,
    AdminBookingSerializer
)

from .permissions import IsAdmin

from django.shortcuts import redirect


def google_login(request):
    return redirect(
        "/auth/login/google-oauth2/"
    )


# ===============================
# SAFE WEBSOCKET IMPORT
# ===============================
try:
    from .utils_ws import broadcast_slot_update, broadcast_vehicle_position
except Exception:
    def broadcast_slot_update(): pass
    def broadcast_vehicle_position(*args, **kwargs): pass


# ===============================
# JWT
# ===============================
def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }


# ===============================
# 🔐 AUTH
# ===============================
@api_view(["POST"])
@permission_classes([AllowAny])
def signup_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")
    role = request.data.get("role", "user")  # ✅ NEW

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "User already exists"}, status=400)

    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name or ""  # ✅ FIX
        )

        # ✅ FIXED PROFILE CREATION
        profile = Profile.objects.get_or_create(

            user=user,

            defaults={

                "role": role,
  
                "wallet_balance":
                   Decimal("0.00"),
            }
        )

        return Response({
            "message": "User created successfully"
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=400
        )

    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=400
        )

    auth_user = authenticate(
        username=user.username,
        password=password
    )

    if not auth_user:
        return Response(
            {"error": "Invalid password"},
            status=400
        )

    profile, _ = Profile.objects.get_or_create(
        user=auth_user,
        defaults={
            "role": "user",
            "wallet_balance": Decimal("0.00"),
        }
    )

    if not profile.role:
        profile.role = (
            "admin"
            if auth_user.is_staff
            else "user"
        )
        profile.save()

    refresh = RefreshToken.for_user(auth_user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),

        "user": {
            "id": auth_user.id,
            "email": auth_user.email,
            "name": auth_user.first_name,
            "role": profile.role,
            "is_staff": auth_user.is_staff,
        }
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    return Response({

    "id":
        request.user.id,

    "email":
        request.user.email,

    "name":
        request.user.first_name,

    "role":
        profile.role,

    "is_staff":
        request.user.is_staff,

    "is_superuser":
        request.user.is_superuser,
})


# ===============================
# 🅿 PARKING LOTS
# ===============================
@api_view(["GET"])
@permission_classes([AllowAny])
def parking_lots(request):
    return Response([
        {"id": p.id, "name": p.name, "lat": p.latitude, "lng": p.longitude}
        for p in ParkingLot.objects.filter(is_active=True)
    ])


# ===============================
# 🅿 SLOTS
# ===============================
class SlotListView(generics.ListAPIView):
    queryset = Slot.objects.select_related("zone", "zone__lot")
    serializer_class = SlotSerializer
    permission_classes = [IsAuthenticated]


# ✅ ADD SINGLE SLOT API (FIX BLANK PAGE)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_slot(request, slot_id):
    try:
        slot = Slot.objects.select_related("zone").get(id=slot_id)
        return Response({
            "id": slot.id,
            "code": slot.code,
            "type": slot.type,
            "zone": slot.zone.label,
            "x": slot.x,
            "y": slot.y
        })
    except Slot.DoesNotExist:
        return Response({"error": "Slot not found"}, status=404)


# ===============================
# 🚗 VEHICLES
# ===============================
class VehicleListCreateView(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ===============================
# 🚗 LIVE VEHICLE POSITION
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_vehicle_position(request):
    try:
        vehicle = Vehicle.objects.get(id=request.data["vehicle_id"], user=request.user)
    except:
        return Response({"error": "Invalid vehicle"}, status=400)

    pos, _ = VehiclePosition.objects.update_or_create(
        vehicle=vehicle,
        defaults={
            "x": request.data.get("x"),
            "y": request.data.get("y"),
            "speed": request.data.get("speed", 0),
            "heading": request.data.get("heading", 0),
        }
    )

    broadcast_vehicle_position(vehicle.id, pos.x, pos.y, pos.speed, pos.heading)
    return Response({"status": "updated"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def live_positions(request):
    return Response([
        {"id": p.vehicle.id, "plate": p.vehicle.plate, "x": p.x, "y": p.y}
        for p in VehiclePosition.objects.select_related("vehicle")
    ])


# ===============================
# 💰 PRICING
# ===============================
def calculate_price(hours):
    if hours <= 1: return 50
    if hours <= 2: return 100
    if hours <= 3: return 150
    return 150 + (hours - 3) * 50


# ===============================
# 📅 RESERVATION
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_reservation(request):

    try:

        with transaction.atomic():

            slot = Slot.objects.select_for_update().get(
                id=request.data["slot"]
            )

            if slot.status != "AVAILABLE":

                return Response({
                    "error": "Slot unavailable"
                }, status=400)

            vehicle = Vehicle.objects.filter(
                user=request.user
            ).first()

            if not vehicle:

                return Response({
                    "error": "No vehicle found"
                }, status=400)

            slot.status = "RESERVED"
            slot.save()

            reservation = Reservation.objects.create(
                user=request.user,
                vehicle=vehicle,
                slot=slot,
                start_time=timezone.now(),
                end_time=timezone.now() + timedelta(hours=1),
                price=100,
                status="BOOKED"
            )

            broadcast_slot_update()

            return Response(
                ReservationSerializer(reservation).data
            )

    except Slot.DoesNotExist:

        return Response({
            "error": "Invalid slot"
        }, status=404)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=500)
    

# =====================================================
# ❌ CANCEL BOOKING (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_booking(request):

    try:

        booking_id = request.data.get("booking")

        booking = Reservation.objects.get(
            id=booking_id,
            user=request.user
        )

        booking.status = "CANCELLED"
        booking.save()

        slot = booking.slot

        slot.status = "AVAILABLE"
        slot.save()

        broadcast_slot_update()

        return Response({
            "message": "Booking cancelled successfully"
        })

    except Reservation.DoesNotExist:

        return Response({
            "error": "Booking not found"
        }, status=404)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=500)
    
# =====================================================
# 🚗 VEHICLE ENTRY (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def vehicle_entry(request):

    try:

        with transaction.atomic():

            vehicle = Vehicle.objects.filter(
                user=request.user
            ).first()

            if not vehicle:

                return Response({
                    "error": "No vehicle found"
                }, status=400)

            slot = Slot.objects.select_for_update().get(
                id=request.data.get("slot")
            )

            if slot.status == "OCCUPIED":

                return Response({
                    "error": "Slot already occupied"
                }, status=400)

            slot.status = "OCCUPIED"
            slot.save()

            session = Session.objects.create(
                vehicle=vehicle,
                slot=slot,
                lot=slot.zone.lot,
                entry_time=timezone.now(),
                active=True
            )

            broadcast_slot_update()

            return Response({
                "session": session.id,
                "slot_code": slot.code,
                "start_time": session.entry_time
            })

    except Slot.DoesNotExist:

        return Response({
            "error": "Invalid slot"
        }, status=400)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=500)
      
# ===============================
# 🚗 EXIT
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def vehicle_exit(request):

    try:

        session = Session.objects.get(
            id=request.data["session"],
            vehicle__user=request.user
        )

    except Session.DoesNotExist:

        return Response({
            "error": "Invalid session"
        }, status=400)

    session.exit_time = timezone.now()

    hours = (
        session.exit_time - session.entry_time
    ).total_seconds() / 3600

    session.charges = calculate_price(hours)

    session.active = False

    session.save()

    session.slot.status = "AVAILABLE"
    session.slot.save()

    broadcast_slot_update()

    return Response({
        "charges": session.charges
    })
# ===============================
# 💳 PAYMENT
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pay(request):

    try:

        with transaction.atomic():

            session = Session.objects.get(

                id=request.data["session"],

                vehicle__user=request.user
            )

            # =========================
            # PREVENT DOUBLE PAYMENT
            # =========================

            if Payment.objects.filter(

                session=session,

                status="PAID"

            ).exists():

                return Response({

                    "error":
                        "Session already paid"

                }, status=400)

            payment = Payment.objects.create(

                session=session,

                user=request.user,

                amount=session.charges,

                method=request.data.get(

                    "method",

                    "WALLET"
                ),

                status="PAID"
            )

            return Response(

                PaymentSerializer(payment).data
            )

    except Session.DoesNotExist:

        return Response({

            "error":
                "Invalid session"

        }, status=404)

    except Exception as e:

        return Response({

            "error":
                str(e)

        }, status=500)

# ===============================
# 💰 WALLET
# ===============================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wallet_balance(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    return Response({
        "wallet_balance": profile.wallet_balance or 0
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_money(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    try:
        amount = Decimal(str(request.data.get("amount", 0)))  # ✅ FIXED
        if amount <= 0:
            return Response({"error": "Invalid amount"}, status=400)
    except:
        return Response({"error": "Invalid amount"}, status=400)

    profile.wallet_balance += amount
    profile.save()

    return Response({
        "wallet_balance": profile.wallet_balance
    })


# ===============================
# 🚗 ACTIVE PARKING
# ===============================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def active_parking(request):
    session = Session.objects.filter(
        vehicle__user=request.user,
        exit_time__isnull=True
    ).select_related("slot").first()

    if not session:
        return Response({}, status=200)

    duration = (timezone.now() - session.entry_time).total_seconds() / 60

    return Response({
        "slotId": session.slot.id,
        "slotCode": session.slot.code,
        "startTime": session.entry_time,
        "minutes": int(duration),
    })

# =====================================================
# 📅 USER BOOKINGS (FIXED)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Reservation.objects.filter(user=request.user).order_by("-start_time")
    return Response(ReservationSerializer(bookings, many=True).data)

# =====================================================
# 🧑‍💼 ADMIN STATS (FIXED)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_stats(request):

    if not request.user.is_staff:

        return Response({
            "error": "Not allowed"
        }, status=403)

    total_slots = Slot.objects.count()

    occupied = Slot.objects.filter(
        status="OCCUPIED"
    ).count()

    reserved = Slot.objects.filter(
        status="RESERVED"
    ).count()

    maintenance = Slot.objects.filter(
        status="MAINTENANCE"
    ).count()

    total_users = User.objects.count()

    total_vehicles = Vehicle.objects.count()

    total_revenue = Payment.objects.aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response({

        "slots": {

            "total": total_slots,

            "occupied": occupied,

            "reserved": reserved,

            "maintenance": maintenance,

            "available":
                total_slots - occupied - reserved - maintenance
        },

        "users": total_users,

        "vehicles": total_vehicles,

        "revenue": total_revenue
    })

# =====================================================
# 🧑‍💼 ADMIN BOOKINGS
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_bookings(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    bookings = Reservation.objects.all().order_by("-start_time")
    return Response(AdminBookingSerializer(bookings, many=True).data)


# =====================================================
# 🧑‍💼 ADMIN SESSIONS
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_sessions(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    sessions = Session.objects.all().order_by("-entry_time")
    return Response(AdminSessionSerializer(sessions, many=True).data)


# =====================================================
# 🧑‍💼 ADMIN VIOLATIONS
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_violations(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    violations = Violation.objects.all().order_by("-created_at")
    return Response(ViolationSerializer(violations, many=True).data)


# =====================================================
# 🧑‍💼 ADMIN FREE SLOT (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_free_slot(request):

    if not request.user.is_staff:

        return Response({
            "error": "Not allowed"
        }, status=403)

    try:

        slot_id = request.data.get("slot")

        slot = Slot.objects.get(id=slot_id)

        slot.status = "AVAILABLE"

        slot.save()

        session = Session.objects.filter(
            slot=slot,
            active=True
        ).first()

        if session:

            session.exit_time = timezone.now()

            session.active = False

            session.save()

        broadcast_slot_update()

        return Response({
            "message": f"Slot {slot.code} freed successfully"
        })

    except Slot.DoesNotExist:

        return Response({
            "error": "Slot not found"
        }, status=404)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=500)

# =====================================================
# 🧑‍💼 ADMIN BLOCK SLOT (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_block_slot(request):

    if not request.user.is_staff:

        return Response({
            "error": "Not allowed"
        }, status=403)

    try:

        slot_id = request.data.get("slot")

        slot = Slot.objects.get(id=slot_id)

        slot.status = "MAINTENANCE"

        slot.save()

        broadcast_slot_update()

        return Response({
            "message": f"Slot {slot.code} blocked successfully"
        })

    except Slot.DoesNotExist:

        return Response({
            "error": "Slot not found"
        }, status=404)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=500)

# =====================================================
# 🧑‍💼 ADMIN PAYMENTS (FIXED)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_payments(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    payments = Payment.objects.select_related("user", "session", "reservation") \
                              .order_by("-created_at")

    data = []
    for p in payments:
        data.append({
            "id": p.id,
            "user": p.user.email if p.user else None,
            "amount": p.amount,
            "method": p.method,
            "status": p.status,
            "session": p.session.id if p.session else None,
            "reservation": p.reservation.id if p.reservation else None,
            "created_at": p.created_at,
        })

    return Response(data)

# =====================================================
# 🧑‍💼 ADMIN LIVE VEHICLES (FIXED)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_live_vehicles(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    positions = VehiclePosition.objects.select_related("vehicle").all()

    data = []
    for p in positions:
        data.append({
            "vehicle_id": p.vehicle.id,
            "plate": p.vehicle.plate,
            "x": p.x,
            "y": p.y,
            "speed": p.speed,
            "heading": p.heading,
            "updated": p.updated_at   # ✅ correct field
        })

    return Response(data)

# =====================================================
# 🧑‍💼 ADMIN WALLET USERS (FIXED)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_wallet_users(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    profiles = Profile.objects.select_related("user").all()

    data = []
    for p in profiles:
        data.append({
            "user_id": p.user.id,
            "email": p.user.email,
            "wallet_balance": p.wallet_balance,
            "role": p.role
        })

    return Response(data)


# =====================================================
# 🧑‍💼 ADMIN ADD MONEY TO USER
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_add_money(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    try:
        user_id = request.data.get("user")
        amount = Decimal(str(request.data.get("amount", 0)))

        profile = Profile.objects.get(user__id=user_id)
        profile.wallet_balance += amount
        profile.save()

        return Response({
            "message": "Money added",
            "wallet_balance": profile.wallet_balance
        })

    except Profile.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500) 

# =====================================================
# 📅 USER SESSIONS (NEW - FIX 404)
# =====================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_sessions(request):
    sessions = Session.objects.filter(
        vehicle__user=request.user
    ).select_related("slot").order_by("-entry_time")

    data = []
    for s in sessions:
        data.append({
            "id": s.id,
            "slot_code": s.slot.code if s.slot else None,
            "entry_time": s.entry_time,
            "exit_time": s.exit_time,
            "charges": s.charges,
            "active": s.active,
        })

    return Response(data)

