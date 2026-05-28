"""
ASGI config for backend project.

Supports:

- HTTP via Django
- WebSocket via Django Channels
- JWT Authentication
- Real-time Smart Parking Updates
"""

import os
import django

from django.core.asgi import (
    get_asgi_application
)

from channels.routing import (

    ProtocolTypeRouter,

    URLRouter,
)

from channels.auth import (
    AuthMiddlewareStack
)

from api.routing import (
    websocket_urlpatterns
)

from api.middleware import (
    JWTAuthMiddleware
)


# =====================================================
# DJANGO SETTINGS
# =====================================================

os.environ.setdefault(

    "DJANGO_SETTINGS_MODULE",

    "backend.settings"
)


# =====================================================
# DJANGO SETUP
# =====================================================

django.setup()


# =====================================================
# DJANGO ASGI APP
# =====================================================

django_asgi_app = (
    get_asgi_application()
)


# =====================================================
# MAIN APPLICATION
# =====================================================

application = ProtocolTypeRouter({

    # =================================================
    # HTTP
    # =================================================

    "http":

        django_asgi_app,

    # =================================================
    # WEBSOCKET
    # =================================================

    "websocket":

        JWTAuthMiddleware(

            AuthMiddlewareStack(

                URLRouter(
                    websocket_urlpatterns
                )
            )
        ),
})