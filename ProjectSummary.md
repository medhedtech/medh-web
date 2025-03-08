# Medh Project Summary

## Project Overview
Medh is an ed-tech platform built with Next.js that offers both live interactive courses and blended learning courses. The platform features a modern UI with a focus on user experience and responsive design.

## Key Components

### Course Section
The HomeCourseSection component displays both live and blended courses in a visually appealing grid layout. Each course type has its own distinct styling, with live courses using a rose/pink color scheme and blended courses using an indigo color scheme.

Key features:
- Responsive grid layout (1 column on mobile, 2-4 columns on larger screens)
- Filter options for different course types
- Animation effects for loading and interaction
- Clear visual distinction between live and blended courses

### Course Cards
Individual course cards display key information about each course, including title, duration, number of sessions, and pricing. The cards are designed to be visually appealing and provide important information at a glance.

Recent improvements:
- Added bold course type indicators
- Enhanced visual distinction between different course types
- Improved responsive design for mobile devices
- Made text bolder for better readability
- Added mobile-specific popup view to replace hover functionality on touch devices
- Implemented mobile detection to provide device-appropriate interactions
- Created a floating "View Details" button for mobile users

## Technical Architecture
- Next.js for server-side rendering and routing
- Tailwind CSS for styling
- Framer Motion for animations
- API integration for fetching course data
- Client-side filtering and sorting
- Device detection for optimized mobile experience

## Design Principles
- Modern, clean UI with ample whitespace
- Consistent color schemes for different course types
- Bold typography for important information
- Responsive design for all screen sizes
- Subtle animations and transitions for enhanced UX
- Device-specific interactions (hover on desktop, tap+popup on mobile)

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **UI Components**: Custom components with Material UI principles
- **Animations**: CSS transitions, transforms, and minimal JavaScript animations
- **Assets Management**: Next.js Image component for optimized loading
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Routing**: Next.js App Router

## Key Routes
- `/` - Homepage
- `/about-us` - About Medh
- `/skill-development-courses` - Course listings
- `/join-us-as-educator` - Educator recruitment
- `/join-us-as-school-institute` - School/Institute partnerships
- `/corporate-training-courses` - Corporate training offerings
- `/blogs` - Blog articles
- `/contact-us` - Contact information

## Recently Modified Components
- **Footer**: 
  - Enhanced with actual logo and QR code
  - Created mobile-optimized version with accordion navigation
  - Implemented separate designs for mobile and desktop viewports
- **FooterNavList**: 
  - Updated to display logo image
  - Added mobile-specific accordion menu for better space utilization
  - Created compact contact information display for mobile
- **CopyRight**: 
  - Improved with QR code image and hover effects
  - Redesigned for mobile with side-by-side QR and social links
  - Optimized text sizes and spacing for mobile screens
- **CourseCard**:
  - Added mobile-specific popup view for better interaction on touch devices
  - Implemented device detection to serve appropriate interaction models
  - Enhanced mobile UX with dedicated popup view replacing hover functionality
  - Added floating action button for mobile course card interactions

## Mobile Optimization Strategies
- Conditional rendering based on viewport size detection
- Accordion menus to save vertical space on mobile
- Reduced padding and margins for efficient space usage
- Smaller asset sizes for faster mobile loading
- Touch-friendly interactive elements (large buttons, proper tap targets)
- Simplified layouts for better mobile readability
- Device-specific interaction patterns (hover vs. tap)
- Modal popups for detailed content on mobile
- Mobile detection using both user agent and viewport size
- Scroll management for mobile modals (body scroll lock)

## Next Improvements
- Implement dark mode toggle
- Enhance accessibility features
- Optimize image loading and responsive sizes
- Add more interactive elements to improve engagement
- Expand mobile-specific optimizations to other components 