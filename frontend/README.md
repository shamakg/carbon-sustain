# Sustainability Tracker Frontend

A modern React application built with Next.js featuring glassmorphism design, smooth animations, and comprehensive sustainability action management.

## 🎨 Design Philosophy

### Glassmorphism Aesthetic
The frontend showcases a cutting-edge glassmorphism design with:
- **Semi-transparent elements** with backdrop blur effects
- **Layered visual hierarchy** creating depth and dimension
- **Subtle shadows and highlights** for realistic glass appearance
- **Smooth transitions** and micro-interactions for enhanced UX

### Animation Strategy
- **Entrance animations** with staggered timing for visual flow
- **Hover effects** that provide immediate feedback
- **Loading states** with themed, contextual spinners
- **Success celebrations** that delight users upon completion
- **Interactive background** elements that respond to user movement

## 🏗️ Architecture

### Technology Stack
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Utility-first styling with custom design tokens
- **Lucide React** - Beautiful, consistent icon library
- **shadcn/ui** - High-quality component library foundation

### Project Structure
\`\`\`
frontend/
├── app/                       # Next.js App Router
│   ├── globals.css           # Global styles and design tokens
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main application page
├── components/               # React components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── actions-list.tsx      # Action management list
│   ├── action-form.tsx       # Action creation/editing form
│   ├── stats-cards.tsx       # Statistics display cards
│   ├── animated-counter.tsx  # Number animation component
│   ├── loading-spinner.tsx   # Custom loading indicators
│   ├── success-animation.tsx # Success feedback animations
│   └── interactive-background.tsx # Dynamic background
├── lib/                      # Utility functions
│   └── api.ts               # API client and type definitions
├── hooks/                    # Custom React hooks
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
└── README.md                # This documentation
\`\`\`

## 🚀 Setup and Installation

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Modern web browser with ES2020+ support

### Installation Steps

1. **Clone and navigate to project**
   \`\`\`bash
   git clone <repository-url>
   cd sustainability-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using pnpm
   pnpm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 Features

### Core Functionality
- **Action Management**: Create, read, update, and delete sustainability actions
- **Real-time Statistics**: Animated counters showing progress and achievements
- **Form Validation**: Comprehensive client-side validation with user feedback
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Contextual loading indicators for all async operations
- **Error Handling**: Graceful error management with user-friendly messages

### User Experience Enhancements
- **Glassmorphism Cards**: Beautiful semi-transparent containers with blur effects
- **Smooth Animations**: Entrance, hover, and transition animations throughout
- **Interactive Elements**: Hover effects, focus states, and click feedback
- **Success Celebrations**: Delightful animations for completed actions
- **Floating Background**: Dynamic elements that respond to mouse movement
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Optimizations
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimal loading
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size
- **Component Lazy Loading**: Dynamic imports for non-critical components
- **API Caching**: Efficient data fetching and caching strategies

## 🎨 Design System

### Color Palette
\`\`\`css
/* Primary Colors */
--primary: oklch(0.45 0.15 162);     /* Emerald 600 - #059669 */
--secondary: oklch(0.55 0.15 162);   /* Emerald 500 - #10b981 */

/* Neutral Colors */
--background: oklch(1 0 0);          /* Pure white */
--foreground: oklch(0.35 0.02 258);  /* Dark gray - #475569 */
--muted: oklch(0.96 0.005 258);      /* Light gray - #f1f5f9 */

/* Glassmorphism Colors */
--card: oklch(1 0 0 / 0.6);          /* Semi-transparent white */
--glass-border: oklch(0 0 0 / 0.1);  /* Subtle border */
\`\`\`

### Typography Scale
\`\`\`css
/* Font Families */
--font-sans: 'Geist Sans', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', monospace;

/* Font Sizes */
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
\`\`\`

### Spacing System
\`\`\`css
/* Consistent spacing scale */
gap-1: 0.25rem   /* 4px */
gap-2: 0.5rem    /* 8px */
gap-4: 1rem      /* 16px */
gap-6: 1.5rem    /* 24px */
gap-8: 2rem      /* 32px */
gap-12: 3rem     /* 48px */
\`\`\`

### Animation Timing
\`\`\`css
/* Consistent animation durations */
duration-200: 200ms   /* Quick interactions */
duration-300: 300ms   /* Standard transitions */
duration-500: 500ms   /* Entrance animations */
duration-700: 700ms   /* Complex animations */

/* Easing functions */
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
\`\`\`

## 🧩 Component Library

### Core Components

#### ActionsList
Displays sustainability actions with glassmorphism styling:
\`\`\`tsx
<ActionsList
  actions={actions}
  isLoading={false}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
\`\`\`

#### ActionForm
Modal form for creating/editing actions:
\`\`\`tsx
<ActionForm
  action={editingAction}
  onSave={handleSave}
  onCancel={handleCancel}
/>
\`\`\`

#### StatsCards
Animated statistics display:
\`\`\`tsx
<StatsCards
  actions={actions}
  isLoading={isLoading}
/>
\`\`\`

### Animation Components

#### AnimatedCounter
Smooth number transitions:
\`\`\`tsx
<AnimatedCounter
  value={totalPoints}
  duration={1000}
  prefix="+"
  suffix=" pts"
/>
\`\`\`

#### LoadingSpinner
Themed loading indicators:
\`\`\`tsx
<LoadingSpinner
  size="lg"
  variant="leaf"
/>
\`\`\`

#### SuccessAnimation
Celebration animations:
\`\`\`tsx
<SuccessAnimation
  show={showSuccess}
  variant="sparkles"
  message="Action saved!"
  onComplete={handleComplete}
/>
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Development Settings
NODE_ENV=development
\`\`\`

### Tailwind Configuration
The project uses Tailwind CSS v4 with inline theme configuration in `globals.css`:

\`\`\`css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
  /* ... additional design tokens */
}
\`\`\`

### TypeScript Configuration
Strict TypeScript configuration for type safety:
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
\`\`\`

## 🧪 Testing

### Running Tests
\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

### Testing Strategy
- **Component Testing**: React Testing Library for component behavior
- **Integration Testing**: API integration and user workflows
- **Visual Testing**: Storybook for component documentation and testing
- **Accessibility Testing**: Automated a11y testing with jest-axe

### Example Test
\`\`\`tsx
import { render, screen } from '@testing-library/react'
import { ActionsList } from '@/components/actions-list'

test('displays actions list correctly', () => {
  const mockActions = [
    { id: 1, action: 'Recycling', date: '2025-01-08', points: 25 }
  ]
  
  render(
    <ActionsList
      actions={mockActions}
      isLoading={false}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
    />
  )
  
  expect(screen.getByText('Recycling')).toBeInTheDocument()
})
\`\`\`

## 📱 Responsive Design

### Breakpoint Strategy
\`\`\`css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
\`\`\`

### Layout Patterns
- **Mobile**: Single column layout with stacked cards
- **Tablet**: Two-column grid with responsive spacing
- **Desktop**: Three-column layout with sidebar
- **Large Desktop**: Enhanced spacing and larger components

## 🚀 Performance

### Optimization Techniques
- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Regular bundle size monitoring
- **CSS Optimization**: Tailwind CSS purging and minification
- **Font Optimization**: Self-hosted fonts with font-display: swap

### Performance Metrics
Target performance scores:
- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🌐 Deployment

### Build Process
\`\`\`bash
# Create production build
npm run build

# Start production server
npm run start

# Export static site (if needed)
npm run export
\`\`\`

### Deployment Platforms

#### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
\`\`\`

#### Netlify
\`\`\`bash
# Build command
npm run build

# Publish directory
out/
\`\`\`

#### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🔒 Security

### Security Measures
- **Content Security Policy**: Configured for XSS protection
- **HTTPS Enforcement**: Redirect HTTP to HTTPS in production
- **Environment Variables**: Sensitive data in environment variables
- **Input Sanitization**: Client-side validation and sanitization
- **Dependency Scanning**: Regular security audits with npm audit

### Best Practices
- Regular dependency updates
- Secure API communication
- Proper error handling without information leakage
- CORS configuration for API access
- Secure cookie settings

## 🤝 Contributing

### Development Workflow
1. **Fork and Clone**: Create your own fork of the repository
2. **Feature Branch**: Create a branch for your feature
3. **Development**: Make changes with proper testing
4. **Code Review**: Submit PR with detailed description
5. **Testing**: Ensure all tests pass and add new tests
6. **Documentation**: Update documentation as needed

### Code Standards
- **ESLint**: Consistent code formatting and best practices
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking for reliability
- **Component Structure**: Consistent component organization
- **Naming Conventions**: Clear, descriptive naming

### Git Workflow
\`\`\`bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make commits with conventional commit messages
git commit -m "feat: add amazing new feature"

# Push and create PR
git push origin feature/amazing-feature
\`\`\`

## 📞 Support

### Common Issues

#### Build Errors
- Ensure Node.js version compatibility (18+)
- Clear node_modules and reinstall dependencies
- Check for TypeScript errors in components

#### Styling Issues
- Verify Tailwind CSS configuration
- Check for conflicting CSS classes
- Ensure design tokens are properly configured

#### API Connection
- Verify NEXT_PUBLIC_API_URL environment variable
- Check CORS configuration on backend
- Ensure backend server is running

### Getting Help
1. Check existing GitHub issues
2. Review component documentation
3. Test with minimal reproduction case
4. Contact development team with detailed information

---

**React Frontend built with modern best practices and delightful user experience**
