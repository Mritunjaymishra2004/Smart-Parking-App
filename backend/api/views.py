
# import random
# from django.utils import timezone
# from django.db.models import Sum
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import User

# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken

# from .models import (
#     Slot, Vehicle, VehiclePosition,
#     Reservation, Session, Payment,
#     Profile, ParkingLot, Violation
# )

# from .serializers import (
#     SlotSerializer,
#     VehicleSerializer,
#     ReservationSerializer,
#     SessionSerializer,
#     PaymentSerializer,
#     ViolationSerializer,
#     AdminSessionSerializer,
#     AdminBookingSerializer
# )

# from .permissions import IsAdmin


# # ===============================
# # SAFE WEBSOCKET IMPORT
# # ===============================
# try:
#     from .utils_ws import broadcast_slot_update, broadcast_vehicle_position
# except Exception:
#     def broadcast_slot_update(): pass
#     def broadcast_vehicle_position(*args, **kwargs): pass


# # ===============================
# # JWT
# # ===============================
# def generate_tokens(user):
#     refresh = RefreshToken.for_user(user)
#     return {
#         "access": str(refresh.access_token),
#         "refresh": str(refresh)
#     }


# # ===============================
# # 🔐 AUTH
# # ===============================
# # @api_view(["POST"])
# # @permission_classes([AllowAny])
# # def signup(request):
# #     email = request.data.get("email")
# #     password = request.data.get("password")
# #     name = request.data.get("name", "")
# #     role = request.data.get("role", "user")

# #     if not email or not password:
# #         return Response({"error": "Email and password required"}, status=400)

# #     if User.objects.filter(username=email).exists():
# #         return Response({"error": "User already exists"}, status=400)

# #     # 🔥 username = email
# #     user = User.objects.create_user(
# #         username=email,
# #         email=email,
# #         password=password,
# #         first_name=name,
# #         is_staff=(role == "admin")
# #     )

# #     Profile.objects.create(
# #         user=user,
# #         role=role,
# #         phone=""
# #     )

# #     return Response({
# #         **generate_tokens(user),
# #         "role": role
# #     })


# # @api_view(["POST"])
# # @permission_classes([AllowAny])
# # def login(request):
# #     print("LOGIN DATA RAW:", request.body)
# #     print("LOGIN DATA PARSED:", request.data)
# #     email = request.data.get("email")
# #     password = request.data.get("password")

# #     if not email or not password:
# #         return Response({"error": "Email and password required"}, status=400)

# #     # 🔥 Authenticate using email as username
# #     user = authenticate(username=email, password=password)

# #     if not user:
# #         return Response({"error": "Invalid credentials"}, status=400)

# #     profile, _ = Profile.objects.get_or_create(
# #         user=user,
# #         defaults={"role": "admin" if user.is_staff else "user"}
# #     )

# #     return Response({
# #         **generate_tokens(user),
# #         "role": profile.role
# #     })
# # ===============================
# # 🔐 AUTH (UPDATED)
# # ===============================
# @api_view(["POST"])
# @permission_classes([AllowAny])
# def signup(request):
#     from django.contrib.auth.models import User
#     from .models import Profile

#     email = request.data.get("email")
#     password = request.data.get("password")

#     if not email or not password:
#         return Response({"error": "Email and password required"}, status=400)

#     if User.objects.filter(email=email).exists():
#         return Response({"error": "User already exists"}, status=400)

#     # 🔥 Create user (username = email)
#     user = User.objects.create_user(
#         username=email,
#         email=email,
#         password=password
#     )

#     # 🔥 Create profile
#     Profile.objects.create(user=user)

#     return Response({"message": "User created"})


# @api_view(["POST"])
# @permission_classes([AllowAny])
# def login(request):
#     from django.contrib.auth import authenticate
#     from django.contrib.auth.models import User
#     from rest_framework_simplejwt.tokens import RefreshToken
#     from .models import Profile

#     email = request.data.get("email")
#     password = request.data.get("password")

#     if not email or not password:
#         return Response({"error": "Email and password required"}, status=400)

#     # 🔥 Find user by email
#     user = User.objects.filter(email=email).first()

#     if not user:
#         return Response({"error": "User not found"}, status=400)

#     # 🔥 Authenticate using username
#     user = authenticate(username=user.username, password=password)

#     if not user:
#         return Response({"error": "Invalid password"}, status=400)

#     # 🔥 Ensure profile exists
#     profile, _ = Profile.objects.get_or_create(user=user)

