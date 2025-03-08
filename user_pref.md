# Medh Project Preferences

## Project Structure
- **Frontend**: Next.js with Tailwind CSS
- **UI Libraries**: Lucide icons, Material UI integration
- **Components Structure**: Organized by feature/section
- **State Management**: React hooks, Context API
- **Styling**: Tailwind with custom utilities

## Design Guidelines
- **Color Palette**:
  - Primary: Brand colors (Primary-500 for accents)
  - Neutrals: Gray scale (50-900)
  - Dark mode compatible with proper contrast
  
- **Typography**:
  - Headings: Bold, clean with proper hierarchy (3xl-5xl)
  - Body: Regular weight, readable (base-lg)
  - Feature text: Semi-bold with proper spacing
  
- **Components**:
  - Cards: Subtle shadows, rounded corners (xl-2xl)
  - Buttons: Rounded with proper padding and hover effects
  - Icons: Consistent sizing, proper alignment with text
  
- **Animations**:
  - Subtle transitions (300-500ms)
  - Transform effects on hover/interaction
  - Smooth page transitions and loading states
  
- **Mobile First**:
  - Stack layouts vertically on mobile
  - Use swipers/carousels for horizontal content on mobile
  - Proper touch targets (min 44px)
  - Simplified content for smaller screens

## Important Files
- `src/components/sections/why-medh/WhyMedh.js` - Why Medh section with features highlight
- `src/components/sections/why-medh/Certified.js` - Certifications showcase component
- Other section components in `src/components/sections/`
- `src/components/sections/hire/Hire.js` - Component for corporate hiring and training section
- `src/components/sections/hire/JoinMedh.js` - Component for educator and partner institution section
- `src/components/layout/main/Home1.js` - Main homepage layout with all section imports
- `src/components/sections/courses/HomeCourseSection.js` - Courses display component
- `src/components/sections/courses/CourseCard.js` - Individual course card component
- `src/apis/index.js` - API configuration

## API Structure
- Base URL Configuration: Dynamic based on environment
- Modules: Auth, Courses, Students, etc.
- Error Handling: Consistent across app
- Data Fetching: Optimized with caching strategies
- Using Next.js API routes
- Dynamic API URL configuration
- Server-side validation for inputs
- Courses API uses pagination and filters
- Live and Blended courses are fetched separately
- Filtering applied client-side after fetching

## Performance Guidelines
- Optimize images with next/image
- Lazy load components when appropriate
- Use proper key props for lists
- Implement proper memoization
- Keep bundle size in check with code splitting

