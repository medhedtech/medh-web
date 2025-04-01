# Simplified Curriculum Builder

This document explains the new simplified curriculum builder component that replaces the previous complex one.

## Key Improvements

### 1. Visual and Intuitive UI
- **Card-based layout** with clear visual hierarchy
- **Color-coded lesson types** (blue for videos, purple for quizzes, orange for assignments)
- **Expandable/collapsible weeks** to focus on one section at a time
- **Simplified form fields** with inline editing

### 2. Reduced Cognitive Load
- **Fewer steps** to add content
- **Streamlined input fields** that only show what's necessary
- **Curriculum overview** with at-a-glance statistics
- **Quick tips** to guide users through the process

### 3. Enhanced UX Features
- **Auto-scrolling** to newly added items
- **Improved drag-and-drop** system
- **Inline editing** of titles without separate modals
- **Confirmation dialogs** for destructive actions

### 4. Mobile-Friendly Design
- **Responsive layout** that works on all screen sizes
- **Touch-friendly** buttons and controls
- **Simplified interactions** for touchscreen usage

### 5. Video Upload and Direct Lessons
- **Simplified video uploading** with progress indicators
- **Video URL alternative** for external video sources
- **Video preview** with thumbnail and metadata
- **Direct lessons** that can be attached to weeks without sections

## Implementation Details

The new `SimpleCurriculum` component maintains the same data structure and API as the original `CourseCurriculum` component, ensuring backward compatibility while providing a much better user experience.

### Key Differences

| Feature | Old CourseCurriculum | New SimpleCurriculum |
|---------|---------------------|----------------------|
| UI Complexity | Complex, overwhelming | Simple, intuitive |
| Editing Experience | Multiple nested forms | Inline editing |
| Visual Guidance | Minimal | Color-coded, visual cues |
| Mobile Experience | Poor | Fully responsive |
| Learning Curve | Steep | Gentle, guided |
| User Feedback | Minimal | Immediate visual feedback |
| Video Uploading | Complex, multi-step | Simple, one-step process |
| Direct Lessons | Hidden in UI | Clear, dedicated section |

## Video Upload Features

The simplified curriculum builder includes an easy-to-use video upload system:

1. **Upload Methods**:
   - Direct file upload with automatic processing
   - External video URL input for YouTube, Vimeo, etc.

2. **Upload Process**:
   - File validation (type and size)
   - Progress tracking with visual indicators
   - Automatic metadata extraction (duration, thumbnail)
   - Error handling with clear messages

3. **Video Preview**:
   - Thumbnail display
   - Duration information
   - File size information
   - Quick view link

## Direct Lessons

Direct lessons are lessons attached directly to a week rather than nested within a section:

1. **When to Use**:
   - For standalone content that doesn't belong in a specific section
   - For introductory or summary material for the week
   
2. **Features**:
   - Same capabilities as section lessons (video, quiz, assignment)
   - Same editing and preview options
   - Drag and drop reordering

3. **Organization**:
   - Clear visual separation from sectioned content
   - Easy to add, edit, and manage

## Usage

The component is a drop-in replacement for the old `CourseCurriculum` component:

```tsx
import SimpleCurriculum from '@/components/course/steps/SimpleCurriculum';

// Then in your component:
<SimpleCurriculum
  register={register}
  setValue={setValue}
  formState={formState}
  watch={watch}
/>
```

## Future Improvements

- Add animated transitions for a more polished feel
- Implement a "preview" mode to see how the curriculum will look to students
- Add templates for common curriculum structures that can be applied with one click
- Implement a progress tracker to show completion status of curriculum building
- Add batch upload capability for multiple videos 