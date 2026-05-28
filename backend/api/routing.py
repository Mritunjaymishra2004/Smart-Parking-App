from django.urls import path, re_path

from .consumers import (
    ParkingConsumer,
)

# =====================================================
# WEBSOCKET ROUTES
# =====================================================

websocket_urlpatterns = [

    # =================================================
    # MAIN PARKING SOCKET
    # =================================================

    re_path(

        r"ws/parking/",

        ParkingConsumer.as_asgi(),
    ),
]