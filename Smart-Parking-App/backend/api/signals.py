from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from .models import Profile, VehiclePosition

# WebSocket is OPTIONAL — must NEVER crash DB
try:
    from .utils_ws import broadcast_vehicle_position
except Exception:
    def broadcast_vehicle_position(*args, **kwargs):
        pass


# =====================================================
# AUTO CREATE PROFILE WHEN USER IS CREATED
# =====================================================
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """
    Automatically create Profile for every User.

    Prevents:
    - login crashes
    - admin crashes
    - missing FK errors
    - MySQL NULL issues
    """

    if not created:
        return

    # Atomic safety (prevents race conditions)
    Profile.objects.get_or_create(
        user=instance,
        defaults={
            "phone": "",
            "role": "admin" if instance.is_superuser else "user",
        }
    )


# =====================================================
# BROADCAST VEHICLE LIVE LOCATION VIA WEBSOCKET
# =====================================================
@receiver(post_save, sender=VehiclePosition)
def vehicle_position_saved(sender, instance, **kwargs):
    """
    Broadcast vehicle live location on save.

    Socket errors must NEVER crash database writes.
    """
    try:
        broadcast_vehicle_position(
            vehicle_id=instance.vehicle_id,
            x=instance.x,
            y=instance.y,
            speed=instance.speed,
            heading=instance.heading,
        )
    except Exception:
        # Ignore all socket errors (Redis/Channels may be offline)
        pass
