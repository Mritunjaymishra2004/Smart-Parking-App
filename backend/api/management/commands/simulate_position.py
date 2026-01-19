# backend/api/management/commands/simulate_positions.py
from django.core.management.base import BaseCommand
import time, random
from backend.api.utils_ws import broadcast_position

class Command(BaseCommand):
    help = "Simulate vehicle positions"

    def handle(self, *args, **options):
        vehicle_id = 1
        x, y = 10.0, 10.0
        try:
            while True:
                # simple wandering movement
                x += random.uniform(-2, 2)
                y += random.uniform(-2, 2)
                x = max(0, min(100, x))
                y = max(0, min(100, y))
                speed = round(random.uniform(0, 20), 1)
                heading = random.randint(0, 359)
                broadcast_position(vehicle_id, round(x,2), round(y,2), speed, heading)
                time.sleep(1)
        except KeyboardInterrupt:
            print("Stopped simulation")
