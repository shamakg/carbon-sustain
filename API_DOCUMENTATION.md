# Sustainability Tracker API Documentation

Complete API reference for the Sustainability Tracker Django REST API.

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Examples](#examples)
- [SDKs and Libraries](#sdks-and-libraries)

## 🌐 Overview

The Sustainability Tracker API is a RESTful web service that allows you to manage sustainability actions. The API supports creating, reading, updating, and deleting sustainability actions with comprehensive validation and error handling.

### Key Features
- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Format**: All requests and responses use JSON
- **Comprehensive Validation**: Input validation with detailed error messages
- **CORS Support**: Cross-origin requests enabled for web applications
- **Health Monitoring**: Built-in health check endpoints

## 🔐 Authentication

**Current Status**: No authentication required

The API currently operates without authentication for development purposes. In production, consider implementing:
- Token-based authentication
- JWT (JSON Web Tokens)
- API key authentication
- OAuth 2.0

## 🌍 Base URL

\`\`\`
Development: http://localhost:8000/api
Production: https://your-domain.com/api
\`\`\`

## 📊 Response Format

All API responses follow a consistent JSON structure:

### Success Response
\`\`\`json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message",
  "count": 10  // For list endpoints
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "errors": {  // Validation errors (optional)
    "field_name": ["Error message 1", "Error message 2"]
  }
}
\`\`\`

## ⚠️ Error Handling

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Validation errors or malformed requests
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side errors

### Common Error Types
- **Validation Error**: Input data doesn't meet requirements
- **Not Found**: Requested resource doesn't exist
- **Server Error**: Internal server error occurred

## 🚦 Rate Limiting

**Current Status**: No rate limiting implemented

For production deployment, consider implementing:
- Request rate limiting per IP address
- API key-based rate limiting
- Different limits for different endpoints

## 🛠️ Endpoints

### Health Check

#### Check API Health
Get API status and basic statistics.

\`\`\`http
GET /api/health/
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "status": "healthy",
  "message": "Sustainability Tracker API is running",
  "statistics": {
    "total_actions": 25,
    "total_points": 750
  }
}
\`\`\`

### Sustainability Actions

#### List All Actions
Retrieve all sustainability actions.

\`\`\`http
GET /api/actions/
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "action": "Recycling plastic bottles",
      "date": "2025-01-08",
      "points": 25
    },
    {
      "id": 2,
      "action": "Using public transportation",
      "date": "2025-01-07",
      "points": 30
    },
    {
      "id": 3,
      "action": "Composting organic waste",
      "date": "2025-01-06",
      "points": 20
    }
  ]
}
\`\`\`

#### Create New Action
Create a new sustainability action.

\`\`\`http
POST /api/actions/
Content-Type: application/json

{
  "action": "Installing solar panels",
  "date": "2025-01-08",
  "points": 100
}
\`\`\`

**Request Body Parameters:**
- `action` (string, required): Description of the sustainability action (3-255 characters)
- `date` (string, required): Date in YYYY-MM-DD format (not in future)
- `points` (integer, required): Points earned (0-1000)

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Action created successfully",
  "data": {
    "id": 4,
    "action": "Installing solar panels",
    "date": "2025-01-08",
    "points": 100
  }
}
\`\`\`

#### Get Specific Action
Retrieve a specific sustainability action by ID.

\`\`\`http
GET /api/actions/{id}/
\`\`\`

**Path Parameters:**
- `id` (integer, required): Unique identifier of the action

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "action": "Recycling plastic bottles",
    "date": "2025-01-08",
    "points": 25
  }
}
\`\`\`

#### Update Action (Full Update)
Update all fields of a specific action.

\`\`\`http
PUT /api/actions/{id}/
Content-Type: application/json

{
  "action": "Updated action description",
  "date": "2025-01-08",
  "points": 35
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Action updated successfully",
  "data": {
    "id": 1,
    "action": "Updated action description",
    "date": "2025-01-08",
    "points": 35
  }
}
\`\`\`

#### Update Action (Partial Update)
Update specific fields of an action.

\`\`\`http
PATCH /api/actions/{id}/
Content-Type: application/json

{
  "points": 40
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Action updated successfully",
  "data": {
    "id": 1,
    "action": "Recycling plastic bottles",
    "date": "2025-01-08",
    "points": 40
  }
}
\`\`\`

#### Delete Action
Delete a specific sustainability action.

\`\`\`http
DELETE /api/actions/{id}/
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Action with ID 1 deleted successfully"
}
\`\`\`

## 📝 Examples

### Using cURL

#### Create Action
\`\`\`bash
curl -X POST http://localhost:8000/api/actions/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "Bike to work instead of driving",
    "date": "2025-01-08",
    "points": 35
  }'
\`\`\`

#### Get All Actions
\`\`\`bash
curl -X GET http://localhost:8000/api/actions/
\`\`\`

#### Update Action
\`\`\`bash
curl -X PATCH http://localhost:8000/api/actions/1/ \
  -H "Content-Type: application/json" \
  -d '{"points": 50}'
\`\`\`

#### Delete Action
\`\`\`bash
curl -X DELETE http://localhost:8000/api/actions/1/
\`\`\`

### Using JavaScript (Fetch API)

#### Create Action
\`\`\`javascript
const createAction = async (actionData) => {
  const response = await fetch('http://localhost:8000/api/actions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actionData)
  });
  
  const result = await response.json();
  return result;
};

// Usage
const newAction = {
  action: "Switch to renewable energy",
  date: "2025-01-08",
  points: 75
};

createAction(newAction)
  .then(result => console.log('Action created:', result))
  .catch(error => console.error('Error:', error));
\`\`\`

#### Get All Actions
\`\`\`javascript
const getAllActions = async () => {
  const response = await fetch('http://localhost:8000/api/actions/');
  const result = await response.json();
  return result.data;
};

getAllActions()
  .then(actions => console.log('Actions:', actions))
  .catch(error => console.error('Error:', error));
\`\`\`

### Using Python (requests)

#### Create Action
\`\`\`python
import requests

url = "http://localhost:8000/api/actions/"
data = {
    "action": "Start a community garden",
    "date": "2025-01-08",
    "points": 60
}

response = requests.post(url, json=data)
result = response.json()
print(f"Action created: {result}")
\`\`\`

#### Get All Actions
\`\`\`python
import requests

url = "http://localhost:8000/api/actions/"
response = requests.get(url)
result = response.json()

if result['success']:
    actions = result['data']
    print(f"Found {len(actions)} actions:")
    for action in actions:
        print(f"- {action['action']} ({action['points']} points)")
\`\`\`

## 🔧 SDKs and Libraries

### JavaScript/TypeScript SDK
The frontend includes a comprehensive API client in `lib/api.ts`:

\`\`\`typescript
import { getAllActions, createAction, updateAction, deleteAction } from '@/lib/api';

// Get all actions
const actions = await getAllActions();

// Create new action
const newAction = await createAction({
  action: "Reduce meat consumption",
  date: "2025-01-08",
  points: 30
});

// Update action
const updatedAction = await updateAction(1, { points: 45 });

// Delete action
await deleteAction(1);
\`\`\`

### Python SDK Example
\`\`\`python
import requests
from typing import List, Dict, Optional

class SustainabilityTrackerAPI:
    def __init__(self, base_url: str = "http://localhost:8000/api"):
        self.base_url = base_url
    
    def get_actions(self) -> List[Dict]:
        response = requests.get(f"{self.base_url}/actions/")
        result = response.json()
        return result.get('data', [])
    
    def create_action(self, action: str, date: str, points: int) -> Dict:
        data = {"action": action, "date": date, "points": points}
        response = requests.post(f"{self.base_url}/actions/", json=data)
        return response.json()
    
    def update_action(self, action_id: int, **kwargs) -> Dict:
        response = requests.patch(f"{self.base_url}/actions/{action_id}/", json=kwargs)
        return response.json()
    
    def delete_action(self, action_id: int) -> bool:
        response = requests.delete(f"{self.base_url}/actions/{action_id}/")
        return response.status_code == 204

# Usage
api = SustainabilityTrackerAPI()
actions = api.get_actions()
print(f"Found {len(actions)} actions")
\`\`\`

## 📚 Additional Resources

### Validation Rules
- **Action Description**: 3-255 characters, non-empty after trimming
- **Date**: Valid date in YYYY-MM-DD format, not in future
- **Points**: Integer between 0 and 1000

### Best Practices
- Always check the `success` field in responses
- Handle validation errors gracefully
- Implement proper error handling for network issues
- Use appropriate HTTP methods for different operations
- Include proper Content-Type headers for POST/PUT/PATCH requests

### Testing
- Use the health check endpoint to verify API availability
- Test with invalid data to understand error responses
- Implement retry logic for network failures
- Use proper HTTP status code checking

---

**Complete API documentation for seamless integration**
