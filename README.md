# Pixisphere - Photographer Booking Platform

A modern, responsive web application built with Next.js and React for connecting customers with photographers for various occasions like maternity, newborn, birthday, and wedding shoots.

## Features

### Core Features
- **Category Listing Page**: Browse photographers with advanced filtering and sorting
- **Photographer Profile Page**: Detailed photographer information with portfolio and reviews
- **Advanced Filters**: Price range, ratings, styles, location, and search functionality
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Inquiry System**: Contact photographers through a modal form
- **Image Gallery**: Portfolio viewing with full-screen image modal

### Technical Features
- **Debounced Search**: Optimized search with 300ms debounce
- **State Management**: Redux Toolkit for efficient state handling
- **Clean Architecture**: Modular component structure
- **Performance Optimized**: Skeleton loading states and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation support

## Tech Stack

- **Framework**: Next.js 13+
- **UI Library**: React 18+
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React
- **API**: JSON Server (Mock API)

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Git

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd pixisphere-frontend

# Install dependencies
npm install

# Install specific versions as required
npm install tailwindcss@^3.3.0 autoprefixer@^10.4.14 postcss
npm install @reduxjs/toolkit react-redux
npm install lucide-react
npm install json-server -g
```

### Step 2: Setup Mock API
```bash
# Create db.json file in root directory (provided in the code)
# Start JSON Server
json-server --watch db.json --port 3001
```

### Step 3: Start Development Server
```bash
npm run dev
```

The application will be available at --https://pixisphere-mauve.vercel.app/
Github Resopsitory--https://github.com/Abhiwarkar/pixisphere



## Key Features Implementation

### 1. Debounced Search
- Custom `useDebounce` hook with 300ms delay
- Optimizes API calls and improves performance
- Real-time search across name, location, and tags

### 2. Advanced Filtering System
- **Price Range**: Dual slider for min/max price selection
- **Rating Filter**: Radio buttons for minimum rating selection
- **Style Filter**: Multi-select checkboxes for photography styles
- **Location Filter**: Dropdown for city selection
- **Sort Options**: Multiple sorting criteria (price, rating, name, date)

### 3. State Management
- **Redux Toolkit** for predictable state updates
- **Photographer Slice**: Handles data, filters, and pagination
- **UI Slice**: Manages modals, notifications, and device state
- **Optimistic Updates**: Immediate UI feedback

### 4. Responsive Design
- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interactions and navigation
- **Progressive enhancement** for better accessibility

### 5. Performance Optimizations
- **Skeleton Loading**: Smooth loading states
- **Pagination**: Efficient data loading with "Load More"
- **Image Optimization**: Lazy loading and error fallbacks
- **Memoization**: Selective re-renders with Redux selectors

## API Integration

### Mock API Endpoints
```javascript
// Get all photographers
GET http://localhost:3001/photographers

// Get photographer by ID
GET http://localhost:3001/photographers/:id

// Search photographers
GET http://localhost:3001/photographers?q=searchTerm
```

### Filter Logic
The application implements client-side filtering for better performance:
- **Real-time filtering** without API calls
- **Combined filters** with AND logic
- **Smart sorting** with multiple criteria
- **Search fuzzy matching** across multiple fields

## Code Quality Features

### 1. Clean Architecture
- **Separation of concerns** with dedicated folders
- **Reusable components** with consistent APIs
- **Custom hooks** for business logic
- **Utility functions** for common operations

### 2. Error Handling
- **Try-catch blocks** for async operations
- **Fallback UI** for error states
- **User-friendly messages** with actionable feedback
- **Graceful degradation** for missing data

### 3. Accessibility
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** in modals
- **Color contrast** compliance

### 4. Type Safety
- **PropTypes** for component interfaces
- **Default props** for optional parameters
- **Consistent naming** conventions
- **Clear function signatures**

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

1. Follow the existing code structure
2. Use Tailwind CSS for styling
3. Implement responsive design
4. Add proper error handling
5. Include loading states
6. Write clean, documented code

