"""
Unit tests for sustainability actions API.

This module contains comprehensive tests for the sustainability actions
API endpoints, including CRUD operations and error handling.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import json
import tempfile
import os
from unittest.mock import patch

from .models import SustainabilityAction
from .serializers import SustainabilityActionSerializer


class SustainabilityActionModelTests(TestCase):
    """
    Test cases for the SustainabilityAction model.
    Tests basic CRUD operations and validation logic.
    """
    
    def setUp(self):
        """Set up test data and temporary file for testing."""
        # Create a temporary file for testing JSON operations
        self.temp_file = tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.json')
        self.temp_file.write('[]')
        self.temp_file.close()
        
        # Mock the JSON file path
        self.patcher = patch.object(SustainabilityAction, '_get_json_file_path')
        self.mock_path = self.patcher.start()
        self.mock_path.return_value = self.temp_file.name
    
    def tearDown(self):
        """Clean up test data."""
        self.patcher.stop()
        os.unlink(self.temp_file.name)
    
    def test_create_action(self):
        """Test creating a new sustainability action."""
        action = SustainabilityAction(
            action="Recycling plastic bottles",
            date="2025-01-08",
            points=25
        )
        saved_action = action.save()
        
        self.assertIsNotNone(saved_action.id)
        self.assertEqual(saved_action.action, "Recycling plastic bottles")
        self.assertEqual(saved_action.date, "2025-01-08")
        self.assertEqual(saved_action.points, 25)
    
    def test_get_all_actions(self):
        """Test retrieving all actions."""
        # Create test actions
        action1 = SustainabilityAction(action="Action 1", date="2025-01-08", points=10)
        action2 = SustainabilityAction(action="Action 2", date="2025-01-09", points=20)
        
        action1.save()
        action2.save()
        
        # Retrieve all actions
        all_actions = SustainabilityAction.get_all()
        
        self.assertEqual(len(all_actions), 2)
        self.assertEqual(all_actions[0].action, "Action 1")
        self.assertEqual(all_actions[1].action, "Action 2")


class SustainabilityActionAPITests(APITestCase):
    """
    Test cases for the sustainability actions API endpoints.
    Tests all CRUD operations and error handling scenarios.
    """
    
    def setUp(self):
        """Set up test data and URLs."""
        self.list_url = reverse('action-list')
        self.health_url = reverse('api-health-check')
        
        # Sample action data for testing
        self.valid_action_data = {
            'action': 'Using public transportation',
            'date': '2025-01-08',
            'points': 30
        }
        
        self.invalid_action_data = {
            'action': '',  # Invalid: empty action
            'date': 'invalid-date',  # Invalid: wrong date format
            'points': -5  # Invalid: negative points
        }
    
    def test_health_check_endpoint(self):
        """Test the API health check endpoint."""
        response = self.client.get(self.health_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'healthy')
    
    def test_create_action_success(self):
        """Test successful action creation."""
        response = self.client.post(
            self.list_url,
            self.valid_action_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('data', response.data)
        self.assertEqual(response.data['data']['action'], self.valid_action_data['action'])
    
    def test_create_action_validation_error(self):
        """Test action creation with invalid data."""
        response = self.client.post(
            self.list_url,
            self.invalid_action_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('errors', response.data)
    
    def test_get_actions_list(self):
        """Test retrieving the list of actions."""
        # First create an action
        self.client.post(self.list_url, self.valid_action_data, format='json')
        
        # Then retrieve the list
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('data', response.data)
        self.assertGreaterEqual(response.data['count'], 1)
