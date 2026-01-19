from django.utils import timezone
from api.models import Reservation, Session, Violation, Event
from decimal import Decimal
from api.utils_ws import broadcast_violation

OVERSTAY_FINE_PER_MIN = Decimal("10.00")
NO_BOOKING_FINE = Decimal("500.00")


def run_parking_monitor():
    now = timezone.now()

    # -----------------------------------
    # 1. OVERSTAY: Reservation expired
    # -----------------------------------
    expired = Reservation.objects.filter(
        end_time__lt=now,
        status="ACTIVE"
    )

    for res in expired:
        minutes = (now - res.end_time).seconds // 60
        fine = minutes * OVERSTAY_FINE_PER_MIN

        v, created = Violation.objects.get_or_create(
            vehicle=res.vehicle,
            slot=res.slot,
            type="OVERSTAY",
            resolved=False,
            defaults={"fine": fine}
        )

        if not created:
            v.fine = fine
            v.save()

        Event.objects.create(
            type="OVERSTAY",
            subject=res.vehicle.plate,
            metadata={"slot": res.slot.code, "fine": float(fine)}
        )

        broadcast_violation(v)

    # -----------------------------------
    # 2. NO BOOKING parked vehicles
    # -----------------------------------
    active_sessions = Session.objects.filter(exit_time__isnull=True)

    for s in active_sessions:
        has_booking = Reservation.objects.filter(
            vehicle=s.vehicle,
            slot=s.slot,
            status="ACTIVE"
        ).exists()

        if not has_booking:
            Violation.objects.get_or_create(
                vehicle=s.vehicle,
                slot=s.slot,
                type="NO_BOOKING",
                resolved=False,
                defaults={"fine": NO_BOOKING_FINE}
            )
