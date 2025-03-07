# Medh Project - User Preferences

## Important Files
- `src/apis/index.js`: Contains all API endpoint definitions and URL construction logic
- `src/components/sections/courses/HomeCourseSection.js`: Main component for displaying course grids
- `src/components/layout/main/dashboards/AddCourse.js`: Form for creating new courses
- `src/components/layout/main/dashboards/UpdateCourse.js`: Form for updating existing courses
- `src/contexts/CurrencyContext.js`: Context provider for currency conversion

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

## API Structure
- **Base URL**: Defined dynamically using environment variables
- **Authentication**: JWT tokens in Authorization header
- **Error Handling**: Consistent error response format with status codes
- **Parameters**:
  - Use URLSearchParams for query parameters
  - Support for array parameters using comma-separated values
  - Proper encoding of all parameter values

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
- **Error Handling**:
  - try/catch blocks for async operations
  - Fallback UI for error states
  - Descriptive error messages

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