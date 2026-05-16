import os

from pathlib import Path

from datetime import timedelta

from decouple import config



# =====================================================
# BASE DIRECTORY
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# =====================================================
# SECURITY
# =====================================================

SECRET_KEY = config("SECRET_KEY")

DEBUG = config(
    "DEBUG",
    default=False,
    cast=bool
)

ALLOWED_HOSTS = ["*"]
# ALLOWED_HOSTS = [

#     "localhost",

#     "127.0.0.1",

#     ".onrender.com",
# ]


# =====================================================
# APPLICATIONS
# =====================================================

INSTALLED_APPS = [

    
    #"daphne",

    #"channels",

    # Django
    "django.contrib.admin",

    "django.contrib.auth",

    "django.contrib.contenttypes",

    "django.contrib.sessions",

    "django.contrib.messages",

    "django.contrib.staticfiles",

    # Third Party
    "corsheaders",

    "rest_framework",

    "rest_framework_simplejwt",

    "rest_framework_simplejwt.token_blacklist",

    # Local Apps
    "api",
]


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
            ],
        },
    },
]


# =====================================================
# ASGI / WSGI
# =====================================================

WSGI_APPLICATION = "backend.wsgi.application"

#ASGI_APPLICATION = "backend.asgi.application"


# =====================================================
# DATABASE
# =====================================================

USE_SQLITE = config(
    "USE_SQLITE",
    default=True,
    cast=bool
)

if USE_SQLITE:

    DATABASES = {

        "default": {

            "ENGINE":
                "django.db.backends.sqlite3",

            "NAME":
                BASE_DIR / "db.sqlite3",
        }
    }

else:

    DATABASES = {

        "default": {

            "ENGINE":
                "django.db.backends.postgresql",

            "NAME":
                config("DB_NAME"),

            "USER":
                config("DB_USER"),

            "PASSWORD":
                config("DB_PASSWORD"),

            "HOST":
                config("DB_HOST"),

            "PORT":
                config("DB_PORT"),
        }
    }


# =====================================================
# PASSWORD VALIDATION
# =====================================================

AUTH_PASSWORD_VALIDATORS = [

    {

        "NAME":
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },

    {

        "NAME":
            "django.contrib.auth.password_validation.MinimumLengthValidator",
    },

    {

        "NAME":
            "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
]


# =====================================================
# INTERNATIONALIZATION
# =====================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True

USE_TZ = True


# =====================================================
# STATIC FILES
# =====================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

STATICFILES_DIRS = [

    BASE_DIR / "static"
]


# =====================================================
# DEFAULT PRIMARY KEY
# =====================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"



# =====================================================
# DJANGO REST FRAMEWORK
# =====================================================

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES": (

        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": (

        "rest_framework.permissions.IsAuthenticated",
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

    "ROTATE_REFRESH_TOKENS":
        True,

    "BLACKLIST_AFTER_ROTATION":
        True,

    "AUTH_HEADER_TYPES":
        ("Bearer",),
}


# =====================================================
# CORS
# =====================================================

CORS_ALLOWED_ORIGINS = [

    "http://localhost:5173",
    
    "https://smart-parking-app-hazel.vercel.app",
    
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
# =====================================================
# CSRF
# =====================================================

CSRF_TRUSTED_ORIGINS = [

    "http://localhost:5173",

    "https://smart-parking-app-hazel.vercel.app",

    "https://smart-parking-app-hazel.vercel.app",
]


# =====================================================
# CHANNEL LAYERS
# =====================================================

# USE_REDIS = config(
#     "USE_REDIS",
#     default=False,
#     cast=bool
# )

# if USE_REDIS:

#     CHANNEL_LAYERS = {

#         "default": {

#             "BACKEND":
#                 "channels_redis.core.RedisChannelLayer",

#             "CONFIG": {

#                 "hosts": [

#                     (
#                         config(
#                             "REDIS_HOST",
#                             default="127.0.0.1"
#                         ),

#                         config(
#                             "REDIS_PORT",
#                             default=6379,
#                             cast=int
#                         ),
#                     )
#                 ],
#             },
#         },
#     }

# else:

#     CHANNEL_LAYERS = {

#         "default": {

#             "BACKEND":
#                 "channels.layers.InMemoryChannelLayer",
#         },
#     }


# =====================================================
# SECURITY SETTINGS
# =====================================================

SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_TYPE_NOSNIFF = True

X_FRAME_OPTIONS = "DENY"

SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_HTTPONLY = True

SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"


# =====================================================
# HTTPS SECURITY (PRODUCTION)
# =====================================================

if not DEBUG:

    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

    SECURE_HSTS_SECONDS = 31536000

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SECURE_HSTS_PRELOAD = True


# =====================================================
# LOGGING
# =====================================================

LOGGING = {

    "version": 1,

    "disable_existing_loggers": False,

    "handlers": {

        "console": {

            "class":
                "logging.StreamHandler",
        },
    },

    "root": {

        "handlers": ["console"],

        "level": "INFO",
    },
}