#     # 🔥 Generate tokens
#     refresh = RefreshToken.for_user(user)

#     return Response({
#         "access": str(refresh.access_token),
#         "refresh": str(refresh),
#         "role": profile.role
#     })

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def me(request):
#     profile, _ = Profile.objects.get_or_create(user=request.user)
#     return Response({
#         "email": request.user.email,
#         "name": request.user.first_name,
#         "role": profile.role,
#     })


# # ===============================
# # 🅿 PARKING LOTS
# # ===============================
# @api_view(["GET"])
# @permission_classes([AllowAny])
# def parking_lots(request):
#     return Response([
#         {"id": p.id, "name": p.name, "lat": p.latitude, "lng": p.longitude}
#         for p in ParkingLot.objects.filter(is_active=True)
#     ])


# # ===============================
# # 🅿 SLOTS
# # ===============================
# class SlotListView(generics.ListAPIView):
#     queryset = Slot.objects.select_related("zone", "zone__lot")
#     serializer_class = SlotSerializer
#     permission_classes = [AllowAny]


# # ===============================
# #  VEHICLES
# # ===============================
# class VehicleListCreateView(generics.ListCreateAPIView):
#     serializer_class = VehicleSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Vehicle.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


# # ===============================
# # 🚗 LIVE VEHICLE POSITION
# # ===============================
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def update_vehicle_position(request):
#     try:
#         vehicle = Vehicle.objects.get(id=request.data["vehicle_id"], user=request.user)
#     except:
#         return Response({"error": "Invalid vehicle"}, status=400)

#     pos, _ = VehiclePosition.objects.update_or_create(
#         vehicle=vehicle,
#         defaults={
#             "x": request.data.get("x"),
#             "y": request.data.get("y"),
#             "speed": request.data.get("speed", 0),
#             "heading": request.data.get("heading", 0),
#         }
#     )

#     broadcast_vehicle_position(vehicle.id, pos.x, pos.y, pos.speed, pos.heading)
#     return Response({"status": "updated"})


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def live_positions(request):
#     return Response([
#         {"id": p.vehicle.id, "plate": p.vehicle.plate, "x": p.x, "y": p.y}
#         for p in VehiclePosition.objects.select_related("vehicle")
#     ])


# # ===============================
# # 💰 PRICING
# # ===============================
# def calculate_price(hours):
#     if hours <= 1: return 50
#     if hours <= 2: return 100
#     if hours <= 3: return 150
#     return 150 + (hours - 3) * 50


# # ===============================
# # 📅 RESERVATION
# # ===============================
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_reservation(request):
#     try:
#         slot = Slot.objects.get(id=request.data["slot"], is_reserved=False, is_occupied=False)
#         vehicle = Vehicle.objects.get(id=request.data["vehicle"], user=request.user)
#     except:
#         return Response({"error": "Invalid slot or vehicle"}, status=400)

#     slot.is_reserved = True
#     slot.save()

#     reservation = Reservation.objects.create(
#         user=request.user,
#         vehicle=vehicle,
#         slot=slot,
#         start_time=timezone.now(),
#         end_time=timezone.now() + timezone.timedelta(hours=1),
#         price=100,
#         status="BOOKED"
#     )

#     broadcast_slot_update()
#     return Response(ReservationSerializer(reservation).data)


# # ===============================
# # ENTRY
# # ===============================
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def vehicle_entry(request):
#     #vehicle = Vehicle.objects.get(id=request.data["vehicle"], user=request.user)
#     try:
#         vehicle = Vehicle.objects.get(id=request.data["vehicle"], user=request.user)
#     except:
#         return Response({"error": "Invalid vehicle"}, status=400)

#     reservation = Reservation.objects.filter(vehicle=vehicle, status="BOOKED").first()

#     if reservation:
#         reservation.status = "ACTIVE"
#         reservation.save()
#         slot = reservation.slot
#     else:
#         slot = Slot.objects.filter(is_occupied=False, is_reserved=False).first()
#         if not slot:
#             return Response({"error": "No free slots"}, status=400)

#         Violation.objects.create(
#             vehicle=vehicle,
#             slot=slot,
#             type="NO_BOOKING",
#             fine=200
#         )

#     slot.is_occupied = True
#     slot.is_reserved = False
#     slot.save()

#     session = Session.objects.create(vehicle=vehicle, slot=slot, lot=slot.zone.lot)
#     broadcast_slot_update()
#     return Response(SessionSerializer(session).data)


