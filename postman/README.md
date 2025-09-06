# Postman Collection for Sustainability Actions API

This directory contains Postman collections and environments for testing the Django REST API endpoints.

## Files Included

- `Sustainability_Actions_API.postman_collection.json` - Complete API collection with all endpoints
- `Sustainability_Actions_Environment.postman_environment.json` - Environment variables for local development

## Quick Setup

1. **Import Collection:**

   - Open Postman
   - Click "Import" → "Upload Files"
   - Select `Sustainability_Actions_API.postman_collection.json`

2. **Import Environment:**

   - Click "Import" → "Upload Files"
   - Select `Sustainability_Actions_Environment.postman_environment.json`
   - Set as active environment in top-right dropdown

3. **Start Django Server:**
   \`\`\`bash
   cd backend
   python manage.py runserver
   \`\`\`

4. **Test API:**
   - Run "Health Check" request first to verify connection
   - Use "Get All Actions" to see current data
   - Try "Create New Action" to add test data

## Available Endpoints

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/health/`       | API health check        |
| GET    | `/actions/`      | List all actions        |
| POST   | `/actions/`      | Create new action       |
| GET    | `/actions/{id}/` | Get specific action     |
| PUT    | `/actions/{id}/` | Update action (full)    |
| PATCH  | `/actions/{id}/` | Update action (partial) |
| DELETE | `/actions/{id}/` | Delete action           |

## Environment Variables

- `base_url`: API base URL (default: http://localhost:8000/api)
- `frontend_url`: Frontend URL (default: http://localhost:3000)
- `test_action_id`: ID for testing single action endpoints

## Automated Tests

Each request includes automated tests for:

- Response status codes (200, 201, 204)
- Response time validation (< 2000ms)
- Content-Type validation for JSON responses

## Example Usage

1. **Create Action:**
   \`\`\`json
   {
   "action": "Used reusable water bottle",
   "date": "2024-01-15",
   "points": 5
   }
   \`\`\`

2. **Update Action (PATCH):**
   \`\`\`json
   {
   "points": 10
   }
   \`\`\`

The collection includes various example actions for testing different scenarios and point values.
