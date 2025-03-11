# Medh Project Summary

## Project Structure
The project is a Next.js application with a focus on course management and educational content delivery.

## Key Components

### Courses Page
- Located at: `src/app/courses/page.js`
- Main page for course exploration
- Supports multiple view modes (All, Live, Blended)
- Includes filtering capabilities through tabs and filter buttons
- Uses Suspense for asynchronous content loading

### CoursesFilter Component
- Located at: `src/components/sections/courses/CoursesFilter.js`
- Complex component handling course filtering functionality
- Includes search, sort, category filtering, and pagination
- Supports both grid and list views
- Provides full-width layout with optimized card sizing
- Contains error states, loading states, and empty results handling

### CourseCard Component
- Located at: `src/components/sections/courses/CourseCard.js`
- Displays individual course information
- Supports different class types (Live, Blended) with appropriate styling
- Uses preserveClassType flag to maintain course type styling during filtering
- Includes responsive design for all screen sizes
- Contains hover effects and interactive elements

## UI/UX Considerations
- Modern UI with Gen Z look & feel
- Dark mode support throughout the application
- Responsive design for all screen sizes
- Smooth transitions and animations
- Accessible color contrasts and interactive elements
- Optimized card layouts to prevent compressed content
- Full-width layouts for better screen real estate utilization

## Design System
- Uses Tailwind CSS for styling
- Primary colors: blue, rose, indigo
- Dark mode utilizes darker backgrounds with appropriate contrast
- Interactive elements have hover and active states
- Consistent spacing and typography
- Course type-specific color coding (rose for Live, indigo for Blended)
- Card-based UI with proper information hierarchy

## Code Standards
- Component-based architecture
- Client-side components with "use client" directive
- Suspense for async operations
- Proper state management with React hooks
- Code splitting and dynamic imports for performance
- Consistent prop naming and structure
- Type checking with PropTypes

## Project Overview
Medh is a modern ed-tech platform built using Next.js. The platform offers courses, blogs, brochures, and educational resources with a focus on user experience and performance. The application follows industry best practices, modern UI/UX standards, and well-documented coding principles.

## Architecture
- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS with custom design system
- **API**: RESTful API structure with modular organization
- **State Management**: React hooks for local state
- **Authentication**: JWT-based auth with secure token handling

## Key Features
- Course browsing and enrollment
- Blog content with modern UI/UX
- Brochure downloads with lead capture
- User management (students, instructors)
- Dashboard for various user roles

## Recent Improvements

### Modern UI/UX Enhancements
1. **Blog Listing Page Modernization**
   - Implemented comprehensive filtering system with category, tag, and search
   - Added grid/list view toggle for content display flexibility
   - Created visual feedback for loading, empty, and error states
   - Implemented URL-based filter state for shareable search results
   - Added server-side rendering with dynamic metadata generation

2. **Blog Details Page Redesign**
   - Created Gen Alpha-friendly interface with modern aesthetics
   - Implemented interactive features like reading progress, bookmarks, and likes
   - Added social sharing capabilities for major platforms
   - Created auto-generated table of contents with active section tracking
   - Enhanced typography and layout for improved readability
   - Added responsive sidebar with related content

### Next.js App Router Integration
1. **Blog Details Page**
   - Converted from static data to dynamic API integration
   - Implemented server-side data fetching with proper error handling
   - Added dynamic metadata generation for SEO optimization
   - Enhanced route generation with API-driven static paths
   - Improved user experience with real-time content

2. **Blog Listing Page**
   - Implemented server-side rendering with initial data fetching
   - Added dynamic route handling with searchParams support
   - Created adaptive metadata based on filter parameters
   - Added smart data revalidation with caching
   - Implemented optimized client-side hydration

### API and Component Integration
1. **Blog API Integration**
   - Enhanced Blogs component to properly use backend API endpoints
   - Implemented data transformation to match component requirements
   - Added support for fetching featured blogs and filtering by tags
   - Improved error handling and fallback mechanisms
   - Created automatic read time estimation for blog posts

### UI/UX Enhancements
1. **Blogs Component**
   - Added modern filtering capabilities (All, Latest, Popular, Quick Reads)
   - Implemented skeleton loading state for better perceived performance
   - Enhanced mobile responsiveness with screen size detection
   - Added custom dot navigation for slider
   - Improved animations and transitions

2. **BlogCard Component**
   - Completely redesigned with hover effects
   - Added skeleton loader for images
   - Enhanced metadata display with better visual hierarchy
   - Implemented proper excerpt and tag display
   - Mobile-optimized with touch-friendly buttons

### API Improvements
1. **API Utilities (api.js)**
   - Implemented sophisticated caching system with TTL
   - Added automatic retry mechanism for failed requests
   - Enhanced error handling with detailed error objects
   - Added request/response interceptors
   - Created helper methods for common API operations

