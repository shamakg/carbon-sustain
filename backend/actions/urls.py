"""
URL configuration for the sustainability actions API.

This module defines the URL patterns for all API endpoints related to
sustainability actions management.
"""
from django.urls import path
from . import views

# URL patterns for the actions API
# All URLs are prefixed with 'api/' from the main project URLs
urlpatterns = [
    # Health check endpoint
    # GET /api/health/ - Check API status and get basic statistics
    path('health/', views.api_health_check, name='api-health-check'),
    
    # Actions list endpoint
    # GET /api/actions/ - Retrieve all sustainability actions
    # POST /api/actions/ - Create a new sustainability action
    path('actions/', views.action_list, name='action-list'),
    
    # Individual action endpoints
    # GET /api/actions/<id>/ - Retrieve a specific action
    # PUT /api/actions/<id>/ - Update all fields of a specific action
    # PATCH /api/actions/<id>/ - Partially update a specific action
    # DELETE /api/actions/<id>/ - Delete a specific action
    path('actions/<int:pk>/', views.action_detail, name='action-detail'),
]