# # ===============================
# # 🚗 EXIT
# # ===============================
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def vehicle_exit(request):
#     try:
#         session = Session.objects.get(id=request.data["session"],  vehicle__user=request.user)
#     except:
#         return Response({"error": "Invalid session"}, status=400)

#     session.exit_time = timezone.now()
#     hours = (session.exit_time - session.entry_time).total_seconds() / 3600
#     session.charges = calculate_price(hours)
#     session.save()

#     res = Reservation.objects.filter(vehicle=session.vehicle, status="ACTIVE").first()
#     if res and session.exit_time > res.end_time:
#         Violation.objects.create(
#             vehicle=session.vehicle,
#             slot=session.slot,
#             type="OVERSTAY",
#             fine=150
#         )
#         res.status = "EXPIRED"
#         res.save()

#     session.slot.is_occupied = False
#     session.slot.is_reserved = False
#     session.slot.save()

#     broadcast_slot_update()
#     return Response({"charges": session.charges})


# # ===============================
# # 💳 PAYMENT
# # ===============================
# # @api_view(["POST"])
# # @permission_classes([IsAuthenticated])
# # def pay(request):
# #     session = Session.objects.get(id=request.data["session"])

# #     payment = Payment.objects.create(
# #         session=session,
# #         user=request.user,
# #         amount=session.charges,
# #         method=request.data["method"],
# #         status="PAID"
# #     )

# #     return Response(PaymentSerializer(payment).data)
# from django.db import transaction

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def pay(request):
#     with transaction.atomic():
#         session = Session.objects.get(
#             id=request.data["session"],
#             vehicle__user=request.user
#         )

#         payment = Payment.objects.create(
#             session=session,
#             user=request.user,
#             amount=session.charges,
#             method=request.data.get("method", "online"),
#             status="PAID"
#         )

#         return Response(PaymentSerializer(payment).data)

# # ===============================
# # 📊 ADMIN STATS
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_stats(request):
#     today = timezone.now().date()

#     total_slots = Slot.objects.count()
#     occupied = Slot.objects.filter(is_occupied=True).count()
#     free = total_slots - occupied

#     total_revenue = float(Payment.objects.aggregate(Sum("amount"))["amount__sum"] or 0)
#     today_revenue = float(Payment.objects.filter(created_at__date=today).aggregate(Sum("amount"))["amount__sum"] or 0)

#     return Response({
#         "total_slots": total_slots,
#         "occupied_slots": occupied,
#         "free_slots": free,
#         "active_sessions": Session.objects.filter(exit_time__isnull=True).count(),
#         "total_revenue": total_revenue,
#         "today_revenue": today_revenue,
#     })


# # ===============================
# # 🚨 ADMIN VIOLATIONS
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_violations(request):
#     return Response(ViolationSerializer(Violation.objects.all(), many=True).data)


# # ===============================
# # 🧑‍💼 ADMIN LIVE SESSIONS
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_sessions(request):
#     sessions = Session.objects.select_related("vehicle", "slot", "lot").order_by("-entry_time")
#     return Response(AdminSessionSerializer(sessions, many=True).data)


# # ===============================
# # 🔧 ADMIN SLOT CONTROL
# # ===============================
# @api_view(["POST"])
# @permission_classes([IsAdmin])
# def admin_free_slot(request):
#     slot = Slot.objects.get(id=request.data["slot_id"])
#     slot.is_occupied = False
#     slot.is_reserved = False
#     slot.save()
#     broadcast_slot_update()
#     return Response({"status": "freed"})


# @api_view(["POST"])
# @permission_classes([IsAdmin])
# def admin_block_slot(request):
#     slot = Slot.objects.get(id=request.data["slot_id"])
#     slot.is_occupied = True
#     slot.is_reserved = False
#     slot.save()
#     broadcast_slot_update()
#     return Response({"status": "blocked"})


# # ===============================
# # 📋 ADMIN BOOKINGS
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_bookings(request):
#     bookings = Reservation.objects.select_related("user", "vehicle", "slot").order_by("-start_time")
#     return Response(AdminBookingSerializer(bookings, many=True).data)


# # =====================================================
# # 💳 WALLET
# # =====================================================
# # @api_view(["POST"])
# # @permission_classes([IsAuthenticated])
# # def add_money(request):
# #     profile, _ = Profile.objects.get_or_create(user=request.user)
# #     amount = float(request.data.get("amount", 0))
# #     # profile = request.user.profile
# #     profile.wallet_balance += amount
# #     profile.save()
# #     return Response({"wallet_balance": profile.wallet_balance})


