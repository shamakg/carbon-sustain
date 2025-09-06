"""
Django settings for sustainability_tracker project.

This module contains all the configuration settings for the Django application,
including database configuration, installed apps, middleware, and API settings.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# In production, this should be loaded from environment variables
SECRET_KEY = 'django-insecure-your-secret-key-here-change-in-production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allowed hosts for the application
# In production, specify your domain names here
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Application definition
# Core Django apps and third-party packages required for the project
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps for REST API functionality
    'rest_framework',
    'corsheaders',  # Enable CORS for frontend integration
    
    # Local apps
    'actions',  # Our sustainability actions app
]

# Middleware configuration
# Order matters - CORS middleware should be near the top
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Handle CORS headers
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL configuration
ROOT_URLCONF = 'sustainability_tracker.urls'

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

# WSGI application
WSGI_APPLICATION = 'sustainability_tracker.wsgi.application'

# Database configuration
# Using SQLite for simplicity, but can be changed to PostgreSQL/MySQL in production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# Ensures strong password requirements for user accounts
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

# Internationalization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,  # Limit results per page for better performance
}

# CORS settings for frontend integration
# Allow requests from React development server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
]

# Allow all origins during development (disable in production)
CORS_ALLOW_ALL_ORIGINS = DEBUG

# JSON file path for data storage
# This is where sustainability actions will be stored
JSON_DATA_FILE = BASE_DIR / 'data' / 'actions.json'

# Ensure data directory exists
os.makedirs(BASE_DIR / 'data', exist_ok=True)
