import os
from pathlib import Path
import environ
import dj_database_url
from corsheaders.defaults import default_headers
from django.core.exceptions import ImproperlyConfigured

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
env_path = BASE_DIR / ".env"
if env_path.exists():
    env.read_env(env_path)
    print(f"✅ .env file loaded successfully from: {env_path}")
    print("✅ DATABASE_URL loaded from .env:", env("DATABASE_URL", default=None))
else:
    print("❌ .env file not found at:", env_path)


# Safety check for secret key
SECRET_KEY = env("DJANGO_SECRET_KEY", default=None)
if not SECRET_KEY:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY not found in environment variables.")

# Debug mode
DEBUG = env.bool("DJANGO_DEBUG", default=False)

# Allowed hosts
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[
    "localhost",
    "127.0.0.1",
])


# Application definition
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "cloudinary",
    "cloudinary_storage",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "activitytracker",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[
    "http://localhost:3000",
    "https://psychic-lamp-pj7rjp4jvgg7f7jxr-3000.app.github.dev",
])

CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])
CORS_ALLOW_HEADERS = list(default_headers) + ['access-control-allow-origin']
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'

ROOT_URLCONF = "tracker.urls"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / 'react-build-temp',
            BASE_DIR / "activity-tracker-frontend" / "build",
            BASE_DIR / "activitytracker" / "templates",
            ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "tracker.wsgi.application"

# Database config
DATABASE_URL = env("DATABASE_URL", default=None)
print("✅ DATABASE_URL loaded from .env:", DATABASE_URL)

if not DATABASE_URL:
    raise ImproperlyConfigured("DATABASE_URL must be set in .env")




DATABASES = {
    "default": dj_database_url.config(default=DATABASE_URL)
}
if "ENGINE" not in DATABASES["default"]:
    DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql"

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']
LOGIN_REDIRECT_URL = "dashboard"
LOGOUT_REDIRECT_URL = "/"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "activity-tracker-frontend" / "build" / "static"
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Cloudinary config
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": env("CLOUD_NAME"),
    "API_KEY": env("API_KEY"),
    "API_SECRET": env("API_SECRET"),
}
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": "activitytracker.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "INFO",
            "propagate": True,
        },
    },
}
