import random
from .models import VehiclePosition, Vehicle


def move_vehicles():
    """
    Moves every vehicle slightly inside the parking map.
    This function is called by the simulator management command.
    """

    for v in Vehicle.objects.all():

        pos, created = VehiclePosition.objects.get_or_create(
            vehicle=v,
            defaults={
                "x": random.randint(10, 90),
                "y": random.randint(10, 90),
                "speed": 0,
                "heading": 0,
            },
        )

        # Move vehicle randomly
        pos.x = max(5, min(95, pos.x + random.randint(-5, 5)))
        pos.y = max(5, min(95, pos.y + random.randint(-5, 5)))

        # Save triggers WebSocket broadcast via signals.py
        pos.save()
