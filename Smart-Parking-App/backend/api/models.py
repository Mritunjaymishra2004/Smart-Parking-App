# from django.db import models
# from django.contrib.auth.models import User
# from django.utils import timezone
# from decimal import Decimal
# from datetime import timedelta

# return self.reset_otp == otp and timezone.now() < self.reset_otp_created_at + timedelta(minutes=10)
# # =====================================================
# # USER PROFILE
# # =====================================================
# class Profile(models.Model):
#     ROLE_CHOICES = (
#         ("user", "User"),
#         ("admin", "Admin"),
#         ("operator", "Operator"),
#     )

#     user = models.OneToOneField(
#         User, on_delete=models.CASCADE, related_name="profile"
#     )
#     phone = models.CharField(max_length=20, blank=True, null=True)
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
#     kyc_verified = models.BooleanField(default=False)
#     #wallet_balance = models.FloatField(default=0)   #
#     wallet_balance = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         default=Decimal("0.00")
#     )
#     reset_otp = models.CharField(max_length=6, blank=True, null=True)
#     reset_otp_created_at = models.DateTimeField(blank=True, null=True)

#     def is_reset_otp_valid(self, otp):
#         if not self.reset_otp or not self.reset_otp_created_at:
#             return False
#         return self.reset_otp == otp and timezone.now() < self.reset_otp_created_at + timezone.timedelta(minutes=10)

#     def __str__(self):
#         return self.user.username
# # =====================================================
# # USER PROFILE (REPLACED - SIMPLE VERSION)
# # =====================================================
# # from django.db import models
# # from django.contrib.auth.models import User

# # class Profile(models.Model):
# #     user = models.OneToOneField(User, on_delete=models.CASCADE)
# #     role = models.CharField(max_length=20, default="user")
# #     wallet_balance = models.FloatField(default=0)

# #     def __str__(self):
# #         return self.user.username



# # =====================================================
# # PARKING LOT
# # =====================================================
# class ParkingLot(models.Model):
#     name = models.CharField(max_length=200)
#     address = models.TextField()

#     operator = models.ForeignKey(
#         User, on_delete=models.CASCADE, related_name="managed_lots"
#     )

#     latitude = models.FloatField()
#     longitude = models.FloatField()

#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.name


# # =====================================================
# # ZONE / LEVEL
# # =====================================================
# class Zone(models.Model):
#     lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name="zones")
#     label = models.CharField(max_length=50)

#     class Meta:
#         unique_together = ("lot", "label")

#     def __str__(self):
#         return f"{self.lot.name} - {self.label}"


# # =====================================================
# # PARKING SLOT
# # =====================================================
# class Slot(models.Model):
#     SLOT_TYPES = (
#         ("CAR", "Car"),
#         ("BIKE", "Bike"),
#         ("EV", "EV"),
#         ("DISABLED", "Disabled"),
#     )

#     zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="slots")
#     code = models.CharField(max_length=20, unique=True)
#     type = models.CharField(max_length=20, choices=SLOT_TYPES, default="CAR")

#     x = models.FloatField(default=50)
#     y = models.FloatField(default=50)

#     is_reserved = models.BooleanField(default=False)
#     is_occupied = models.BooleanField(default=False)

#     @property
#     def status(self):
#         if self.is_occupied:
#             return "OCCUPIED"
#         if self.is_reserved:
#             return "RESERVED"
#         return "AVAILABLE"

#     def __str__(self):
#         return self.code


# # =====================================================
# # VEHICLE
# # =====================================================
# class Vehicle(models.Model):
#     VEHICLE_TYPES = (
#         ("CAR", "Car"),
#         ("BIKE", "Bike"),
#         ("EV", "EV"),
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vehicles")
#     plate = models.CharField(max_length=20, unique=True)
#     type = models.CharField(max_length=20, choices=VEHICLE_TYPES, default="CAR")

#     def __str__(self):
#         return self.plate


# # =====================================================
# # LIVE VEHICLE POSITION
# # =====================================================
# class VehiclePosition(models.Model):
#     vehicle = models.OneToOneField(
#         Vehicle, on_delete=models.CASCADE, related_name="position"
#     )
#     x = models.FloatField()
#     y = models.FloatField()
#     speed = models.FloatField(default=0)
#     heading = models.IntegerField(default=0)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.vehicle.plate} @ {self.x},{self.y}"


