import os
from pathlib import Path
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured
import dj_database_url

# Define the path to the .env file
env_path = Path(__file__).resolve().parent.parent / '.env'
print(f"Loading .env from: {env_path}")

# Load environment variables
load_dotenv(dotenv_path=env_path)

# Fetch SECRET_KEY
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
print(f"SECRET_KEY Loaded: {SECRET_KEY}")

if not SECRET_KEY:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY not found in environment variables.")

BASE_DIR = Path(__file__).resolve().parent.parent


DEBUG = True

ALLOWED_HOSTS = ["8000-raypt808-activitytracke-ah5qjhh5q2d.ws-eu117.gitpod.io",
                "8000-raypt808-activitytracke-9wucwoxo1t9.ws-eu117.gitpod.io",
                "8000-raypt808-activitytracke-svioy05v8cj.ws-eu117.gitpod.io",
                "https://8000-raypt808-activitytracke-svioy05v8cj.ws-eu117.gitpod.io/activitytracker/register/",
                "https://8000-raypt808-activitytracke-svioy05v8cj.ws-eu117.gitpod.io",
                "8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io",
                "activitytracking-bf7924cd3676.herokuapp.com",
                "reactivity-789dd5d26427.herokuapp.com",
                "activitytracker.herokuapp.com",
                "localhost",
                "127.0.0.1"
                 ]


INSTALLED_APPS = [
    'corsheaders',  
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary',
    'cloudinary_storage',
    'rest_framework',
    'activitytracker',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
]

CSRF_TRUSTED_ORIGINS = [
    "https://*.codeinstitute-ide.net",
    "https://*.herokuapp.com",
    "https://8000-raypt808-activitytracke-ah5qjhh5q2d.ws-eu117.gitpod.io",
    "https://8000-raypt808-activitytracke-svioy05v8cj.ws-eu117.gitpod.io",
    "https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io",
    "http://localhost:3000",
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
    
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://8000-raypt808-activitytracke-f1ujeofz1qb.ws-eu117.gitpod.io",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

ROOT_URLCONF = 'tracker.urls'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'activitytracker/templates', 'staticfiles', 'build'),  
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tracker.wsgi.application'


DATABASES = {
    'default': dj_database_url.parse(os.environ.get("DATABASE_URL", "postgresql://neondb_owner:YXaA8Ks6MuQy@ep-bitter-scene-a2sxt9p7.eu-central-1.aws.neon.tech/stall_grant_chess_882851"))
}



AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGIN_REDIRECT_URL = 'dashboard' 

LOGOUT_REDIRECT_URL = '/'


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

WHITENOISE_ROOT = os.path.join(BASE_DIR, 'staticfiles', 'build')


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET')
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

