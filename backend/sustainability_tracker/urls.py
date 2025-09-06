"""
URL configuration for sustainability_tracker project.

This module defines the main URL routing for the Django application,
including API endpoints and admin interface.
"""
from django.contrib import admin
from django.urls import path, include

# Main URL patterns for the application
urlpatterns = [
    # Django admin interface for database management
    path('admin/', admin.site.urls),
    
    # API endpoints for sustainability actions
    # All API routes are prefixed with 'api/' for clear separation
    path('api/', include('actions.urls')),
]
