import logging

from django.db.models.signals import (
    post_save,
)

from django.dispatch import (
    receiver,
)

from django.contrib.auth.models import (
    User,
)

from .models import (

    Profile,

    VehiclePosition,

    Slot,
)

# =====================================================
# LOGGER
# =====================================================

logger = logging.getLogger(__name__)

# =====================================================
# SAFE WEBSOCKET IMPORT
# =====================================================

try:

    from .utils_ws import (

        broadcast_vehicle_position,

        broadcast_slot_update,
    )

except Exception as e:

    logger.warning(
        f"WebSocket unavailable: {e}"
    )

    def broadcast_vehicle_position(
        *args,
        **kwargs
    ):
        pass

    def broadcast_slot_update(
        *args,
        **kwargs
    ):
        pass

# =====================================================
# AUTO CREATE PROFILE
# =====================================================

@receiver(
    post_save,
    sender=User
)
def create_profile(

    sender,

    instance,

    created,

    **kwargs
):

    if not created:
        return

    try:

        Profile.objects.get_or_create(

            user=instance,

            defaults={

                "phone": "",

                "role":

                    "admin"

                    if instance.is_superuser

                    else "user",
            },
        )

        logger.info(

            f"Profile created: "
            f"{instance.username}"
        )

    except Exception as e:

        logger.error(

            f"Profile creation failed: "
            f"{e}"
        )

# =====================================================
# SLOT LIVE UPDATE
# =====================================================

@receiver(
    post_save,
    sender=Slot
)
def slot_saved(

    sender,

    instance,

    **kwargs
):

    try:

        broadcast_slot_update()

    except Exception as e:

        logger.warning(

            f"Slot broadcast failed: "
            f"{e}"
        )

# =====================================================
# VEHICLE POSITION UPDATE
# =====================================================

@receiver(
    post_save,
    sender=VehiclePosition
)
def vehicle_position_saved(

    sender,

    instance,

    **kwargs
):

    try:

        broadcast_vehicle_position(

            vehicle_id=
                instance.vehicle_id,

            x=
                instance.x,

            y=
                instance.y,

            speed=
                getattr(
                    instance,
                    "speed",
                    0
                ),

            heading=
                getattr(
                    instance,
                    "heading",
                    0
                ),
        )

    except Exception as e:

        logger.warning(

            f"Vehicle broadcast failed: "
            f"{e}"
        )


















# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.contrib.auth.models import User

# from .models import Profile, VehiclePosition

# # WebSocket is OPTIONAL — must NEVER crash DB
# try:
#     from .utils_ws import broadcast_vehicle_position
# except Exception:
#     def broadcast_vehicle_position(*args, **kwargs):
#         pass


# # =====================================================
# # AUTO CREATE PROFILE WHEN USER IS CREATED
# # =====================================================
# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     """
#     Automatically create Profile for every User.

#     Prevents:
#     - login crashes
#     - admin crashes
#     - missing FK errors
#     - MySQL NULL issues
#     """

#     if not created:
#         return

#     # Atomic safety (prevents race conditions)
#     Profile.objects.get_or_create(
#         user=instance,
#         defaults={
#             "phone": "",
#             "role": "admin" if instance.is_superuser else "user",
#         }
#     )


# # =====================================================
# # BROADCAST VEHICLE LIVE LOCATION VIA WEBSOCKET
# # =====================================================
# @receiver(post_save, sender=VehiclePosition)
# def vehicle_position_saved(sender, instance, **kwargs):
#     """
#     Broadcast vehicle live location on save.

#     Socket errors must NEVER crash database writes.
#     """
#     try:
#         broadcast_vehicle_position(
#             vehicle_id=instance.vehicle_id,
#             x=instance.x,
#             y=instance.y,
#             speed=instance.speed,
#             heading=instance.heading,
#         )
#     except Exception:
#         # Ignore all socket errors (Redis/Channels may be offline)
#         pass
