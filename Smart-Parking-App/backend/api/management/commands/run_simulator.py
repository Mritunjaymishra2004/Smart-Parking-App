import time
from django.core.management.base import BaseCommand
from api.vehicle_simulator import move_vehicles


class Command(BaseCommand):
    help = "Run the live vehicle movement simulator"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("🚗 Vehicle Simulator Started"))

        while True:
            try:
                move_vehicles()
            except Exception as e:
                self.stderr.write(f"Simulator error: {e}")

            time.sleep(5)
