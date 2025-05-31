# ProgressCourse Component

A reusable course card component designed for displaying enrolled courses with progress tracking, status indicators, and interactive elements.

## Features

- **Progress Tracking**: Visual progress bar with percentage and status messages
- **Multiple States**: Supports 'not_started', 'in_progress', and 'completed' states
- **Payment Integration**: Handles pending payment status with appropriate UI
- **Certification Support**: Shows certification badges and download options
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode**: Full dark mode support
- **Animations**: Smooth hover and tap animations using Framer Motion
- **Accessibility**: Semantic HTML and proper ARIA labels

## Usage

### Basic Usage

```tsx
import ProgressCourse from '@/components/shared/courses/ProgressCourse';

<ProgressCourse
  courseId="course-123"
  title="Advanced React Development"
  instructor="John Doe"
  status="in_progress"
  progress={75}
/>
```

### Advanced Usage

```tsx
<ProgressCourse
  courseId="course-123"
  title="Advanced React Development"
  instructor="John Doe"
  status="in_progress"
  progress={75}
  category="Web Development"
  skills={["React", "TypeScript", "Hooks"]}
  enrollmentType="Live"
  rating={4.8}
  isCertified={true}
  completedLessons={["lesson-1", "lesson-2", "lesson-3"]}
  totalLessons={12}
  expiryDate="2024-06-15T23:59:59Z"
  onClick={() => handleCourseClick(courseId)}
  onViewMaterials={() => handleViewMaterials(courseId)}
  onPayment={() => handlePayment(courseId)}
  onCertificate={() => handleCertificate(courseId)}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `courseId` | `string` | Unique identifier for the course |
| `title` | `string` | Course title |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `instructor` | `string` | `"Instructor"` | Instructor name |
| `image` | `string` | `undefined` | Course image URL |
| `progress` | `number` | `0` | Progress percentage (0-100) |
| `status` | `'completed' \| 'in_progress' \| 'not_started'` | `'not_started'` | Course completion status |
| `lastAccessed` | `string` | `undefined` | ISO date string of last access |
| `category` | `string` | `"General"` | Course category |
| `duration` | `string` | `"8-12 weeks"` | Course duration |
| `rating` | `number` | `4.5` | Course rating (0-5) |
| `skills` | `string[]` | `[]` | Array of skill tags |
| `enrollmentType` | `string` | `"Individual"` | Type of enrollment |
| `paymentStatus` | `'pending' \| 'completed' \| 'failed' \| 'refunded'` | `undefined` | Payment status |
| `isCertified` | `boolean` | `false` | Whether course offers certification |
| `remainingTime` | `string` | `undefined` | Remaining time string |
| `expiryDate` | `string` | `undefined` | ISO date string of expiry |
| `completedLessons` | `string[]` | `[]` | Array of completed lesson IDs |
| `totalLessons` | `number` | `0` | Total number of lessons |
| `completionCriteria` | `ICompletionCriteria` | `undefined` | Completion requirements |
| `className` | `string` | `""` | Additional CSS classes |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onClick` | `() => void` | Called when card is clicked |
| `onViewMaterials` | `() => void` | Called when "Materials" button is clicked |
| `onPayment` | `() => void` | Called when "Payment" button is clicked |
| `onCertificate` | `() => void` | Called when "Certificate" button is clicked |

## Component States

### Not Started
- Shows "Ready to Begin" message
- Continue button to start the course
- No progress bar

### In Progress
- Shows progress bar with percentage
- Progress message based on completion
- Continue button to resume
- Lesson count if available

### Completed
- Shows "Course Completed" message
- Green checkmark icon
- Download or Certificate button
- Review materials option

### Payment Pending
- Shows amber "Payment Pending" badge
- Payment button with credit card icon
- Restricted access until payment

## Styling

The component uses Tailwind CSS classes and follows the project's design system:

- **Colors**: Primary, gray, green, blue, amber, yellow color schemes
- **Spacing**: Consistent padding and margins
- **Typography**: Font weights and sizes from design system
- **Borders**: Rounded corners and subtle borders
- **Shadows**: Hover effects with shadow elevation

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Touch-friendly button sizes (44px minimum)

## Dependencies

- React 18+
- Next.js 13+
- Framer Motion
- Lucide React (icons)
- Tailwind CSS

## Examples

See `ProgressCourse.example.tsx` for comprehensive usage examples with different states and configurations.

## Migration from EnrollCoursesCard

If migrating from the existing `EnrollCoursesCard`, map the props as follows:

```tsx
// Old EnrollCoursesCard
<EnrollCoursesCard
  title={course.course_title}
  image={course.course_image}
  progress={course.progress}
  status={course.completion_status}
  onClick={() => handleCardClick(course._id)}
/>

// New ProgressCourse
<ProgressCourse
  courseId={course._id}
  title={course.course_title}
  image={course.course_image}
  progress={course.progress}
  status={course.completion_status}
  onClick={() => handleCardClick(course._id)}
/>
``` 