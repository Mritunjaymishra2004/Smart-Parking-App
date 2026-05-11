from django.contrib import admin

from .models import (
    Profile,
    ParkingLot,
    Zone,
    Slot,
    Vehicle,
    VehiclePosition,
    Sensor,
    Reservation,
    Session,
    Payment,
    Violation,
    Event,
    WalletTransaction,
)


# =====================================================
# PROFILE
# =====================================================

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "role",
        "wallet_balance",
        "kyc_verified",
        "is_blocked",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    list_filter = (
        "role",
        "kyc_verified",
    )


# =====================================================
# PARKING LOT
# =====================================================

@admin.register(ParkingLot)
class ParkingLotAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "operator",
        "total_slots",
        "available_slots",
        "is_active",
    )

    search_fields = (
        "name",
        "address",
    )

    list_filter = (
        "is_active",
    )


# =====================================================
# ZONE
# =====================================================

@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "label",
        "lot",
    )

    search_fields = (
        "label",
    )


# =====================================================
# SLOT
# =====================================================

@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "code",
        "type",
        "status",
        "zone",
    )

    search_fields = (
        "code",
    )

    list_filter = (
        "type",
        "status",
    )


# =====================================================
# VEHICLE
# =====================================================

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "plate",
        "type",
        "user",
        "brand",
        "color",
    )

    search_fields = (
        "plate",
    )

    list_filter = (
        "type",
    )


# =====================================================
# VEHICLE POSITION
# =====================================================

@admin.register(VehiclePosition)
class VehiclePositionAdmin(admin.ModelAdmin):

    list_display = (
        "vehicle",
        "x",
        "y",
        "speed",
        "heading",
        "updated_at",
    )

    search_fields = (
        "vehicle__plate",
    )


# =====================================================
# SENSOR
# =====================================================

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):

    list_display = (
        "device_id",
        "type",
        "slot",
        "battery_level",
        "status",
    )

    search_fields = (
        "device_id",
    )

    list_filter = (
        "type",
        "status",
    )


# =====================================================
# RESERVATION
# =====================================================

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "vehicle",
        "slot",
        "status",
        "price",
        "start_time",
        "end_time",
    )

    search_fields = (
        "user__username",
        "vehicle__plate",
    )

    list_filter = (
        "status",
    )


# =====================================================
# SESSION
# =====================================================

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "vehicle",
        "slot",
        "entry_time",
        "exit_time",
        "charges",
        "active",
    )

    search_fields = (
        "vehicle__plate",
    )

    list_filter = (
        "active",
    )


# =====================================================
# PAYMENT
# =====================================================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "amount",
        "method",
        "status",
        "transaction_id",
        "created_at",
    )

    search_fields = (
        "transaction_id",
    )

    list_filter = (
        "status",
        "method",
    )


# =====================================================
# WALLET TRANSACTION
# =====================================================

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "amount",
        "transaction_type",
        "created_at",
    )

    search_fields = (
        "user__username",
    )


# =====================================================
# VIOLATION
# =====================================================

@admin.register(Violation)
class ViolationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "vehicle",
        "slot",
        "type",
        "fine",
        "resolved",
    )

    list_filter = (
        "resolved",
        "type",
    )


# =====================================================
# EVENT
# =====================================================

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "type",
        "severity",
        "subject",
        "created_at",
    )

    list_filter = (
        "type",
        "severity",
    )

    readonly_fields = (
        "created_at",
    )



















# from django.contrib import admin
# from .models import (
#     Profile,
#     ParkingLot,
#     Zone,
#     Slot,
#     Vehicle,
#     VehiclePosition,
#     Reservation,
#     Session,
#     Payment,
#     Sensor,
#     Violation,
#     Event,
# )

# # =====================================================
# # USER PROFILE
# # =====================================================
# @admin.register(Profile)
# class ProfileAdmin(admin.ModelAdmin):
#     list_display = ("user", "role", "phone", "kyc_verified")
#     list_filter = ("role", "kyc_verified")
#     search_fields = ("user__username", "user__email", "phone")


