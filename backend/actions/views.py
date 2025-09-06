"""
Django REST Framework views for sustainability actions API.

This module contains API views that handle HTTP requests for CRUD operations
on sustainability actions. Implements RESTful endpoints with proper error
handling and HTTP status codes.
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from django.core.exceptions import ValidationError
import logging

from .models import SustainabilityAction
from .serializers import SustainabilityActionSerializer

# Configure logging for API operations
logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
def action_list(request):
    """
    Handle GET and POST requests for the actions list endpoint.
    
    GET /api/actions/
    - Retrieve all sustainability actions
    - Returns paginated list of actions in JSON format
    
    POST /api/actions/
    - Create a new sustainability action
    - Expects JSON payload with action, date, and points fields
    - Returns created action with assigned ID
    
    Args:
        request (HttpRequest): The HTTP request object
        
    Returns:
        Response: JSON response with action data or error messages
    """
    
    if request.method == 'GET':
        """
        Retrieve all sustainability actions.
        Returns a list of all actions stored in the JSON file.
        """
        try:
            # Fetch all actions from JSON storage
            actions = SustainabilityAction.get_all()
            
            # Serialize the actions for JSON response
            serializer = SustainabilityActionSerializer(actions, many=True)
            
            # Log successful retrieval
            logger.info(f"Retrieved {len(actions)} sustainability actions")
            
            # Return successful response with actions data
            return Response({
                'success': True,
                'count': len(actions),
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Log error and return error response
            logger.error(f"Error retrieving actions: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve actions',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        """
        Create a new sustainability action.
        Validates input data and saves new action to JSON file.
        """
        try:
            # Create serializer with request data
            serializer = SustainabilityActionSerializer(data=request.data)
            
            # Validate the input data
            if serializer.is_valid():
                # Save the new action
                action = serializer.save()
                
                # Log successful creation
                logger.info(f"Created new action with ID {action.id}: {action.action}")
                
                # Return successful response with created action
                return Response({
                    'success': True,
                    'message': 'Action created successfully',
                    'data': SustainabilityActionSerializer(action).data
                }, status=status.HTTP_201_CREATED)
            
            else:
                # Return validation errors
                logger.warning(f"Action creation failed - validation errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'error': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except ValidationError as e:
            # Handle model validation errors
            logger.error(f"Validation error creating action: {str(e)}")
            return Response({
                'success': False,
                'error': 'Validation error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Handle unexpected errors
            logger.error(f"Unexpected error creating action: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to create action',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def action_detail(request, pk):
    """
    Handle GET, PUT, PATCH, and DELETE requests for individual actions.
    
    GET /api/actions/<id>/
    - Retrieve a specific action by ID
    
    PUT /api/actions/<id>/
    - Update all fields of a specific action
    
    PATCH /api/actions/<id>/
    - Partially update a specific action
    
    DELETE /api/actions/<id>/
    - Delete a specific action
    
    Args:
        request (HttpRequest): The HTTP request object
        pk (int): Primary key (ID) of the action
        
    Returns:
        Response: JSON response with action data or error messages
    """
    
    # Helper function to get action by ID with error handling
    def get_action_or_404(action_id):
        """
        Retrieve an action by ID or raise 404 error.
        
        Args:
            action_id (int): ID of the action to retrieve
            
        Returns:
            SustainabilityAction: The requested action
            
        Raises:
            Http404: If action is not found
        """
        try:
            action_id = int(action_id)
            action = SustainabilityAction.get_by_id(action_id)
            if action is None:
                logger.warning(f"Action with ID {action_id} not found")
                raise Http404(f"Action with ID {action_id} does not exist")
            return action
        except ValueError:
            logger.error(f"Invalid action ID format: {action_id}")
            raise Http404("Invalid action ID format")
    
    if request.method == 'GET':
        """
        Retrieve a specific sustainability action by ID.
        """
        try:
            action = get_action_or_404(pk)
            serializer = SustainabilityActionSerializer(action)
            
            logger.info(f"Retrieved action with ID {pk}")
            
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Http404 as e:
            return Response({
                'success': False,
                'error': 'Action not found',
                'message': str(e)
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            logger.error(f"Error retrieving action {pk}: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve action',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method in ['PUT', 'PATCH']:
        """
        Update a sustainability action (full update for PUT, partial for PATCH).
        """
        try:
            action = get_action_or_404(pk)
            
            # For PATCH requests, allow partial updates
            partial = request.method == 'PATCH'
            
            # Create serializer with existing instance and new data
            serializer = SustainabilityActionSerializer(
                action, 
                data=request.data, 
                partial=partial
            )
            
            if serializer.is_valid():
                # Update the action
                updated_action = serializer.save()
                
                logger.info(f"Updated action with ID {pk}")
                
                return Response({
                    'success': True,
                    'message': 'Action updated successfully',
                    'data': SustainabilityActionSerializer(updated_action).data
                }, status=status.HTTP_200_OK)
            
            else:
                logger.warning(f"Action update failed - validation errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'error': 'Validation failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Http404 as e:
            return Response({
                'success': False,
                'error': 'Action not found',
                'message': str(e)
            }, status=status.HTTP_404_NOT_FOUND)
            
        except ValidationError as e:
            logger.error(f"Validation error updating action {pk}: {str(e)}")
            return Response({
                'success': False,
                'error': 'Validation error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error updating action {pk}: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to update action',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        """
        Delete a sustainability action by ID.
        """
        try:
            action = get_action_or_404(pk)
            
            # Delete the action
            deleted = action.delete()
            
            if deleted:
                logger.info(f"Deleted action with ID {pk}")
                
                return Response({
                    'success': True,
                    'message': f'Action with ID {pk} deleted successfully'
                }, status=status.HTTP_204_NO_CONTENT)
            
            else:
                logger.error(f"Failed to delete action with ID {pk}")
                return Response({
                    'success': False,
                    'error': 'Failed to delete action',
                    'message': 'Action could not be deleted'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Http404 as e:
            return Response({
                'success': False,
                'error': 'Action not found',
                'message': str(e)
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            logger.error(f"Error deleting action {pk}: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to delete action',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def api_health_check(request):
    """
    Health check endpoint for API monitoring.
    
    GET /api/health/
    - Returns API status and basic statistics
    
    Args:
        request (HttpRequest): The HTTP request object
        
    Returns:
        Response: JSON response with API health information
    """
    try:
        # Get basic statistics
        actions = SustainabilityAction.get_all()
        total_actions = len(actions)
        total_points = sum(action.points for action in actions)
        
        return Response({
            'success': True,
            'status': 'healthy',
            'message': 'Sustainability Tracker API is running',
            'statistics': {
                'total_actions': total_actions,
                'total_points': total_points
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return Response({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
