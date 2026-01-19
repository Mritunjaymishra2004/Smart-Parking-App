from django.contrib.auth.models import User
from api.models import Slot, Zone, ParkingLot, Profile


def run():
    slots_to_create = 40

    # --------------------------------------------------
    # 1. Get Admin User (Parking Operator)
    # --------------------------------------------------
    admin_user = User.objects.filter(is_staff=True).first()

    if not admin_user:
        print("❌ No admin user found. Create admin first.")
        return

    operator, _ = Profile.objects.get_or_create(
        user=admin_user,
        defaults={"role": "admin"}
    )

    # --------------------------------------------------
    # 2. Create Parking Lot
    # --------------------------------------------------
    lot, _ = ParkingLot.objects.get_or_create(
        name="Main Parking",
        defaults={
            "latitude": 28.6139,
            "longitude": 77.2090,
            "is_active": True,
            "operator": operator   # 🔥 REQUIRED
        }
    )

    # --------------------------------------------------
    # 3. Create Zone
    # --------------------------------------------------
    zone, _ = Zone.objects.get_or_create(
        label="A",
        lot=lot
    )

    # --------------------------------------------------
    # 4. Create Slots
    # --------------------------------------------------
    created = 0

    for number in range(1, slots_to_create + 1):
        code = f"S{number}"

        if not Slot.objects.filter(code=code).exists():
            Slot.objects.create(
                code=code,
                level=1,
                zone=zone,
                is_reserved=False,
                is_occupied=False
            )
            created += 1

    print(f"✅ Successfully created {created} slots in {lot.name} (Zone {zone.label})")
