"""
Django app configuration for the actions application.
This module defines the configuration for the sustainability actions app.
"""
from django.apps import AppConfig


class ActionsConfig(AppConfig):
    """
    Configuration class for the actions app.
    Defines app-specific settings and metadata.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'actions'
    verbose_name = 'Sustainability Actions'
