import os
from pathlib import Path

import cloudinary
import cloudinary.api
import cloudinary.uploader
import dj_database_url
import environ
from django.core.exceptions import ImproperlyConfigured
from corsheaders.defaults import default_headers


env = environ.Env()
env_path = Path(__file__).resolve().parent.parent / ".env"
env.read_env(env_path)

print(f"Loading .env from: {env_path}")
print(f"DEBUG in .env: {os.getenv('DEBUG')}")
print(f"SECRET_KEY Loaded: {os.getenv('DJANGO_SECRET_KEY')}")

BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = False

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "reactivity-789dd5d26427.herokuapp.com",
    "activitytracking-bf7924cd3676.herokuapp.com",
    "activitytracker.herokuapp.com",
    "psychic-lamp-pj7rjp4jvgg7f7jxr-8000.app.github.dev",
    "psychic-lamp-pj7rjp4jvgg7f7jxr-3000.app.github.dev",
]

SECRET_KEY = "FGvAWrQpr-HaE_aF0Oy6pMD0-G9aElmE9Qs2C61VOnUrLeHH4NnXqzv61i_Dmr9VVD4"
if not SECRET_KEY:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY not found in environment variables.")

DATABASES = {
    "default": dj_database_url.config(
        default="postgres://neondb_owner:YXaA8Ks6MuQy@ep-bitter-scene-a2sxt9p7.eu-central-1.aws.neon.tech/stall_grant_chess_882851"
    )
}

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



CORS_ALLOWED_ORIGINS = [
    "https://psychic-lamp-pj7rjp4jvgg7f7jxr-3000.app.github.dev",
    "https://reactivity-789dd5d26427.herokuapp.com",

]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://psychic-lamp-pj7rjp4jvgg7f7jxr-3000.app.github.dev",
    "https://reactivity-789dd5d26427.herokuapp.com",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'access-control-allow-origin',
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",  
    "PATCH",
    "POST",
    "PUT",
]


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
            os.path.join(BASE_DIR, "activitytracker/templates", "staticfiles", "build"),
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

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgres://neondb_owner:YXaA8Ks6MuQy@ep-bitter-scene-a2sxt9p7.eu-central-1.aws.neon.tech/stall_grant_chess_882851",
)

DATABASES = {"default": dj_database_url.config(default=DATABASE_URL)}
if "ENGINE" not in DATABASES["default"]:
    DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

LOGIN_REDIRECT_URL = "dashboard"
LOGOUT_REDIRECT_URL = "/"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
WHITENOISE_ROOT = os.path.join(BASE_DIR, "staticfiles", "build")

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": env("CLOUD_NAME"),
    "API_KEY": env("API_KEY"),
    "API_SECRET": env("API_SECRET"),
}

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

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
