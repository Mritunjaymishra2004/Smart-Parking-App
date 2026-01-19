import threading
import time
from decimal import Decimal
from django.utils import timezone

from api.models import Reservation, Session, Violation, Event
from api.utils_ws import broadcast_violation_sync as broadcast_violation


# -----------------------------------------
# FINE RULES
# -----------------------------------------
OVERSTAY_FINE_PER_MIN = Decimal("10.00")
NO_BOOKING_FINE = Decimal("500.00")


# =====================================================
# 🚦 SMART PARKING MONITOR
# =====================================================
def parking_monitor_loop():
    print("🚦 Smart Parking Violation Monitor Started")

    while True:
        try:
            now = timezone.now()

            # ======================================
            # 1️⃣ OVERSTAY VIOLATIONS
            # ======================================
            expired_reservations = Reservation.objects.filter(
                end_time__lt=now,
                status="ACTIVE"
            )

            for res in expired_reservations:
                minutes = max(1, int((now - res.end_time).total_seconds() // 60))
                fine = minutes * OVERSTAY_FINE_PER_MIN

                violation, created = Violation.objects.get_or_create(
                    vehicle=res.vehicle,
                    slot=res.slot,
                    type="OVERSTAY",
                    resolved=False,
                    defaults={"fine": fine}
                )

                # Update fine live
                if not created:
                    violation.fine = fine
                    violation.save(update_fields=["fine"])

                # Log audit trail
                Event.objects.create(
                    type="OVERSTAY",
                    subject=res.vehicle.plate,
                    metadata={
                        "slot": res.slot.code,
                        "minutes": minutes,
                        "fine": float(fine),
                    }
                )

                # Push to admin dashboard
                broadcast_violation(violation)

            # ======================================
            # 2️⃣ NO BOOKING VIOLATIONS
            # ======================================
            active_sessions = Session.objects.filter(exit_time__isnull=True)

            for session in active_sessions:
                has_booking = Reservation.objects.filter(
                    vehicle=session.vehicle,
                    slot=session.slot,
                    status="ACTIVE"
                ).exists()

                if not has_booking:
                    violation, created = Violation.objects.get_or_create(
                        vehicle=session.vehicle,
                        slot=session.slot,
                        type="NO_BOOKING",
                        resolved=False,
                        defaults={"fine": NO_BOOKING_FINE}
                    )

                    if created:
                        Event.objects.create(
                            type="NO_BOOKING",
                            subject=session.vehicle.plate,
                            metadata={
                                "slot": session.slot.code,
                                "fine": float(NO_BOOKING_FINE),
                            }
                        )

                        broadcast_violation(violation)

        except Exception as e:
            # Never crash background thread
            print("⚠ Parking monitor error:", e)

        time.sleep(30)   # Run every 30 seconds


# =====================================================
# 🚀 START THREAD
# =====================================================
def start_monitor():
    """
    Call this from AppConfig.ready()
    """
    t = threading.Thread(target=parking_monitor_loop, daemon=True)
    t.start()


