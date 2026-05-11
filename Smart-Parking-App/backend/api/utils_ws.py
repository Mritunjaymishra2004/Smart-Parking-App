from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Import models safely (never crash during migrations)
try:
    from .models import Slot, VehiclePosition
except Exception:
    Slot = None
    VehiclePosition = None


# =====================================================
# 🔒 SAFE GROUP SEND
# =====================================================
def _safe_group_send(group, message):
    """
    Never allow websocket errors to crash Django.
    Redis, Channels, Daphne may be offline.
    """
    try:
        channel_layer = get_channel_layer()
        if not channel_layer:
            return
        async_to_sync(channel_layer.group_send)(group, message)
    except Exception:
        pass


# =====================================================
# 🔄 SLOT UPDATE (FULL DATA)
# =====================================================
def broadcast_slot_update():
    """
    Send complete slot data to:
    - User live map
    - Admin dashboard
    - Occupancy panels
    """

    if not Slot:
        return

    try:
        slots = list(
            Slot.objects.select_related("zone", "zone__lot").values(
                "id",
                "code",
                "x",
                "y",
                "is_reserved",
                "is_occupied",
                "zone__label",
                "zone__lot__name",
            )
        )
    except Exception:
        return

    payload = {
        "type": "send_slot_update",
        "data": {
            "type": "slots_update",
            "slots": [
                {
                    "id": s["id"],
                    "code": s["code"],
                    "x": float(s["x"]),
                    "y": float(s["y"]),
                    "is_reserved": s["is_reserved"],
                    "is_occupied": s["is_occupied"],
                    "zone": s["zone__label"],
                    "lot": s["zone__lot__name"],
                }
                for s in slots
            ],
        },
    }

    # Send to all dashboards
    _safe_group_send("slots_group", payload)
    _safe_group_send("admin_slots_group", payload)


# =====================================================
# 🔁 SLOT REFRESH (LIGHTWEIGHT SIGNAL)
# =====================================================
def broadcast_slot_refresh():
    """
    Tell frontend to refetch slots via REST API.
    Used for polling fallback.
    """
    msg = {
        "type": "refresh_slots",
        "data": {
            "type": "refresh",
        },
    }

    _safe_group_send("slots_group", msg)
    _safe_group_send("admin_slots_group", msg)


# =====================================================
# 🚗 VEHICLE LIVE POSITION
# =====================================================
def broadcast_vehicle_position(vehicle_id, x, y, speed=0, heading=0):
    """
    Broadcast live GPS updates to:
    - User map
    - Admin control room
    """

    data = {
        "type": "vehicle_position",
        "data": {
            "type": "vehicle_position",
            "vehicle_id": int(vehicle_id),
            "x": float(x),
            "y": float(y),
            "speed": float(speed),
            "heading": int(heading),
        },
    }

    _safe_group_send("slots_group", data)
    _safe_group_send("vehicles_group", data)
    _safe_group_send("admin_vehicles_group", data)


# =====================================================
# 🛰️ ADMIN VEHICLE SNAPSHOT
# =====================================================
def broadcast_all_vehicle_positions():
    """
    Push full GPS snapshot to admin when admin connects.
    """

    if not VehiclePosition:
        return

    try:
        positions = list(
            VehiclePosition.objects.select_related("vehicle").values(
                "vehicle_id",
                "latitude",
                "longitude",
                "last_updated",
                "vehicle__vehicle_number",
            )
        )
    except Exception:
        return

    _safe_group_send(
        "admin_vehicles_group",
        {
            "type": "vehicle_snapshot",
            "data": {
                "type": "vehicle_snapshot",
                "vehicles": [
                    {
                        "vehicle_id": v["vehicle_id"],
                        "number": v["vehicle__vehicle_number"],
                        "lat": float(v["latitude"]),
                        "lng": float(v["longitude"]),
                        "time": v["last_updated"].isoformat(),
                    }
                    for v in positions
                ],
            },
        },
    )


# =====================================================
# 🚨 VIOLATIONS (USER + ADMIN)
# =====================================================
def broadcast_violation(violation):
    """
    Broadcast parking violations to admin control panel
    and optional user channels.
    """
    payload = {
        "type": "violation",
        "data": {
            "id": violation.id,
            "vehicle_plate": violation.vehicle.plate,
            "slot_code": violation.slot.code,
            "type": violation.type,
            "fine": float(violation.fine),
            "resolved": violation.resolved,
        },
    }

    _safe_group_send("admin", payload)
    _safe_group_send("violations", payload)

# 🔧 HOTFIX: prevent backend crash
async def broadcast_violation(data=None):
    pass

def broadcast_violation_sync(data=None):
    pass





