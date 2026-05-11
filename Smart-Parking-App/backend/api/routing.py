from django.urls import path
from .consumers import SlotsConsumer, VehicleConsumer

# =====================================================
# WebSocket Routes
# =====================================================
websocket_urlpatterns = [
    # Live parking slot updates
    path("ws/slots/", SlotsConsumer.as_asgi()),

    # Live vehicle GPS tracking
    path("ws/vehicles/", VehicleConsumer.as_asgi()),

    # 🔹 Added: Admin real-time dashboard (same slots stream)
    path("ws/admin/slots/", SlotsConsumer.as_asgi()),

    # 🔹 Added: Admin live vehicle monitoring
    path("ws/admin/vehicles/", VehicleConsumer.as_asgi()),
]
