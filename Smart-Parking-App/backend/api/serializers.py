from rest_framework import serializers
from django.contrib.auth.models import User

from .models import (
    Slot,
    Vehicle,
    Reservation,
    Payment,
    Session,
    Sensor,
    Violation,
    Zone,
    ParkingLot,
    VehiclePosition,
    Profile,
)

# =====================================================
# USER (Read Only)
# =====================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name"]


# =====================================================
# PROFILE
# =====================================================
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["user", "phone", "role", "kyc_verified"]


# =====================================================
# PARKING LOT
# =====================================================
class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLot
        fields = "__all__"


# =====================================================
# ZONE
# =====================================================
class ZoneSerializer(serializers.ModelSerializer):
    lot_name = serializers.CharField(source="lot.name", read_only=True)

    class Meta:
        model = Zone
        fields = ["id", "label", "lot", "lot_name"]


# =====================================================
# SLOT
# =====================================================
class SlotSerializer(serializers.ModelSerializer):
    zone_label = serializers.CharField(source="zone.label", read_only=True)
    lot_name = serializers.CharField(source="zone.lot.name", read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Slot
        fields = [
            "id",
            "code",
            "type",
            "zone",
            "zone_label",
            "lot_name",
            "x",
            "y",
            "is_reserved",
            "is_occupied",
            "status",
        ]

    def get_status(self, obj):
        if obj.is_occupied:
            return "OCCUPIED"
        if obj.is_reserved:
            return "RESERVED"
        return "AVAILABLE"


# =====================================================
# VEHICLE
# =====================================================
class VehicleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Vehicle
        fields = ["id", "plate", "type", "user"]

    def create(self, validated_data):
        """
        Automatically attach logged-in user.
        Prevents spoofing user IDs from frontend.
        """
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


# =====================================================
# LIVE VEHICLE POSITION
# =====================================================
class VehiclePositionSerializer(serializers.ModelSerializer):
    plate = serializers.CharField(source="vehicle.plate", read_only=True)

    class Meta:
        model = VehiclePosition
        fields = ["id", "vehicle", "plate", "x", "y", "speed", "heading", "updated_at"]


# =====================================================
# RESERVATION
# =====================================================
class ReservationSerializer(serializers.ModelSerializer):
    slot_code = serializers.CharField(source="slot.code", read_only=True)
    plate = serializers.CharField(source="vehicle.plate", read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "slot",
            "slot_code",
            "vehicle",
            "plate",
            "start_time",
            "end_time",
            "status",
            "price",
        ]


# =====================================================
# SESSION (User View)
# =====================================================
class SessionSerializer(serializers.ModelSerializer):
    slot_code = serializers.CharField(source="slot.code", read_only=True)
    plate = serializers.CharField(source="vehicle.plate", read_only=True)
    lot_name = serializers.CharField(source="lot.name", read_only=True)

    class Meta:
        model = Session
        fields = [
            "id",
            "vehicle",
            "plate",
            "slot",
            "slot_code",
            "lot_name",
            "entry_time",
            "exit_time",
            "charges",
        ]


# =====================================================
# PAYMENT
# =====================================================
class PaymentSerializer(serializers.ModelSerializer):
    plate = serializers.CharField(source="session.vehicle.plate", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "user",
            "plate",
            "session",
            "reservation",
            "amount",
            "method",
            "status",
            "created_at",
        ]
        read_only_fields = ["user", "status", "created_at"]


# =====================================================
# SENSOR
# =====================================================
class SensorSerializer(serializers.ModelSerializer):
    slot_code = serializers.CharField(source="slot.code", read_only=True)

    class Meta:
        model = Sensor
        fields = ["id", "type", "slot", "slot_code", "status", "last_seen"]


# =====================================================
# VIOLATION
# =====================================================
class ViolationSerializer(serializers.ModelSerializer):
    plate = serializers.CharField(source="vehicle.plate", read_only=True)
    slot_code = serializers.CharField(source="slot.code", read_only=True)

    class Meta:
        model = Violation
        fields = [
            "id",
            "plate",
            "slot_code",
            "type",
            "fine",
            "resolved",
            "created_at",
        ]


# =====================================================
# 🧑‍💼 ADMIN LIVE SESSIONS
# =====================================================
class AdminSessionSerializer(serializers.ModelSerializer):
    plate = serializers.CharField(source="vehicle.plate", read_only=True)
    slot_code = serializers.CharField(source="slot.code", read_only=True)
    lot_name = serializers.CharField(source="lot.name", read_only=True)

    class Meta:
        model = Session
        fields = [
            "id",
            "plate",
            "slot_code",
            "lot_name",
            "entry_time",
            "exit_time",
            "charges"
        ]


class AdminBookingSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    vehicle = serializers.CharField(source="vehicle.plate", read_only=True)
    slot = serializers.CharField(source="slot.code", read_only=True)
    paid = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            "id",
            "user",
            "vehicle",
            "slot",
            "status",
            "paid",
            "start_time",
            "end_time",
            "price",
        ]

    def get_paid(self, obj):
        return Payment.objects.filter(reservation=obj).exists()
