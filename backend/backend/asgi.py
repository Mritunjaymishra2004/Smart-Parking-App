"""
ASGI config for backend project.

Supports:
- HTTP via Django
- WebSocket via Django Channels with JWT authentication
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.routing import websocket_urlpatterns
from api.middleware import JWTAuthMiddleware

# 🔹 Ensure correct Django settings are loaded
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 🔹 Setup Django before ASGI loads models
django.setup()

# 🔹 Django ASGI application
django_asgi_app = get_asgi_application()

# 🔹 Main ASGI router
application = ProtocolTypeRouter({
    # =====================================================
    # 🌐 HTTP (Django REST APIs & Admin)
    # =====================================================
    "http": django_asgi_app,

    # =====================================================
    # 🔌 WebSocket (JWT + Sessions + Channels)
    # =====================================================
    "websocket": JWTAuthMiddleware(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})


# from api.monitor import start_monitor
# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": JWTAuthMiddleware(
#         AuthMiddlewareStack(
#             URLRouter(websocket_urlpatterns)
#         )
#     ),
# })

# # 🚨 Start violation monitor
# start_monitor()

