"""
Django models for sustainability actions.

This module defines the data structure for sustainability actions,
including validation and JSON file operations.
"""
import json
import os
from datetime import datetime
from django.conf import settings
from django.core.exceptions import ValidationError


class SustainabilityAction:
    """
    Model class for sustainability actions.
    
    This class handles CRUD operations for sustainability actions
    using JSON file storage instead of a traditional database.
    
    Attributes:
        id (int): Unique identifier for the action
        action (str): Description of the sustainability action (max 255 chars)
        date (str): Date when the action was performed (YYYY-MM-DD format)
        points (int): Points awarded for the action
    """
    
    def __init__(self, id=None, action="", date="", points=0):
        """
        Initialize a new sustainability action.
        
        Args:
            id (int, optional): Unique identifier. Auto-generated if not provided.
            action (str): Description of the sustainability action
            date (str): Date in YYYY-MM-DD format
            points (int): Points awarded for the action
        """
        self.id = id
        self.action = action
        self.date = date
        self.points = points
    
    def validate(self):
        """
        Validate the sustainability action data.
        
        Raises:
            ValidationError: If any field contains invalid data
        """
        errors = []
        
        # Validate action field
        if not self.action or len(self.action.strip()) == 0:
            errors.append("Action description is required")
        elif len(self.action) > 255:
            errors.append("Action description must be 255 characters or less")
        
        # Validate date field
        if not self.date:
            errors.append("Date is required")
        else:
            try:
                datetime.strptime(self.date, '%Y-%m-%d')
            except ValueError:
                errors.append("Date must be in YYYY-MM-DD format")
        
        # Validate points field
        if not isinstance(self.points, int):
            try:
                self.points = int(self.points)
            except (ValueError, TypeError):
                errors.append("Points must be a valid integer")
        
        if self.points < 0:
            errors.append("Points cannot be negative")
        
        if errors:
            raise ValidationError(errors)
    
    def to_dict(self):
        """
        Convert the action to a dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary representation of the action
        """
        return {
            'id': self.id,
            'action': self.action,
            'date': self.date,
            'points': self.points
        }
    
    @classmethod
    def from_dict(cls, data):
        """
        Create a SustainabilityAction instance from a dictionary.
        
        Args:
            data (dict): Dictionary containing action data
            
        Returns:
            SustainabilityAction: New instance created from the data
        """
        return cls(
            id=data.get('id'),
            action=data.get('action', ''),
            date=data.get('date', ''),
            points=data.get('points', 0)
        )
    
    @staticmethod
    def _get_json_file_path():
        """
        Get the path to the JSON data file.
        
        Returns:
            str: Path to the JSON file for storing actions
        """
        return settings.JSON_DATA_FILE
    
    @staticmethod
    def _load_actions_from_file():
        """
        Load all actions from the JSON file.
        
        Returns:
            list: List of action dictionaries loaded from file
        """
        file_path = SustainabilityAction._get_json_file_path()
        
        # Create empty file if it doesn't exist
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                json.dump([], f)
            return []
        
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            # Return empty list if file is corrupted or missing
            return []
    
    @staticmethod
    def _save_actions_to_file(actions):
        """
        Save actions list to the JSON file.
        
        Args:
            actions (list): List of action dictionaries to save
        """
        file_path = SustainabilityAction._get_json_file_path()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w') as f:
            json.dump(actions, f, indent=2)
    
    @staticmethod
    def _get_next_id():
        """
        Generate the next available ID for a new action.
        
        Returns:
            int: Next available ID
        """
        actions = SustainabilityAction._load_actions_from_file()
        if not actions:
            return 1
        
        # Find the maximum ID and add 1
        max_id = max(action.get('id', 0) for action in actions)
        return max_id + 1
    
    def save(self):
        """
        Save the current action to the JSON file.
        
        Returns:
            SustainabilityAction: The saved action instance
            
        Raises:
            ValidationError: If the action data is invalid
        """
        # Validate the action before saving
        self.validate()
        
        actions = self._load_actions_from_file()
        
        if self.id is None:
            # New action - assign ID and add to list
            self.id = self._get_next_id()
            actions.append(self.to_dict())
        else:
            # Update existing action
            for i, action in enumerate(actions):
                if action.get('id') == self.id:
                    actions[i] = self.to_dict()
                    break
            else:
                # ID not found, treat as new action
                actions.append(self.to_dict())
        
        self._save_actions_to_file(actions)
        return self
    
    @classmethod
    def get_all(cls):
        """
        Retrieve all sustainability actions from the JSON file.
        
        Returns:
            list: List of SustainabilityAction instances
        """
        actions_data = cls._load_actions_from_file()
        return [cls.from_dict(data) for data in actions_data]
    
    @classmethod
    def get_by_id(cls, action_id):
        """
        Retrieve a specific action by its ID.
        
        Args:
            action_id (int): ID of the action to retrieve
            
        Returns:
            SustainabilityAction or None: The action if found, None otherwise
        """
        actions_data = cls._load_actions_from_file()
        
        for data in actions_data:
            if data.get('id') == action_id:
                return cls.from_dict(data)
        
        return None
    
    def delete(self):
        """
        Delete the current action from the JSON file.
        
        Returns:
            bool: True if action was deleted, False if not found
        """
        if self.id is None:
            return False
        
        actions = self._load_actions_from_file()
        original_length = len(actions)
        
        # Remove action with matching ID
        actions = [action for action in actions if action.get('id') != self.id]
        
        if len(actions) < original_length:
            self._save_actions_to_file(actions)
            return True
        
        return False
    
    @classmethod
    def delete_by_id(cls, action_id):
        """
        Delete an action by its ID.
        
        Args:
            action_id (int): ID of the action to delete
            
        Returns:
            bool: True if action was deleted, False if not found
        """
        actions = cls._load_actions_from_file()
        original_length = len(actions)
        
        # Remove action with matching ID
        actions = [action for action in actions if action.get('id') != action_id]
        
        if len(actions) < original_length:
            cls._save_actions_to_file(actions)
            return True
        
        return False
