"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for backend project.
"""

from django.contrib import admin
from django.urls import (
    path,
    include,
)

from django.http import HttpResponse


# =====================================================
# HOME
# =====================================================

def home(request):
    return HttpResponse(
        """
        <h1>Smart Parking System Backend Running</h1>

        <p>
            API Base URL:
            <a href="/api/">
                /api/
            </a>
        </p>

        <p>
            Django Admin:
            <a href="/admin/">
                /admin/
            </a>
        </p>

        <p>
            Google Login:
            <a href="/auth/login/google-oauth2/">
                Google OAuth
            </a>
        </p>
        """
    )


# =====================================================
# URLS
# =====================================================

urlpatterns = [

    # HOME
    path(
        "",
        home,
        name="home"
    ),

    # ADMIN
    path(
        "admin/",
        admin.site.urls
    ),

    # API
    path(
        "api/",
        include("api.urls")
    ),

    # GOOGLE AUTH
    path(
        "auth/",
        include(
            "social_django.urls",
            namespace="social"
        )
    ),
]