## Global Design Consistency
- **Color Themes**:
  - Live Courses: Rose/pink theme (#f43f5e and related shades)
  - Blended Courses: Indigo/blue theme (#4f46e5 and related shades)
  - Free Courses: Green theme (#22c55e and related shades)
- **Typography**:
  - Headings: Inter, semi-bold
  - Body: Inter, regular
  - Sizes: Follow the Tailwind CSS scale
- **Components**:
  - Cards: Rounded corners (rounded-lg), subtle shadows, hover effects
  - Buttons: Consistent padding, rounded corners, hover and active states
  - Inputs: Standard height, padding, and focus states
- Modern UI with Gen Z aesthetic
- Gradient backgrounds with smooth transitions
- Consistent color palette across components
- Animation delays for proper loading of elements
- Card visibility triggered by scroll position

## Common Parameters
- **Pagination**: page, limit
- **Sorting**: sort_by, sort_order
- **Filtering**:
  - course_category: Course category (string or array)
  - category_type: Free, Paid, etc. (string or array)
  - course_tag: Course tag (string or array)
  - class_type: Type of class delivery (string or array)
  - price_range: Price range in format "min-max"
  - status: Published, Upcoming, etc.

## Coding Techniques
- **Component Structure**:
  - Functional components with hooks
  - Props validation with PropTypes
  - Clear separation of concerns
- **State Management**:
  - Context API for global state
  - useState for component-level state
  - useReducer for complex state logic
- **Performance Optimization**:
  - Memoization with useMemo and useCallback
  - Code splitting and lazy loading
  - Proper dependency arrays in useEffect
  - Responsive padding optimization for different screens
  - Conditional rendering based on viewport size (isCompact prop)
  - Optimized UI density for laptop (1366x768) displays
  - Reduced whitespace in primary layouts for better information density
- **Error Handling**:
  - try/catch blocks for async operations
  - Fallback UI for error states
  - Descriptive error messages
- Client components with "use client" directive 
- React hooks for state management (useState, useEffect, useRef)
- Animation triggers based on scroll position and viewport
- Responsive design for different screen sizes
- Image optimization with Next.js Image component
- CSS animations for smooth transitions

## Project-Specific Preferences
- **Course Types**:
  - Live: Real-time instructor-led courses
  - Blended: Combination of self-paced and live sessions
  - Free: No-cost courses with limited features
- **Price Display**:
  - Support for multiple currencies
  - Clear indication of batch vs. individual pricing
  - Display of discounts where applicable
- **Filtering Logic**:
  - Support for multiple selection in filters
  - Clear visual indication of active filters
  - Easy way to clear all filters

# User Preferences for Medh Web Application

## Important Files and Components
- `src/components/layout/footer/Footer.js` - Main footer component
- `src/components/layout/footer/CopyRight.js` - Copyright section in footer with QR code
- `src/components/layout/footer/FooterNavList.js` - Navigation links and logo in footer
- `src/components/shared/wrappers/PageWrapper.js` - Page wrapper that manages layout

## Design Consistency Guidelines

### Colors
- Primary gradient: `from-primary-500 to-secondary-500`
- Dark background: `from-gray-900 to-black`
- Text colors: 
  - White/light gray for headings on dark backgrounds
  - Gray-400 for regular text on dark backgrounds
  - Primary-400 for accents and hover states

### Typography
- Font sizes should be kept minimal:
  - xs (12px) for minor details
  - sm (14px) for most footer content
  - base (16px) for important headings
- Use proper font weights:
  - Regular (400) for most text
  - Medium (500) for emphasized text
  - Semibold (600) for headings

### Spacing
- Footer should use compact spacing:
  - Outer padding: pt-10/12 pb-3/4 (mobile/desktop)
  - Section spacing: gap-6 md:gap-8
  - Text spacing: space-y-1.5
- Prefer smaller spacing increments (px, py) over larger ones

### Animation
- Use subtle animations:
  - Durations: 300-500ms
  - Opacity + transform for entrances
  - Scale for hover effects
  - Color transitions for links

### Branding Elements
- Logo:
  - Located in the About Us section of footer
  - Uses primary gradient background with subtle blur
  - Responsive sizing (w-32 md:w-36)
  - Maintains brand identity with consistent styling
- QR Code:
  - Compact size (80px mobile, 100px desktop)
  - Glass-morphism design with backdrop blur
  - Gradient hover effect
  - Centered above copyright information

## UI/UX Preferences
- Modern, clean aesthetic with minimal decorative elements
- Responsive design with logical breakpoints
- Footer should be full width and stick to bottom of page
- Dark mode support for all components
- Hover effects should be subtle but noticeable
- Mobile layout should use stacked approach with proper spacing

## API Structure
- Not applicable for footer components

## Coding Techniques
- Use semantic HTML elements (`footer`, `nav`, etc.)
- Implement proper a11y attributes
- Prefer functional components with hooks
- Keep animations performant (transform, opacity)
- Use responsive utilities consistently
- Keep components modular and reusable

# Medh Project User Preferences

## Key Design Guidelines

- **Branding Colors**: Primary green (#4CAF50) with secondary accents
- **Typography**: Modern, clean font hierarchy with good readability
- **Animation Style**: Subtle, performance-optimized animations with smooth transitions
- **Design System**: Material UI components combined with Tailwind CSS for styling
- **Theme**: Minimalist, elegant with a focus on educational content

## Important Files

### Layout Components
- `src/components/layout/footer/Footer.js` - Main footer component
- `src/components/layout/footer/FooterNavList.js` - Footer navigation list
- `src/components/layout/footer/CopyRight.js` - Copyright component

### Assets
- `src/assets/images/logo/logo_2.png` - Medh logo
- `src/assets/images/footer/qr.png` - QR code for Medh

## UI/UX Principles
- User-centered design focusing on educational content
- Responsiveness across all device sizes
- Accessibility compliance
- Performance optimization
- Modern, Gen-Z appealing interfaces

## Coding Standards
- Clean, well-commented code
- DRY (Don't Repeat Yourself) principles
- Component-based architecture
- Performance optimization
- PropTypes for type checking

## Design Consistency

### Color Scheme
- Live courses: Rose/pink color palette (#F43F5E)
- Blended courses: Indigo color palette (#6366F1)
- Primary gradient: Linear gradient from primary-500 to secondary-500

### Typography
- Headings: Bold/ExtraBold, gray-800 (dark: white)
- Body text: Regular/Medium, gray-600 (dark: gray-300)
- Buttons: Medium/Bold text

### UI Components
- Cards: Rounded corners (rounded-xl), subtle shadows, hover effects
- Buttons: Rounded design, consistent padding
- Filters: Pill-shaped (rounded-full)

## Mobile Design
- Improved padding for small devices
- Optimized card layout for mobile view
- Enhanced visual elements for touch interfaces
- In-card hover state triggered by touch for mobile
- Text-based action buttons instead of icon-only buttons
- Compact "View More" buttons positioned in bottom-right corner for clear call-to-action
- Touch-activated hover state with close button in top-right corner
- Device detection using both user agent and viewport width
- Larger touch targets (min 44px) for better mobile usability
- Same content display for both desktop hover and mobile touch states
- Consistent animation effects between desktop and mobile
- Proper element positioning to avoid conflicts (tags and close buttons)
- Hide course type tags in mobile hover view for cleaner interface

## Mobile Interaction Patterns
- Replace hover states with tap-activated in-card hover effects
- Use explicit text labels ("View More") instead of ambiguous icons
- Position action buttons at the bottom-right corner for easy reach
- Add close buttons in top-right corner for cleaner interaction
- Include obvious close buttons for interactive elements
- Ensure proper event propagation handling for nested clickable elements
- Add immediate visual feedback for touch interactions
- Ensure all tappable elements have proper hit areas
- Remove animation delays for instant response to user interaction
- Use the same content displays for both hover (desktop) and touch (mobile)
- Maintain consistent scaling and animation effects across platforms
- Provide proper padding around elements to prevent overlap
- Show course type tags only in normal view, not in hover view on mobile

## Mobile Performance Optimizations
- Use consistent component structure between desktop and mobile
- Properly truncate long text to prevent layout issues
- Implement proper cleanup of event listeners and styles
- Maintain animations and transitions for visual continuity

## API Structure
- Courses API uses pagination and filters
- Live and Blended courses are fetched separately
- Filtering applied client-side after fetching

## Code Preferences
- Functional components with hooks
- Using Tailwind CSS for styling
- Framer Motion for animations
- Lucide icons for consistent iconography
- Device detection in useEffect hooks
- Conditional rendering based on device type
- Cleanup of event listeners and timers

# User Preferences for Medh Web Project

## Important Files
- **API Configuration**: `src/apis/index.js`
- **Component Files**:
  - `src/components/shared/download-broucher/index.js`: Brochure download modal
- **Layout Files**: 
  - To be added

## Global Design Consistency
- Modern UI components with a Gen Z look & feel
- Minimal, elegant, and user-friendly design
- Consistent color theme across all pages
- Well-structured typography for readability
- Smooth animations and transitions

## API Structure
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- API utilities for URL parameter handling:
  - `safeEncode`: Encode values for use in URLs
  - `appendArrayParam`: Append array parameters to URL
  - `appendParam`: Append simple parameters to URL
- Consistent endpoint naming pattern
- Structured API organization by module

## Coding Techniques
- Component-based architecture with React
- Next.js for Server-Side Rendering and page routing
- Clean, maintainable, and well-commented code
- DRY (Don't Repeat Yourself) and SOLID principles
- Performance optimization (lazy loading, code splitting)

## Data Handling
- Form validation with custom validation functions
- Error handling for API requests
- Authentication with HttpOnly cookies
- User input sanitization

## Development Guidelines
- Plan before execution with clear goals
- Follow an iterative approach for continuous improvement
- Write modular, reusable components
- Optimize for performance, security, and scalability

# User Preferences - Medh Project

## Important Files
- `src/components/sections/blogs/Blogs.js` - Blog section component
- `src/components/sections/blogs/BlogCard.js` - Individual blog card component
- `src/utils/api.js` - API utilities file
- `src/apis/apiClient.js` - API client configuration
- `src/apis/index.js` - API endpoints definition
- `src/hooks/getQuery.hook.js` - Custom hook for API GET requests

## Global Design Consistency
- Modern UI with Gen Z look & feel
- Responsive design for all screen sizes
- Smooth animations and transitions
- Dark/light mode support
- Consistent color palette with gradient accents
- Card-based UI components with hover effects

## API Structure
- RESTful API endpoints
- Consistent error handling
- JWT authentication
- Axios for API requests
- Custom interceptors for request/response handling
- Environment-based configuration

## Coding Techniques
- React hooks for state management
- Functional components
- Tailwind CSS for styling
- Next.js for server-side rendering and routing
- Component-based architecture
- Lazy loading for better performance 

## Key Course Features
- **Course Types**:
  - **Live Courses**: Interactive sessions with instructors, real-time learning
    - Filters: Upcoming, Popular, Latest
    - Color scheme: Rose/Red accent (#e11d48)
  - **Blended Courses**: Self-paced learning with interactive content
    - Filters: Popular, Latest, Beginner Friendly
    - Color scheme: Indigo accent (#4f46e5)
  - **All Courses**: Combined view of both course types
    - Color scheme: Primary brand accent

- **Course API Parameters**:
  - `class_type`: "live" or "blended" to filter course types
  - `filterState`: Object containing active filter states
  - Custom sorting based on filter selections (upcoming, popular, latest)

## Important Files
- **Courses Page**: 
  - `src/app/courses/page.js`: Main client component for courses page with tab navigation
  - `src/app/courses/metadata.js`: Server component for SEO metadata
  - `src/components/sections/courses/CoursesFilter.js`: Main component for course filtering and display
  - `src/components/sections/courses/HomeCourseSection.js`: Featured courses component with bifurcation 