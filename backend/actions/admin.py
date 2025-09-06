"""
Django admin configuration for sustainability actions.

This module configures the Django admin interface for managing
sustainability actions through the web-based admin panel.
"""
from django.contrib import admin

# Note: Since we're using JSON file storage instead of Django models,
# we don't register any models with the admin interface.
# In a production environment with a database, you would register
# the SustainabilityAction model here for admin management.

# Example of what admin registration would look like with a Django model:
# from .models import SustainabilityAction
# 
# @admin.register(SustainabilityAction)
# class SustainabilityActionAdmin(admin.ModelAdmin):
#     list_display = ('id', 'action', 'date', 'points')
#     list_filter = ('date', 'points')
#     search_fields = ('action',)
#     ordering = ('-date', '-id')