2. **API Endpoints (index.js)**
   - Enhanced Blogs API with better parameter handling
   - Added comprehensive documentation with JSDoc
   - Implemented flexible filtering options
   - Created specialized endpoints for featured/related blogs
   - Added analytics and interaction tracking

## Development Guidelines
- **Code Organization**: Component-based architecture with clear separation of concerns
- **API Structure**: Consistent parameter handling and URL construction 
- **Performance**: Caching strategies, skeleton loading, and optimized image loading
- **Mobile Experience**: Responsive design with touch-optimized interactions
- **Documentation**: Comprehensive JSDoc comments and descriptive variable names

## Key Files and Routes
- **Components**: 
  - `src/components/sections/blogs/Blogs.js` - Main blogs display with API integration
  - `src/components/sections/blogs/BlogCard.js` - Individual blog cards with responsive design
  - `src/components/sections/blogs/BlogsPrimary.js` - Blog listing component with filtering
  - `src/components/sections/blog-details/BlogDetails.js` - Modern blog content display with interactive features
  - `src/components/layout/main/BlogDetailsMain.js` - Blog details layout wrapper
  - `src/components/layout/main/BlogsMain.js` - Blog listing page wrapper with dynamic titles
- **Pages**:
  - `src/app/blogs/page.js` - Blog listing page with server-side rendering
  - `src/app/blogs/[id]/page.js` - Dynamic blog details page with API fetching
- **API Utilities**:
  - `src/utils/api.js` - Enhanced API client with caching and retries
  - `src/apis/index.js` - Comprehensive API endpoint definitions for all features
- **Hooks**:
  - `src/hooks/getQuery.hook.js` - Custom hook for API GET requests

## Backend Integration
- **Blog API Endpoints**:
  - `/blogs/get` - Get all blogs with filtering and pagination
  - `/blogs/get/:id` - Get a specific blog by ID
  - `/blogs/create` - Create a new blog post
  - `/blogs/update/:id` - Update an existing blog post
  - `/blogs/delete/:id` - Delete a blog post
  - `/blogs/related/:id` - Get related blogs based on tags or categories
  - `/blogs/categories` - Get all blog categories
  - `/blogs/tags` - Get popular blog tags
- **Data Structure**:
  - Blog posts include title, blog_link, upload_image, and other metadata
  - Frontend transforms API data to match component requirements
  - Automatic generation of missing fields with sensible defaults

## User Engagement Features
- **Interactive Elements**:
  - Reading progress tracking with visual indicator
  - Like/bookmark functionality with localStorage persistence
  - Social sharing capabilities (Facebook, Twitter, LinkedIn)
  - Copy link to clipboard with feedback
  - Table of contents with active section highlighting
  - Easy navigation with back-to-top button
  - Related blogs section for content discovery
  
- **Content Discovery**:
  - Advanced filtering with category and tag support
  - Robust search functionality for content finding
  - Grid and list view options for different browsing preferences
  - Featured content toggle for highlighting important articles
  - Related content recommendations for increased engagement

## Future Development
- Enhance analytics tracking for user interactions
- Implement server-side rendering for blog content
- Add content recommendation engine
- Further optimize for mobile performance 

## Project Context: Course Content Components

The Medh ed-tech platform includes several course landing pages, each with similar structure but different styling and content. We've implemented a standardization solution to reduce code duplication and ensure consistency.

### Problem Identified
Each course page (`digital-marketing`, `vedic-mathematics`, `personality-development`, `ai-data-science`) had its own implementation of an `AnimatedContent.js` component with:
- Duplicate animation logic
- Similar UI structure
- Different styling approaches
- Varying levels of performance optimization

### Solution Implemented
1. **Shared AnimatedContent Component**
   - Created a standardized, reusable component
   - Implemented performance optimizations (throttling, hardware acceleration)
   - Added accessibility features (reduced motion support)
   - Supports customization via options

2. **Adapter Pattern**
   - Created a `CourseContentAdapter` to ease migration
   - Maps course-specific component names to standardized names
   - Preserves course-specific styling and animations
   - Allows gradual adoption without breaking changes

3. **Implementation Strategy**
   - Started with the Digital Marketing course as a proof of concept
   - Plan to gradually refactor other course pages
   - Maintain backward compatibility throughout

### Benefits
- **Reduced Code Duplication**: Centralized animation and layout logic
- **Consistent User Experience**: Standardized UI patterns across courses
- **Improved Performance**: Optimized animations and scroll handling
- **Better Maintainability**: Easier updates and feature additions
- **Enhanced Accessibility**: Added reduced motion support

### Next Steps
- Refactor remaining course pages to use the shared component
- Add automated tests for the shared component
- Consider expanding the shared component library for other repeated UI patterns 