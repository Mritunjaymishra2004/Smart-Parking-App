import time
from .vehicle_simulator import move_vehicles

while True:
    try:
        move_vehicles()
    except Exception as e:
        print("Vehicle simulator error:", e)
    time.sleep(5)
