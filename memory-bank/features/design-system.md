# UI/UX Design System

## Overview
The UI/UX Design System provides a consistent visual language and user experience across the Medh platform. It includes a comprehensive set of components, styles, and patterns that follow modern design principles and accessibility standards.

## Components
1. Core Components
   - Located in: `src/components/ui/`
   - Button: `Button.tsx`
   - Input: `Input.tsx`
   - Card: `Card.tsx`
   - Modal: `Modal.tsx`
   - Tabs: `Tabs.tsx`
   - Dropdown: `Dropdown.tsx`

2. Layout Components
   - Located in: `src/components/layout/`
   - Header: `Header.tsx`
   - Footer: `Footer.tsx`
   - Sidebar: `Sidebar.tsx`
   - Container: `Container.tsx`
   - Grid: `Grid.tsx`
   - Section: `Section.tsx`

3. Feature Components
   - Located in: `src/components/sections/`
   - Course components
   - Blog components
   - Auth components
   - Dashboard components

## Design Tokens
1. Colors
   ```css
   --primary: #3B82F6;
   --primary-dark: #2563EB;
   --primary-light: #60A5FA;
   --secondary: #10B981;
   --secondary-dark: #059669;
   --secondary-light: #34D399;
   --accent: #F59E0B;
   --accent-dark: #D97706;
   --accent-light: #FBBF24;
   --background: #FFFFFF;
   --background-dark: #F3F4F6;
   --text: #1F2937;
   --text-light: #6B7280;
   --text-dark: #111827;
   --error: #EF4444;
   --success: #10B981;
   --warning: #F59E0B;
   --info: #3B82F6;
   ```

2. Typography
   ```css
   --font-family: 'Inter', sans-serif;
   --font-size-xs: 0.75rem;
   --font-size-sm: 0.875rem;
   --font-size-base: 1rem;
   --font-size-lg: 1.125rem;
   --font-size-xl: 1.25rem;
   --font-size-2xl: 1.5rem;
   --font-size-3xl: 1.875rem;
   --font-size-4xl: 2.25rem;
   --font-weight-normal: 400;
   --font-weight-medium: 500;
   --font-weight-semibold: 600;
   --font-weight-bold: 700;
   --line-height-tight: 1.25;
   --line-height-normal: 1.5;
   --line-height-relaxed: 1.75;
   ```

3. Spacing
   ```css
   --spacing-0: 0;
   --spacing-1: 0.25rem;
   --spacing-2: 0.5rem;
   --spacing-3: 0.75rem;
   --spacing-4: 1rem;
   --spacing-5: 1.25rem;
   --spacing-6: 1.5rem;
   --spacing-8: 2rem;
   --spacing-10: 2.5rem;
   --spacing-12: 3rem;
   --spacing-16: 4rem;
   --spacing-20: 5rem;
   --spacing-24: 6rem;
   ```

4. Breakpoints
   ```css
   --breakpoint-sm: 640px;
   --breakpoint-md: 768px;
   --breakpoint-lg: 1024px;
   --breakpoint-xl: 1280px;
   --breakpoint-2xl: 1536px;
   ```

## Design Principles
1. Accessibility
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast requirements
   - Focus management

2. Responsiveness
   - Mobile-first approach
   - Fluid typography
   - Flexible layouts
   - Adaptive components
   - Touch-friendly interactions

3. Consistency
   - Consistent component API
   - Consistent spacing
   - Consistent typography
   - Consistent colors
   - Consistent interactions

## Component Patterns
1. Form Patterns
   - Label placement
   - Error states
   - Help text
   - Validation feedback
   - Submit buttons

2. Navigation Patterns
   - Primary navigation
   - Secondary navigation
   - Breadcrumbs
   - Pagination
   - Tabs

3. Feedback Patterns
   - Loading states
   - Error states
   - Success states
   - Empty states
   - Confirmation dialogs

## Animation Guidelines
1. Transitions
   - Duration: 150ms for small changes, 300ms for larger changes
   - Easing: ease-in-out for most transitions
   - Properties: opacity, transform, background-color
   - Performance: use transform and opacity for better performance

2. Micro-interactions
   - Button hover/active states
   - Form focus states
   - Toggle switches
   - Checkboxes and radio buttons
   - Dropdown menus

3. Page Transitions
   - Fade transitions between pages
   - Slide transitions for modals
   - Scale transitions for popovers
   - Stagger animations for lists
   - Loading skeletons

## Dark Mode
1. Color Palette
   ```css
   --dark-background: #111827;
   --dark-background-light: #1F2937;
   --dark-text: #F9FAFB;
   --dark-text-light: #D1D5DB;
   --dark-border: #374151;
   ```

2. Implementation
   - CSS variables for theme values
   - Tailwind dark mode
   - System preference detection
   - Manual toggle
   - Persistent preference

3. Considerations
   - Color contrast
   - Image adaptation
   - Icon adaptation
   - Shadow adaptation
   - Focus state adaptation

## Known Issues
1. Accessibility
   - Some components lack proper ARIA attributes
   - Focus management needs improvement
   - Color contrast issues in some components

2. Responsiveness
   - Some components break on small screens
   - Typography scaling needs improvement
   - Touch targets need optimization

3. Consistency
   - Inconsistent spacing in some components
   - Inconsistent component API
   - Inconsistent animation patterns

## Future Enhancements
1. Component Library
   - More specialized components
   - Better documentation
   - Interactive examples
   - Component playground

2. Design Tokens
   - More design tokens
   - Better organization
   - Theme customization
   - Design token documentation

3. Accessibility
   - Improved keyboard navigation
   - Better screen reader support
   - More ARIA attributes
   - Accessibility testing 