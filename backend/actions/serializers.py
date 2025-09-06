"""
Django REST Framework serializers for sustainability actions.

This module contains serializers that handle data validation,
serialization, and deserialization for the sustainability actions API.
"""
from rest_framework import serializers
from datetime import datetime
from .models import SustainabilityAction


class SustainabilityActionSerializer(serializers.Serializer):
    """
    Serializer for SustainabilityAction model.
    
    Handles validation and conversion between JSON data and Python objects
    for sustainability actions. Provides comprehensive field validation
    to ensure data integrity.
    """
    
    # Primary key field - read-only, auto-generated
    id = serializers.IntegerField(read_only=True)
    
    # Action description field with validation
    action = serializers.CharField(
        max_length=255,
        required=True,
        allow_blank=False,
        help_text="Description of the sustainability action (max 255 characters)"
    )
    
    # Date field with ISO format validation
    date = serializers.DateField(
        required=True,
        input_formats=['%Y-%m-%d'],
        help_text="Date when the action was performed (YYYY-MM-DD format)"
    )
    
    # Points field with positive integer validation
    points = serializers.IntegerField(
        required=True,
        min_value=0,
        help_text="Points awarded for the sustainability action (must be non-negative)"
    )
    
    def validate_action(self, value):
        """
        Custom validation for the action field.
        
        Args:
            value (str): The action description to validate
            
        Returns:
            str: The validated and cleaned action description
            
        Raises:
            serializers.ValidationError: If the action is invalid
        """
        # Remove leading/trailing whitespace
        value = value.strip()
        
        # Check if action is empty after stripping whitespace
        if not value:
            raise serializers.ValidationError("Action description cannot be empty or only whitespace.")
        
        # Check for minimum meaningful length
        if len(value) < 3:
            raise serializers.ValidationError("Action description must be at least 3 characters long.")
        
        return value
    
    def validate_date(self, value):
        """
        Custom validation for the date field.
        
        Args:
            value (date): The date to validate
            
        Returns:
            date: The validated date
            
        Raises:
            serializers.ValidationError: If the date is invalid
        """
        # Convert to datetime for comparison if it's a string
        if isinstance(value, str):
            try:
                value = datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Date must be in YYYY-MM-DD format.")
        
        # Check if date is not in the future (optional business rule)
        today = datetime.now().date()
        if value > today:
            raise serializers.ValidationError("Action date cannot be in the future.")
        
        return value
    
    def validate_points(self, value):
        """
        Custom validation for the points field.
        
        Args:
            value (int): The points value to validate
            
        Returns:
            int: The validated points value
            
        Raises:
            serializers.ValidationError: If the points value is invalid
        """
        # Ensure points is a valid integer
        if not isinstance(value, int):
            try:
                value = int(value)
            except (ValueError, TypeError):
                raise serializers.ValidationError("Points must be a valid integer.")
        
        # Business rule: reasonable maximum points limit
        if value > 1000:
            raise serializers.ValidationError("Points cannot exceed 1000 per action.")
        
        return value
    
    def create(self, validated_data):
        """
        Create and return a new SustainabilityAction instance.
        
        Args:
            validated_data (dict): Validated data from the serializer
            
        Returns:
            SustainabilityAction: The newly created action instance
        """
        # Convert date to string format for storage
        if 'date' in validated_data:
            validated_data['date'] = validated_data['date'].strftime('%Y-%m-%d')
        
        # Create new action instance and save to JSON file
        action = SustainabilityAction(**validated_data)
        return action.save()
    
    def update(self, instance, validated_data):
        """
        Update and return an existing SustainabilityAction instance.
        
        Args:
            instance (SustainabilityAction): The existing action to update
            validated_data (dict): Validated data from the serializer
            
        Returns:
            SustainabilityAction: The updated action instance
        """
        # Update instance attributes with validated data
        instance.action = validated_data.get('action', instance.action)
        instance.points = validated_data.get('points', instance.points)
        
        # Handle date field conversion
        if 'date' in validated_data:
            date_value = validated_data['date']
            if hasattr(date_value, 'strftime'):
                instance.date = date_value.strftime('%Y-%m-%d')
            else:
                instance.date = str(date_value)
        
        # Save updated instance to JSON file
        return instance.save()
    
    def to_representation(self, instance):
        """
        Convert model instance to JSON representation.
        
        Args:
            instance (SustainabilityAction): The action instance to serialize
            
        Returns:
            dict: JSON-serializable representation of the action
        """
        # Get the base representation
        data = super().to_representation(instance)
        
        # Ensure consistent data types in output
        if isinstance(instance, SustainabilityAction):
            data.update({
                'id': instance.id,
                'action': instance.action,
                'date': instance.date,
                'points': instance.points
            })
        
        return data