# # =====================================================
# # PARKING LOT
# # =====================================================
# @admin.register(ParkingLot)
# class ParkingLotAdmin(admin.ModelAdmin):
#     list_display = ("name", "operator", "latitude", "longitude", "is_active")
#     list_filter = ("is_active",)
#     search_fields = ("name", "address", "operator__username")


# # =====================================================
# # ZONE
# # =====================================================
# @admin.register(Zone)
# class ZoneAdmin(admin.ModelAdmin):
#     list_display = ("label", "lot")
#     list_filter = ("lot",)
#     search_fields = ("label", "lot__name")


# # =====================================================
# # SLOT
# # =====================================================
# @admin.register(Slot)
# class SlotAdmin(admin.ModelAdmin):
#     list_display = ("code", "type", "zone", "is_reserved", "is_occupied", "x", "y")
#     list_filter = ("type", "is_reserved", "is_occupied", "zone")
#     search_fields = ("code", "zone__label")
#     ordering = ("zone", "code")


# # =====================================================
# # VEHICLE
# # =====================================================
# @admin.register(Vehicle)
# class VehicleAdmin(admin.ModelAdmin):
#     list_display = ("plate", "type", "user")
#     list_filter = ("type",)
#     search_fields = ("plate", "user__username", "user__email")


# # =====================================================
# # LIVE VEHICLE POSITION
# # =====================================================
# @admin.register(VehiclePosition)
# class VehiclePositionAdmin(admin.ModelAdmin):
#     list_display = ("vehicle", "x", "y", "speed", "heading", "updated_at")
#     list_filter = ("updated_at",)
#     search_fields = ("vehicle__plate",)


# # =====================================================
# # RESERVATION
# # =====================================================
# @admin.register(Reservation)
# class ReservationAdmin(admin.ModelAdmin):
#     list_display = ("id", "user", "vehicle", "slot", "status", "start_time", "end_time", "price")
#     list_filter = ("status", "start_time")
#     search_fields = ("user__username", "vehicle__plate", "slot__code")
#     ordering = ("-start_time",)


# # =====================================================
# # LIVE PARKING SESSION
# # =====================================================
# @admin.register(Session)
# class SessionAdmin(admin.ModelAdmin):
#     list_display = ("vehicle", "slot", "lot", "entry_time", "exit_time", "charges")
#     list_filter = ("lot", "entry_time")
#     search_fields = ("vehicle__plate", "slot__code")


# # =====================================================
# # PAYMENT
# # =====================================================
# @admin.register(Payment)
# class PaymentAdmin(admin.ModelAdmin):
#     list_display = ("id", "user", "session", "reservation", "amount", "method", "status", "created_at")
#     list_filter = ("status", "method", "created_at")
#     search_fields = ("user__username", "session__vehicle__plate")
#     readonly_fields = ("created_at",)


# # =====================================================
# # SENSOR
# # =====================================================
# @admin.register(Sensor)
# class SensorAdmin(admin.ModelAdmin):
#     list_display = ("type", "slot", "status", "last_seen")
#     list_filter = ("type", "status")
#     search_fields = ("slot__code",)


# # =====================================================
# # VIOLATIONS
# # =====================================================
# @admin.register(Violation)
# class ViolationAdmin(admin.ModelAdmin):
#     list_display = ("vehicle", "slot", "type", "fine", "resolved", "created_at")
#     list_filter = ("type", "resolved", "created_at")
#     search_fields = ("vehicle__plate", "slot__code")


# # =====================================================
# # EVENT LOG (AUDIT)
# # =====================================================
# @admin.register(Event)
# class EventAdmin(admin.ModelAdmin):
#     list_display = ("type", "subject", "timestamp")
#     list_filter = ("type", "timestamp")
#     search_fields = ("subject",)
#     readonly_fields = ("timestamp",)
