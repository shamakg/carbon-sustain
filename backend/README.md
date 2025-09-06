# Sustainability Tracker Backend

A Django REST API for managing sustainability actions with JSON file storage, comprehensive validation, and professional error handling.

## 🏗️ Architecture

### Technology Stack
- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **django-cors-headers** - CORS support for frontend integration
- **JSON File Storage** - Lightweight data persistence
- **SQLite** - Default database for Django admin and sessions

### Project Structure
\`\`\`
backend/
├── sustainability_tracker/     # Main Django project
│   ├── __init__.py
│   ├── settings.py            # Django configuration
│   ├── urls.py               # Main URL routing
│   ├── wsgi.py               # WSGI configuration
│   └── asgi.py               # ASGI configuration
├── actions/                   # Actions Django app
│   ├── __init__.py
│   ├── models.py             # SustainabilityAction model
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # API views
│   ├── urls.py               # App URL routing
│   ├── admin.py              # Django admin config
│   ├── apps.py               # App configuration
│   └── tests.py              # Unit tests
├── data/                      # JSON data storage
│   └── actions.json          # Actions data file
├── requirements.txt           # Python dependencies
└── manage.py                 # Django management script
\`\`\`

## 🚀 Setup and Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd sustainability-tracker/backend
   \`\`\`

2. **Create and activate virtual environment**
   \`\`\`bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Configure environment variables** (optional)
   \`\`\`bash
   # Create .env file
   echo "DEBUG=True" > .env
   echo "SECRET_KEY=your-secret-key-here" >> .env
   \`\`\`

5. **Run database migrations**
   \`\`\`bash
   python manage.py migrate
   \`\`\`

6. **Create superuser** (optional, for Django admin)
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

7. **Start development server**
   \`\`\`bash
   python manage.py runserver
   \`\`\`

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:8000/api
\`\`\`

### Authentication
Currently, the API does not require authentication. In production, consider implementing:
- Token-based authentication
- JWT authentication
- Session-based authentication

### Endpoints

#### Health Check
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
    "total_actions": 15,
    "total_points": 450
  }
}
\`\`\`

#### List All Actions
\`\`\`http
GET /api/actions/
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "count": 2,
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
    }
  ]
}
\`\`\`

#### Create New Action
\`\`\`http
POST /api/actions/
Content-Type: application/json

{
  "action": "Composting organic waste",
  "date": "2025-01-08",
  "points": 20
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Action created successfully",
  "data": {
    "id": 3,
    "action": "Composting organic waste",
    "date": "2025-01-08",
    "points": 20
  }
}
\`\`\`

#### Get Specific Action
\`\`\`http
GET /api/actions/{id}/
\`\`\`

#### Update Action (Full Update)
\`\`\`http
PUT /api/actions/{id}/
Content-Type: application/json

{
  "action": "Updated action description",
  "date": "2025-01-08",
  "points": 35
}
\`\`\`

#### Update Action (Partial Update)
\`\`\`http
PATCH /api/actions/{id}/
Content-Type: application/json

{
  "points": 40
}
\`\`\`

#### Delete Action
\`\`\`http
DELETE /api/actions/{id}/
\`\`\`

### Error Responses

#### Validation Error (400)
\`\`\`json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "action": ["Action description is required"],
    "points": ["Points must be a positive number"]
  }
}
\`\`\`

#### Not Found (404)
\`\`\`json
{
  "success": false,
  "error": "Action not found",
  "message": "Action with ID 999 does not exist"
}
\`\`\`

#### Server Error (500)
\`\`\`json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
\`\`\`

## 🗄️ Data Model

### SustainabilityAction
The core model for storing sustainability actions:

\`\`\`python
{
  "id": int,           # Auto-generated unique identifier
  "action": str,       # Description (max 255 characters)
  "date": str,         # Date in YYYY-MM-DD format
  "points": int        # Points earned (0-1000)
}
\`\`\`

#### Validation Rules
- **action**: Required, 3-255 characters, non-empty after trimming
- **date**: Required, valid date in YYYY-MM-DD format, not in future
- **points**: Required, integer between 0 and 1000

### JSON File Storage
Actions are stored in `data/actions.json` with the following structure:

\`\`\`json
[
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
  }
]
\`\`\`

## 🧪 Testing

### Running Tests
\`\`\`bash
# Run all tests
python manage.py test

# Run tests with verbose output
python manage.py test --verbosity=2

# Run specific test module
python manage.py test actions.tests
\`\`\`

### Test Coverage
The test suite covers:
- Model validation and CRUD operations
- API endpoint functionality
- Error handling scenarios
- JSON file operations
- Serializer validation

### Example Test
\`\`\`python
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
\`\`\`

## 🔧 Configuration

### Settings Overview
Key configuration options in `settings.py`:

\`\`\`python
# CORS settings for frontend integration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
]

# JSON file path for data storage
JSON_DATA_FILE = BASE_DIR / 'data' / 'actions.json'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
\`\`\`

### Environment Variables
- `DEBUG`: Enable/disable debug mode (default: True)
- `SECRET_KEY`: Django secret key for cryptographic signing
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

## 📊 Logging and Monitoring

### Logging Configuration
The application uses Python's built-in logging:

\`\`\`python
import logging
logger = logging.getLogger(__name__)

# Example usage in views
logger.info(f"Created new action with ID {action.id}")
logger.error(f"Error creating action: {str(e)}")
\`\`\`

### Health Monitoring
Use the health check endpoint for monitoring:
- API availability
- Basic statistics
- System status

## 🚀 Production Deployment

### Preparation Checklist
- [ ] Set `DEBUG = False`
- [ ] Configure proper `SECRET_KEY`
- [ ] Set `ALLOWED_HOSTS` for your domain
- [ ] Use environment variables for sensitive settings
- [ ] Set up proper logging configuration
- [ ] Configure static files serving
- [ ] Set up database backups (for JSON files)

### WSGI Deployment
\`\`\`bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn sustainability_tracker.wsgi:application
\`\`\`

### Docker Deployment
\`\`\`dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "sustainability_tracker.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## 🔒 Security Considerations

### Current Security Features
- CORS configuration for frontend integration
- Input validation and sanitization
- SQL injection prevention (using Django ORM)
- XSS protection through DRF serializers

### Production Security Recommendations
- Implement authentication and authorization
- Use HTTPS in production
- Set up rate limiting
- Configure proper CORS origins
- Regular security updates
- Input validation and sanitization
- Secure file storage permissions

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Write tests for new functionality
3. Implement features with proper documentation
4. Run test suite and ensure all tests pass
5. Submit pull request with detailed description

### Code Style
- Follow PEP 8 Python style guide
- Use meaningful variable and function names
- Add docstrings for all functions and classes
- Include type hints where appropriate
- Write comprehensive comments for complex logic

## 📞 Support

For backend-specific issues:
1. Check Django and DRF documentation
2. Review error logs in console output
3. Verify JSON file permissions and structure
4. Test API endpoints with tools like Postman or curl

---

**Django REST API built with professional standards and best practices**
