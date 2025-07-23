# Course Hero Banner Component

A unified, reusable hero section component for all course pages in the Medh platform. This component provides consistent design patterns while allowing course-specific customization through themes and configurations.

## Features

- **Unified Design**: Consistent layout and styling across all course pages
- **Course-Specific Themes**: Pre-configured color schemes for each course type
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **GPU Optimized**: Performance-optimized with GPU acceleration
- **Glassmorphism Effects**: Modern glassmorphism design with backdrop blur
- **Dark Mode Support**: Full dark/light theme compatibility
- **Accessibility**: ARIA labels and semantic HTML structure
- **TypeScript**: Fully typed with comprehensive interfaces

## Supported Course Types

1. **AI & Data Science** (`ai-data-science`)
   - Blue/Purple/Indigo color scheme
   - Technology-focused design elements

2. **Digital Marketing** (`digital-marketing`)
   - Cyan/Blue/Purple color scheme
   - Marketing and analytics focus

3. **Personality Development** (`personality-development`)
   - Emerald/Green/Teal color scheme
   - Personal growth and development focus

4. **Vedic Mathematics** (`vedic-mathematics`)
   - Amber/Orange/Yellow color scheme
   - Traditional and educational focus

## Usage

### Basic Implementation

```tsx
import CourseHeroBanner from '@/components/sections/hero-banners/CourseHeroBanner';
import { Database, Brain, Rocket } from 'lucide-react';

const MyCoursePage = () => {
  const features = [
    {
      icon: <Database className="w-7 h-7 text-blue-500" />,
      title: "Data Science",
      description: "Master data analysis and visualization"
    },
    {
      icon: <Brain className="w-7 h-7 text-blue-500" />,
      title: "Machine Learning",
      description: "Build intelligent systems"
    },
    {
      icon: <Rocket className="w-7 h-7 text-blue-500" />,
      title: "AI Applications",
      description: "Develop real-world solutions"
    }
  ];

  return (
    <CourseHeroBanner
      courseType="ai-data-science"
      title="AI & Data Science"
      description="Supercharge your career with cutting-edge AI and Data Science skills."
      features={features}
      enrollmentPath="/enrollment/ai-and-data-science"
      badge="New Course"
    />
  );
};
```

### Using Pre-configured Examples

```tsx
import { AIAndDataScienceHero } from '@/components/sections/hero-banners/CourseHeroExamples';

const AICoursePage = () => {
  return <AIAndDataScienceHero />;
};
```

## Props Interface

```tsx
interface ICourseHeroBannerProps {
  courseType: 'ai-data-science' | 'digital-marketing' | 'personality-development' | 'vedic-mathematics';
  title: string;
  description: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  enrollmentPath: string;
  badge?: string;
}
```

### Props Description

- **courseType**: Determines the color scheme and theme
- **title**: Main course title displayed in the hero section
- **description**: Course description text
- **features**: Array of feature cards with icons, titles, and descriptions
- **enrollmentPath**: URL for the enrollment button
- **badge**: Optional badge text (overrides default course badge)

## Design System Integration

The component integrates with the Medh design system:

- Uses `buildAdvancedComponent` for glassmorphism effects
- Implements `getResponsive` for responsive design patterns
- Follows the established color palette and typography
- Maintains consistency with existing hero components

## Customization

### Adding New Course Types

To add a new course type, update the `COURSE_CONFIGS` object:

```tsx
const COURSE_CONFIGS = {
  // ... existing configs
  'new-course-type': {
    colors: {
      primary: 'red',
      secondary: 'pink',
      accent: 'rose',
      gradient: {
        from: 'from-red-400',
        via: 'via-pink-400',
        to: 'to-rose-400'
      },
      background: {
        from: 'from-red-50',
        via: 'via-pink-50/80',
        to: 'to-rose-50'
      },
      dark: {
        from: 'from-slate-900',
        via: 'via-red-900/20',
        to: 'to-pink-900/20'
      }
    },
    badge: "Custom Badge"
  }
};
```

### Customizing Features

Each feature card supports:
- Custom icons (recommended size: 28x28px)
- Custom titles and descriptions
- Course-specific accent colors

### Styling Overrides

The component uses Tailwind CSS classes that can be customized through:
- CSS custom properties
- Tailwind configuration
- Component prop extensions

## Performance Optimizations

- **Memoization**: All class names and computed values are memoized
- **GPU Acceleration**: Uses `gpu-accelerated` classes for smooth animations
- **Lazy Loading**: Images and heavy assets are optimized
- **Bundle Splitting**: Component is tree-shakeable

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Focus management

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for glassmorphism effects
- Graceful degradation for older browsers

## File Structure

```
src/components/sections/hero-banners/
├── CourseHeroBanner.tsx          # Main component
├── CourseHeroExamples.tsx        # Usage examples
└── README.md                     # This documentation
```

## Migration Guide

### From Individual Banner Components

1. Replace individual banner imports with `CourseHeroBanner`
2. Map existing props to the new interface
3. Update course type to match the new enum
4. Test responsive behavior and animations

### Example Migration

**Before:**
```tsx
import CourseAiCourseBanner from '@/components/sections/course-ai/courseAiCourseBanner';

<CourseAiCourseBanner />
```

**After:**
```tsx
import CourseHeroBanner from '@/components/sections/hero-banners/CourseHeroBanner';

<CourseHeroBanner
  courseType="ai-data-science"
  title="AI & Data Science"
  description="..."
  features={[...]}
  enrollmentPath="/enrollment/ai-and-data-science"
/>
```

## Best Practices

1. **Consistent Icons**: Use Lucide React icons for consistency
2. **Descriptive Text**: Write clear, benefit-focused descriptions
3. **Performance**: Keep feature arrays to 3 items for optimal layout
4. **Accessibility**: Ensure all icons have proper alt text
5. **Testing**: Test across different screen sizes and themes

## Troubleshooting

### Common Issues

1. **Color Classes Not Working**: Ensure Tailwind CSS is properly configured
2. **Icons Not Displaying**: Check Lucide React import and icon names
3. **Responsive Issues**: Verify breakpoint classes are applied correctly
4. **Performance Issues**: Check for unnecessary re-renders and optimize props

### Debug Mode

Enable debug mode by adding `data-debug="true"` to the component:

```tsx
<CourseHeroBanner
  {...props}
  data-debug="true"
/>
```

This will show additional debugging information in the console.

## Contributing

When contributing to this component:

1. Follow the existing TypeScript patterns
2. Maintain backward compatibility
3. Add comprehensive tests
4. Update documentation
5. Follow the established design system guidelines 