# # @api_view(["GET"])
# # @permission_classes([IsAuthenticated])
# # def wallet_balance(request):
# #     profile, _ = Profile.objects.get_or_create(user=request.user)
# #     return Response({"wallet_balance": profile.wallet_balance})
# # @api_view(["POST"])
# # @permission_classes([IsAuthenticated])
# # def add_money(request):
# #     profile, _ = Profile.objects.get_or_create(user=request.user)

# #     try:
# #         amount = float(request.data.get("amount", 0))
# #         if amount <= 0:
# #             return Response({"error": "Invalid amount"}, status=400)
# #     except:
# #         return Response({"error": "Invalid amount"}, status=400)

# #     profile.wallet_balance = (profile.wallet_balance or 0) + amount
# #     profile.save()

# #     return Response({"wallet_balance": profile.wallet_balance})


# # @api_view(["GET"])
# # @permission_classes([IsAuthenticated])
# # def wallet_balance(request):
# #     profile, _ = Profile.objects.get_or_create(user=request.user)
# #     return Response({"wallet_balance": profile.wallet_balance or 0})
# # ===============================
# # 💰 WALLET (FIXED)
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def wallet_balance(request):
#     profile, _ = Profile.objects.get_or_create(user=request.user)

#     return Response({
#         "wallet_balance": profile.wallet_balance or 0
#     })


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def add_money(request):
#     profile, _ = Profile.objects.get_or_create(user=request.user)

#     try:
#         amount = float(request.data.get("amount", 0))
#         if amount <= 0:
#             return Response({"error": "Invalid amount"}, status=400)
#     except:
#         return Response({"error": "Invalid amount"}, status=400)

#     profile.wallet_balance = (profile.wallet_balance or 0) + amount
#     profile.save()

#     return Response({
#         "wallet_balance": profile.wallet_balance
#     })


# # =====================================================
# # ❌ CANCEL & REFUND
# # =====================================================
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def cancel_booking(request):
#     try:
#         reservation = Reservation.objects.get(
#             id=request.data["booking_id"],
#             user=request.user,
#             status__in=["BOOKED", "ACTIVE"]
#         )
#     except:
#         return Response({"error": "Invalid booking"}, status=400)

#     reservation.status = "CANCELLED"
#     reservation.save()

#     slot = reservation.slot
#     slot.is_reserved = False
#     slot.is_occupied = False
#     slot.save()

#     # Refund to wallet
#     profile = request.user.profile
#     profile.wallet_balance += reservation.price
#     profile.save()

#     broadcast_slot_update()
#     return Response({"message": "Booking cancelled and refunded"})


# # =====================================================
# # 📅 USER BOOKINGS
# # =====================================================
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def my_bookings(request):
#     bookings = Reservation.objects.filter(user=request.user).order_by("-start_time")
#     return Response(ReservationSerializer(bookings, many=True).data)


# # =====================================================
# # 🧑‍💼 ADMIN PAYMENTS
# # =====================================================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_payments(request):
#     payments = Payment.objects.select_related("user", "session").order_by("-created_at")
#     return Response(PaymentSerializer(payments, many=True).data)


# # =====================================================
# # 🚗 ADMIN LIVE VEHICLES
# # =====================================================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_live_vehicles(request):
#     data = []
#     for p in VehiclePosition.objects.select_related("vehicle"):
#         data.append({
#             "vehicle_id": p.vehicle.id,
#             "plate": p.vehicle.plate,
#             "x": p.x,
#             "y": p.y,
#             "speed": p.speed,
#             "heading": p.heading,
#             "updated": p.last_updated,
#         })
#     return Response(data)


# # =====================================================
# # 💰 ADMIN WALLET USERS
# # =====================================================
# @api_view(["GET"])
# @permission_classes([IsAdmin])
# def admin_wallet_users(request):
#     return Response([
#         {
#             "email": p.user.email,
#             "role": p.role,
#             "wallet": p.wallet_balance,
#         }
#         for p in Profile.objects.select_related("user")
#     ])

# # ===============================
# # 🚗 ACTIVE PARKING (FIXED)
# # ===============================
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def active_parking(request):
#     session = Session.objects.filter(
#         vehicle__user=request.user,
#         exit_time__isnull=True
#     ).select_related("slot").first()

#     if not session:
#         return Response({}, status=200)

#     duration = (timezone.now() - session.entry_time).total_seconds() / 60