# # =====================================================
# # SENSOR
# # =====================================================
# class Sensor(models.Model):
#     SENSOR_TYPES = (
#         ("CAMERA", "Camera"),
#         ("ULTRASONIC", "Ultrasonic"),
#         ("RFID", "RFID"),
#         ("GATE", "Gate"),
#     )

#     type = models.CharField(max_length=20, choices=SENSOR_TYPES)
#     slot = models.ForeignKey(Slot, on_delete=models.CASCADE, null=True, blank=True)
#     status = models.CharField(max_length=20, default="ONLINE")
#     last_seen = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.type} - {self.status}"


# # =====================================================
# # RESERVATION
# # =====================================================
# class Reservation(models.Model):
#     STATUS = (
#         ("BOOKED", "Booked"),
#         ("ACTIVE", "Active"),
#         ("EXPIRED", "Expired"),
#         ("CANCELLED", "Cancelled"),
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
#     slot = models.ForeignKey(Slot, on_delete=models.CASCADE)

#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()

#     status = models.CharField(max_length=20, choices=STATUS, default="BOOKED")
#     price = models.DecimalField(max_digits=10, decimal_places=2)

#     def is_expired(self):
#         return timezone.now() > self.end_time

#     def __str__(self):
#         return f"{self.user.username} → {self.slot.code}"


# # =====================================================
# # LIVE PARKING SESSION
# # =====================================================
# class Session(models.Model):
#     vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
#     slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
#     lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE)

#     entry_time = models.DateTimeField(auto_now_add=True)
#     exit_time = models.DateTimeField(null=True, blank=True)

#     charges = models.DecimalField(
#         max_digits=10, decimal_places=2, default=Decimal("0.00")
#     )

#     def __str__(self):
#         return f"{self.vehicle.plate} @ {self.slot.code}"


# # =====================================================
# # PAYMENT
# # =====================================================
# class Payment(models.Model):
#     reservation = models.ForeignKey(
#         Reservation, on_delete=models.CASCADE, null=True, blank=True
#     )
#     session = models.ForeignKey(
#         Session, on_delete=models.CASCADE, null=True, blank=True
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     method = models.CharField(max_length=30)
#     status = models.CharField(max_length=20, default="PAID")
#     gateway_ref = models.CharField(max_length=200, blank=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user} - ₹{self.amount}"


# # =====================================================
# # VIOLATIONS
# # =====================================================
# class Violation(models.Model):
#     TYPES = (
#         ("OVERSTAY", "Overstay"),
#         ("NO_BOOKING", "No Booking"),
#     )

#     vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
#     slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
#     type = models.CharField(max_length=20, choices=TYPES)
#     fine = models.DecimalField(max_digits=8, decimal_places=2)
#     resolved = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.vehicle.plate} - {self.type}"


# # =====================================================
# # EVENT LOG
# # =====================================================
# class Event(models.Model):
#     EVENT_TYPES = (
#         ("ENTRY", "Entry"),
#         ("EXIT", "Exit"),
#         ("OVERSTAY", "Overstay"),
#         ("VIOLATION", "Violation"),
#         ("PAYMENT", "Payment"),
#         ("ALERT", "Alert"),
#     )

#     type = models.CharField(max_length=20, choices=EVENT_TYPES)
#     subject = models.CharField(max_length=200)
#     timestamp = models.DateTimeField(auto_now_add=True)
#     metadata = models.JSONField(default=dict)

#     def __str__(self):
#         return f"{self.type} - {self.subject}"

# from django.db.models.signals import post_save
# from django.dispatch import receiver

# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)




from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta


# =====================================================
# USER PROFILE
# =====================================================
class Profile(models.Model):
    ROLE_CHOICES = (
        ("user", "User"),
        ("admin", "Admin"),
        ("operator", "Operator"),
    )

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    kyc_verified = models.BooleanField(default=False)

    wallet_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )

    reset_otp = models.CharField(max_length=6, blank=True, null=True)
    reset_otp_created_at = models.DateTimeField(blank=True, null=True)

    def is_reset_otp_valid(self, otp):
        if not self.reset_otp or not self.reset_otp_created_at:
            return False
        return self.reset_otp == otp and timezone.now() < self.reset_otp_created_at + timedelta(minutes=10)

    def __str__(self):
        return self.user.username


