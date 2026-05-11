from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import (
    Profile, ParkingLot, Zone, Slot, Vehicle, VehiclePosition
)
import random


class Command(BaseCommand):
    help = "Seed database with demo parking data"

    def handle(self, *args, **kwargs):

        # Create admin
        admin, _ = User.objects.get_or_create(
            username="admin@gmail.com",
            email="admin@gmail.com"
        )
        admin.set_password("Admin123")
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()

        Profile.objects.get_or_create(user=admin, role="admin")

        # Create parking lot
        lot, _ = ParkingLot.objects.get_or_create(
            name="Smart Parking Mall",
            address="City Center",
            operator=admin,
            latitude=28.61,
            longitude=77.20
        )

        # Zones
        zones = []
        for label in ["A", "B", "C"]:
            z, _ = Zone.objects.get_or_create(lot=lot, label=label)
            zones.append(z)

        # Slots
        slots = []
        for z in zones:
            for i in range(1, 11):
                s, _ = Slot.objects.get_or_create(
                    zone=z,
                    code=f"{z.label}{i}",
                    x=random.randint(5, 95),
                    y=random.randint(5, 95)
                )
                slots.append(s)

        # Users + vehicles
        for i in range(1, 6):
            u, _ = User.objects.get_or_create(
                username=f"user{i}@mail.com",
                email=f"user{i}@mail.com"
            )
            u.set_password("User123")
            u.save()

            Profile.objects.get_or_create(user=u)

            v, _ = Vehicle.objects.get_or_create(
                user=u,
                plate=f"UP32AB{i}23"
            )

            VehiclePosition.objects.get_or_create(
                vehicle=v,
                x=random.randint(10, 90),
                y=random.randint(10, 90)
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully"))
