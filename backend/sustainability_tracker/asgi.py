"""
ASGI config for sustainability_tracker project.

This module contains the ASGI callable used by ASGI-compatible web servers
to serve the Django application with async support.
"""

import os
from django.core.asgi import get_asgi_application

# Set the default settings module for the Django application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sustainability_tracker.settings')

# Get the ASGI application callable
application = get_asgi_application()
