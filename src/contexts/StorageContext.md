# Medh Storage Context Documentation

This document outlines how to use the `StorageContext` in the Medh application for managing user data, course progress, and application preferences.

## Overview

The `StorageContext` provides a centralized way to manage application state that needs to be persisted. It handles:

- User authentication data
- Course enrollment information
- Course and lesson progress tracking
- User preferences
- Secure storage with encryption for sensitive data

## Setup

The `StorageProvider` is already included in the application's main `Providers` component, making storage functionality available throughout the application.

## Basic Usage

### Accessing the Storage Context

To use the storage context in any component:

```jsx
import { useStorage } from "@/contexts/StorageContext";

function MyComponent() {
  const storage = useStorage();
  
  // Now you can use the storage methods
  // ...
}
```

## Authentication Methods

### Login

```jsx
storage.login({
  token: "jwt-token",
  userId: "user-id",
  email: "user@example.com",
  role: "student",
  fullName: "User Name",
  permissions: ["view_courses", "enroll"],
  rememberMe: true
});
```

### Checking Authentication

```jsx
// Check if user is logged in
const isLoggedIn = storage.isAuthenticated();

// Get current user data
const userData = storage.getCurrentUser();

// Check permissions
const canEnroll = storage.hasPermission("enroll_course");

// Check role
const isInstructor = storage.hasRole("instructor");
```

### Logout

```jsx
storage.logout();
```

## Course Management

### Enrolled Courses

```jsx
// Get all enrolled courses
const courses = storage.getEnrolledCourses();

// Add a new enrolled course
storage.addEnrolledCourse({
  id: "course-id",
  title: "Course Title",
  enrolledAt: new Date().toISOString()
});

// Remove a course
storage.removeEnrolledCourse("course-id");

// Track last viewed course
storage.trackLastViewedCourse("course-id");
```

### Course Progress

```jsx
// Get progress for a specific course
const progress = storage.getCourseProgress("course-id");

// Update course progress
storage.updateCourseProgress("course-id", {
  totalLessons: 10,
  completedLessons: 5,
  lastUpdated: new Date().toISOString()
});
```

### Lesson Progress

```jsx
// Get lesson progress
const lessonProgress = storage.getLessonProgress("lesson-id");

// Update lesson progress
storage.updateLessonProgress(
  "lesson-id", 
  "course-id", 
  75, // progress percentage
  120 // current time in seconds
);

// Mark lesson as complete
storage.completeLessonAndUpdateProgress(
  "lesson-id", 
  "course-id", 
  25 // total lessons in course
);
```

## Preferences

```jsx
// Set a preference
storage.setPreference("darkMode", true);

// Get a preference with default fallback
const isDarkMode = storage.getPreference("darkMode", false);
```

## Synchronization

To synchronize local data with server:

```jsx
// Sync enrolled courses with server data
storage.syncCoursesWithServer(serverCourses);
```

## Best Practices

1. **Security First**: Use the storage context for sensitive user data as it handles encryption automatically.

2. **Batch Updates**: When making multiple updates, group them together to minimize storage writes.

3. **Error Handling**: Always wrap storage calls in try/catch blocks in critical flows.

4. **Sync with Server**: Always synchronize local data with server data when possible to ensure data consistency.

5. **Performance**: Consider the impact of storage operations in performance-critical components.

## Storage Keys 

For consistency, use the predefined storage keys available through the context:

```jsx
// Example of using a predefined key
const isRemembered = storage.getPreference(storage.STORAGE_KEYS.REMEMBER_ME, false);
```

## Technical Details

The storage context uses:

- localStorage for persistent data
- sessionStorage for session-specific data
- Secure encryption for sensitive information using CryptoJS
- Fallback mechanisms for cross-browser compatibility
- TypeScript for type safety 