#     return Response({
#         "slotId": session.slot.id,
#         "slotCode": session.slot.code,
#         "startTime": session.entry_time,
#         "minutes": int(duration),
#     })



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
def signup(request):
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
        Profile.objects.create(
            user=user,
            role=role,
            wallet_balance=Decimal("0.00")  # ✅ IMPORTANT
        )

        return Response({
            "message": "User created successfully"
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password required"}, status=400)

    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=400)

    user = authenticate(username=user.username, password=password)
    if not user:
        return Response({"error": "Invalid password"}, status=400)

    profile, _ = Profile.objects.get_or_create(user=user)
    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": profile.role
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    return Response({
        "email": request.user.email,
        "name": request.user.first_name,
        "role": profile.role,
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
    permission_classes = [AllowAny]


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
        slot = Slot.objects.get(id=request.data["slot"], is_reserved=False, is_occupied=False)
        vehicle = Vehicle.objects.filter(user=request.user).first()  # ✅ SAFE FIX
        if not vehicle:
            return Response({"error": "No vehicle found"}, status=400)
    except:
        return Response({"error": "Invalid slot or vehicle"}, status=400)

    slot.is_reserved = True
    slot.save()

    reservation = Reservation.objects.create(
        user=request.user,
        vehicle=vehicle,
        slot=slot,
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=1),  # ✅ FIXED
        price=100,
        status="BOOKED"
    )

    broadcast_slot_update()
    return Response(ReservationSerializer(reservation).data)

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

        # update booking status
        booking.status = "CANCELLED"
        booking.save()

        # free slot
        slot = booking.slot
        slot.is_reserved = False
        slot.is_occupied = False
        slot.save()

        broadcast_slot_update()

        return Response({
            "message": "Booking cancelled successfully"
        })

    except Reservation.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# =====================================================
# 🚗 VEHICLE ENTRY (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def vehicle_entry(request):
    try:
        vehicle = Vehicle.objects.filter(user=request.user).first()
        if not vehicle:
            return Response({"error": "No vehicle found"}, status=400)

        slot = Slot.objects.get(id=request.data.get("slot"))

        if slot.is_occupied:
            return Response({"error": "Slot already occupied"}, status=400)

        # mark slot occupied
        slot.is_occupied = True
        slot.is_reserved = False
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
        return Response({"error": "Invalid slot"}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
# ===============================
# 🚗 EXIT
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def vehicle_exit(request):
    try:
        session = Session.objects.get(id=request.data["session"], vehicle__user=request.user)
    except:
        return Response({"error": "Invalid session"}, status=400)

    session.exit_time = timezone.now()
    hours = (session.exit_time - session.entry_time).total_seconds() / 3600
    session.charges = calculate_price(hours)
    session.active = False  # ✅ FIXED
    session.save()

    session.slot.is_occupied = False
    session.slot.is_reserved = False
    session.slot.save()

    broadcast_slot_update()
    return Response({"charges": session.charges})


# ===============================
# 💳 PAYMENT
# ===============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def pay(request):
    with transaction.atomic():
        session = Session.objects.get(
            id=request.data["session"],
            vehicle__user=request.user
        )

        payment = Payment.objects.create(
            session=session,
            user=request.user,
            amount=session.charges,
            method=request.data.get("method", "WALLET"),  # ✅ FIXED
            status="PAID"
        )

        return Response(PaymentSerializer(payment).data)


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
        return Response({"error": "Not allowed"}, status=403)

    total_slots = Slot.objects.count()
    occupied = Slot.objects.filter(is_occupied=True).count()
    reserved = Slot.objects.filter(is_reserved=True).count()

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
            "available": total_slots - occupied - reserved
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
        return Response({"error": "Not allowed"}, status=403)

    try:
        slot_id = request.data.get("slot")

        slot = Slot.objects.get(id=slot_id)

        # free slot manually
        slot.is_occupied = False
        slot.is_reserved = False
        slot.save()

        # also close active session if exists
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
        return Response({"error": "Slot not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500) 
    

# =====================================================
# 🧑‍💼 ADMIN BLOCK SLOT (FIXED)
# =====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_block_slot(request):
    if not request.user.is_staff:
        return Response({"error": "Not allowed"}, status=403)

    try:
        slot_id = request.data.get("slot")

        slot = Slot.objects.get(id=slot_id)

        # block slot (mark as reserved permanently)
        slot.is_reserved = True
        slot.is_occupied = False
        slot.save()

        broadcast_slot_update()

        return Response({
            "message": f"Slot {slot.code} blocked successfully"
        })

    except Slot.DoesNotExist:
        return Response({"error": "Slot not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)    
    

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