# =====================================================
# PARKING LOT
# =====================================================
class ParkingLot(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()

    operator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="managed_lots"
    )

    latitude = models.FloatField()
    longitude = models.FloatField()

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# =====================================================
# ZONE / LEVEL
# =====================================================
class Zone(models.Model):
    lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name="zones")
    label = models.CharField(max_length=50)

    class Meta:
        unique_together = ("lot", "label")

    def __str__(self):
        return f"{self.lot.name} - {self.label}"


# =====================================================
# PARKING SLOT
# =====================================================
class Slot(models.Model):
    SLOT_TYPES = (
        ("CAR", "Car"),
        ("BIKE", "Bike"),
        ("EV", "EV"),
        ("DISABLED", "Disabled"),
    )

    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="slots")
    code = models.CharField(max_length=20, unique=True)
    type = models.CharField(max_length=20, choices=SLOT_TYPES, default="CAR")

    x = models.FloatField(default=50)
    y = models.FloatField(default=50)

    is_reserved = models.BooleanField(default=False)
    is_occupied = models.BooleanField(default=False)

    @property
    def status(self):
        if self.is_occupied:
            return "OCCUPIED"
        if self.is_reserved:
            return "RESERVED"
        return "AVAILABLE"

    def __str__(self):
        return self.code


# =====================================================
# VEHICLE
# =====================================================
class Vehicle(models.Model):
    VEHICLE_TYPES = (
        ("CAR", "Car"),
        ("BIKE", "Bike"),
        ("EV", "EV"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vehicles")
    plate = models.CharField(max_length=20, unique=True)
    type = models.CharField(max_length=20, choices=VEHICLE_TYPES, default="CAR")

    def __str__(self):
        return self.plate


# =====================================================
# LIVE VEHICLE POSITION
# =====================================================
class VehiclePosition(models.Model):
    vehicle = models.OneToOneField(
        Vehicle, on_delete=models.CASCADE, related_name="position"
    )
    x = models.FloatField()
    y = models.FloatField()
    speed = models.FloatField(default=0)
    heading = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle.plate} @ {self.x},{self.y}"


# =====================================================
# SENSOR
# =====================================================
class Sensor(models.Model):
    SENSOR_TYPES = (
        ("CAMERA", "Camera"),
        ("ULTRASONIC", "Ultrasonic"),
        ("RFID", "RFID"),
        ("GATE", "Gate"),
    )

    type = models.CharField(max_length=20, choices=SENSOR_TYPES)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, default="ONLINE")
    last_seen = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} - {self.status}"


# =====================================================
# RESERVATION
# =====================================================
class Reservation(models.Model):
    STATUS = (
        ("BOOKED", "Booked"),
        ("ACTIVE", "Active"),
        ("EXPIRED", "Expired"),
        ("CANCELLED", "Cancelled"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    status = models.CharField(max_length=20, choices=STATUS, default="BOOKED")
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def is_expired(self):
        return timezone.now() > self.end_time

    def __str__(self):
        return f"{self.user.username} → {self.slot.code}"


# =====================================================
# LIVE PARKING SESSION
# =====================================================
class Session(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
    lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE)

    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)

    charges = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )

    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vehicle.plate} @ {self.slot.code}"


# =====================================================
# PAYMENT
# =====================================================
class Payment(models.Model):
    METHODS = (
        ("WALLET", "Wallet"),
        ("UPI", "UPI"),
        ("CARD", "Card"),
    )

    reservation = models.ForeignKey(
        Reservation, on_delete=models.CASCADE, null=True, blank=True
    )
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, null=True, blank=True
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHODS)
    status = models.CharField(max_length=20, default="PAID")
    gateway_ref = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - ₹{self.amount}"


# =====================================================
# VIOLATIONS
# =====================================================
class Violation(models.Model):
    TYPES = (
        ("OVERSTAY", "Overstay"),
        ("NO_BOOKING", "No Booking"),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPES)
    fine = models.DecimalField(max_digits=8, decimal_places=2)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle.plate} - {self.type}"


# =====================================================
# EVENT LOG
# =====================================================
class Event(models.Model):
    EVENT_TYPES = (
        ("ENTRY", "Entry"),
        ("EXIT", "Exit"),
        ("OVERSTAY", "Overstay"),
        ("VIOLATION", "Violation"),
        ("PAYMENT", "Payment"),
        ("ALERT", "Alert"),
    )

    type = models.CharField(max_length=20, choices=EVENT_TYPES)
    subject = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.type} - {self.subject}"


# =====================================================
# AUTO CREATE PROFILE
# =====================================================
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)