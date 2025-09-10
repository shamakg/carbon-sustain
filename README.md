# Sustainability Tracker

A modern full-stack application for tracking and managing sustainability actions with a beautiful glassmorphism design and smooth animations.

## 🌱 Overview

The Sustainability Tracker helps users monitor their environmental impact by logging sustainable actions and earning points. The application features a Django REST API backend with JSON file storage and a React frontend with Next.js, showcasing a professional glassmorphism design with engaging animations.

## ✨ Features

### Backend (Django REST API)

- **RESTful API** with comprehensive CRUD operations
- **JSON file storage** for sustainability actions data
- **Professional validation** and error handling
- **CORS support** for frontend integration
- **Health check endpoints** for monitoring
- **Comprehensive logging** and debugging support

### Frontend (React + Next.js)

- **Glassmorphism design** with semi-transparent elements
- **Smooth animations** and micro-interactions
- **Responsive design** for all device sizes
- **Real-time statistics** with animated counters
- **Interactive forms** with validation feedback
- **Success animations** for user engagement
- **Loading states** with themed spinners

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- npm or yarn (for frontend dependencies)

### Backend Setup

\`\`\`bash

# Navigate to backend directory

cd backend

# Create virtual environment

python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

# Install dependencies

pip install -r requirements.txt

# Run migrations (creates SQLite database)

python manage.py migrate

# Start development server

python manage.py runserver
\`\`\`

The API will be available at `http://localhost:8000`

### Frontend Setup

\`\`\`bash

# Navigate to project root (where package.json is located)

cd carbon-sustain

# Install dependencies

npm install

# Start development server

npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

\`\`\`
carbon-sustain/
├── backend/ # Django REST API
│ ├── sustainability_tracker/ # Main Django project
│ ├── actions/ # Actions app with models, views, serializers
│ ├── data/ # JSON data storage
│ ├── requirements.txt # Python dependencies
│ └── manage.py # Django management script
├── app/ # Next.js app directory
├── components/ # React components
├── lib/ # Utility functions and API client
├── public/ # Static assets
├── package.json # Node.js dependencies
└── README.md # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

\`\`\`bash
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
\`\`\`

#### Frontend (.env.local)

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

## 📖 API Documentation

### Base URL

\`\`\`
http://localhost:8000/api
\`\`\`

### Endpoints

#### Health Check

- **GET** `/health/` - Check API status and statistics

#### Actions

- **GET** `/actions/` - Retrieve all sustainability actions
- **POST** `/actions/` - Create a new sustainability action
- **GET** `/actions/{id}/` - Retrieve a specific action
- **PUT** `/actions/{id}/` - Update a specific action (full update)
- **PATCH** `/actions/{id}/` - Update a specific action (partial update)
- **DELETE** `/actions/{id}/` - Delete a specific action

### Request/Response Examples

#### Create Action

\`\`\`bash
POST /api/actions/
Content-Type: application/json

{
"action": "Recycling plastic bottles",
"date": "2025-01-08",
"points": 25
}
\`\`\`

#### Response

\`\`\`json
{
"success": true,
"message": "Action created successfully",
"data": {
"id": 1,
"action": "Recycling plastic bottles",
"date": "2025-01-08",
"points": 25
}
}
\`\`\`

## 🎨 Design System

### Glassmorphism Theme

The application uses a carefully crafted glassmorphism design with:

- **Semi-transparent backgrounds** with backdrop blur effects
- **Subtle shadows** and border highlights
- **Smooth transitions** and hover effects
- **Consistent color palette** with emerald green primary colors

### Color Palette

- **Primary**: `#059669` (Emerald 600)
- **Secondary**: `#10b981` (Emerald 500)
- **Background**: Semi-transparent whites and grays
- **Accent**: Vibrant greens for call-to-action elements

### Animations

- **Entrance animations** with staggered delays
- **Hover effects** with scale and glow transitions
- **Loading states** with themed spinners
- **Success celebrations** with bouncing and pulsing effects

## 🧪 Testing

### Backend Tests

\`\`\`bash
cd backend
python manage.py test
\`\`\`

### Frontend Tests

\`\`\`bash
npm run test
\`\`\`

## 🚀 Deployment

### Backend Deployment

1. Set `DEBUG=False` in production
2. Configure proper `SECRET_KEY` and `ALLOWED_HOSTS`
3. Use a production WSGI server like Gunicorn
4. Set up proper logging and monitoring

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django REST Framework** for the robust API foundation
- **Next.js** for the excellent React framework
- **Tailwind CSS** for the utility-first styling approach
- **Lucide React** for the beautiful icon set
- **shadcn/ui** for the component library foundation
- **ChatGPT,V0** for coding assistance

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/sustainability-tracker/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ for a sustainable future**
