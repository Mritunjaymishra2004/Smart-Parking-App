# import os
# from pathlib import Path
# from datetime import timedelta
# from decouple import config


# # =====================================================
# # BASE
# # =====================================================

# BASE_DIR = Path(__file__).resolve().parent.parent


# # =====================================================
# # SECURITY
# # =====================================================

# SECRET_KEY = config("SECRET_KEY")

# DEBUG = config(
#     "DEBUG",
#     default=True,
#     cast=bool
# )

# ALLOWED_HOSTS = [
#     "localhost",
#     "127.0.0.1",
#     ".onrender.com",
# ]


# # =====================================================
# # APPS
# # =====================================================

# INSTALLED_APPS = [
#     "daphne",
#     "channels",

#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",

#     "corsheaders",
#     "rest_framework",
#     "rest_framework_simplejwt",
#     "rest_framework_simplejwt.token_blacklist",

#     # GOOGLE AUTH
#     "social_django",

#     "api",
# ]


# # =====================================================
# # AUTH BACKENDS
# # =====================================================

# AUTHENTICATION_BACKENDS = (
#     "social_core.backends.google.GoogleOAuth2",
#     "django.contrib.auth.backends.ModelBackend",
# )


# # =====================================================
# # GOOGLE OAUTH
# # =====================================================

# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config(
#     "GOOGLE_CLIENT_ID",
#     default=""

# )

# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config(
#     "GOOGLE_CLIENT_SECRET"
#     default=""
# )



# # =====================================================
# # MIDDLEWARE
# # =====================================================

# MIDDLEWARE = [
#     "corsheaders.middleware.CorsMiddleware",
#     "django.middleware.security.SecurityMiddleware",
#     "whitenoise.middleware.WhiteNoiseMiddleware",
#     "django.contrib.sessions.middleware.SessionMiddleware",
#     "django.middleware.common.CommonMiddleware",
#     "django.middleware.csrf.CsrfViewMiddleware",
#     "django.contrib.auth.middleware.AuthenticationMiddleware",

#     # SOCIAL AUTH
#     "social_django.middleware.SocialAuthExceptionMiddleware",

#     "django.contrib.messages.middleware.MessageMiddleware",
#     "django.middleware.clickjacking.XFrameOptionsMiddleware",
# ]


# # =====================================================
# # URLS
# # =====================================================

# ROOT_URLCONF = "backend.urls"


# # =====================================================
# # TEMPLATES
# # =====================================================

# TEMPLATES = [
#     {
#         "BACKEND":
#         "django.template.backends.django.DjangoTemplates",

#         "DIRS": [],

#         "APP_DIRS": True,

#         "OPTIONS": {
#             "context_processors": [
#                 "django.template.context_processors.request",
#                 "django.contrib.auth.context_processors.auth",
#                 "django.contrib.messages.context_processors.messages",

#                 "social_django.context_processors.backends",
#                 "social_django.context_processors.login_redirect",
#             ],
#         },
#     },
# ]

# # =====================================================
# # ASGI / WSGI
# # =====================================================

# WSGI_APPLICATION = "backend.wsgi.application"
# ASGI_APPLICATION = "backend.asgi.application"

# # =====================================================
# # CHANNEL LAYERS
# # =====================================================

# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND":
#         "channels.layers.InMemoryChannelLayer",
#     },
# }

# # =====================================================
# # DATABASE
# # =====================================================

# USE_SQLITE = config(
#     "USE_SQLITE",
#     default=True,
#     cast=bool
# )

# if USE_SQLITE:
#     DATABASES = {
#         "default": {
#             "ENGINE":
#             "django.db.backends.sqlite3",

#             "NAME":
#             BASE_DIR / "db.sqlite3",
#         }
#     }


# # =====================================================
# # PASSWORDS
# # =====================================================

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME":
#         "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
#     },
#     {
#         "NAME":
#         "django.contrib.auth.password_validation.MinimumLengthValidator"
#     },
# ]


# # =====================================================
# # REST FRAMEWORK
# # =====================================================

# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework_simplejwt.authentication.JWTAuthentication",
#     ),
# }


# # =====================================================
# # JWT
# # =====================================================

# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME":
#     timedelta(minutes=60),

#     "REFRESH_TOKEN_LIFETIME":
#     timedelta(days=7),
# }


# # =====================================================
# # CORS
# # =====================================================

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
# ]

# CORS_ALLOW_CREDENTIALS = True


# # =====================================================
# # STATIC
# # =====================================================

# STATIC_URL = "/static/"


# # =====================================================
# # DEFAULT PK
# # =====================================================

# DEFAULT_AUTO_FIELD = (
#     "django.db.models.BigAutoField"
# )     










from pathlib import Path
from datetime import timedelta
from decouple import config


# =====================================================
# BASE
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# =====================================================
# SECURITY
# =====================================================

SECRET_KEY = config(
    "SECRET_KEY",
    default="smart-parking-secret"
)

DEBUG = config(
    "DEBUG",
    default=True,
    cast=bool
)

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]


# =====================================================
# APPS
# =====================================================

INSTALLED_APPS = [
    "daphne",
    "channels",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    "social_django",

    "api",
]


# =====================================================
# AUTH BACKENDS
# =====================================================

AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)


# =====================================================
# GOOGLE AUTH
# =====================================================

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config(
    "GOOGLE_CLIENT_ID",
    default=""
)

SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config(
    "GOOGLE_CLIENT_SECRET",
    default=""
)


# =====================================================
# MIDDLEWARE
# =====================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "social_django.middleware.SocialAuthExceptionMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =====================================================
# URLS
# =====================================================

ROOT_URLCONF = "backend.urls"


# =====================================================
# TEMPLATES
# =====================================================

TEMPLATES = [
    {
        "BACKEND":
        "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "social_django.context_processors.backends",
                "social_django.context_processors.login_redirect",
            ],
        },
    },
]


# =====================================================
# ASGI / WSGI
# =====================================================

WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"


# =====================================================
# CHANNEL LAYERS
# =====================================================

CHANNEL_LAYERS = {
    "default": {
        "BACKEND":
        "channels.layers.InMemoryChannelLayer",
    },
}


# =====================================================
# DATABASE
# =====================================================

DATABASES = {
    "default": {
        "ENGINE":
        "django.db.backends.sqlite3",
        "NAME":
        BASE_DIR / "db.sqlite3",
    }
}


# =====================================================
# PASSWORDS
# =====================================================

AUTH_PASSWORD_VALIDATORS = []


# =====================================================
# REST
# =====================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# =====================================================
# JWT
# =====================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":
    timedelta(minutes=60),

    "REFRESH_TOKEN_LIFETIME":
    timedelta(days=7),
}


# =====================================================
# CORS
# =====================================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    "http://localhost:5174",
    "http://127.0.0.1:5174",

    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    "http://localhost:5174",
    "http://127.0.0.1:5174",

    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# =====================================================
# STATIC
# =====================================================

STATIC_URL = "/static/"


# =====================================================
# DEFAULT PK
# =====================================================

DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)