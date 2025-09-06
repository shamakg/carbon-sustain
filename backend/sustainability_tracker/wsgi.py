"""
WSGI config for sustainability_tracker project.

This module contains the WSGI callable used by WSGI-compatible web servers
to serve the Django application in production environments.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set the default settings module for the Django application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sustainability_tracker.settings')

# Get the WSGI application callable
application = get_wsgi_application()
