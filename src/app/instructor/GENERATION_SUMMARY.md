# Instructor Dashboard Pages Generation Summary

Generated on: 2025-06-24T18:50:45.881Z

## Statistics
- **Total Routes Found**: 31
- **Pages Generated**: 31
- **Pages Skipped**: 0

## Generated Pages
- `/app/instructor/demo-classes/page.tsx`
- `/app/instructor/demo-requests/page.tsx`
- `/app/instructor/demo-presentations/page.tsx`
- `/app/instructor/demo-live/page.tsx`
- `/app/instructor/demo-feedback/page.tsx`
- `/app/instructor/demo-recordings/page.tsx`
- `/app/instructor/assigned-courses/page.tsx`
- `/app/instructor/class-schedules/page.tsx`
- `/app/instructor/live-presentations/page.tsx`
- `/app/instructor/live-classes/page.tsx`
- `/app/instructor/live-recordings/page.tsx`
- `/app/instructor/student-lists/page.tsx`
- `/app/instructor/student-progress/page.tsx`
- `/app/instructor/student-communication/page.tsx`
- `/app/instructor/upload-materials/page.tsx`
- `/app/instructor/lesson-plans/page.tsx`
- `/app/instructor/resource-visibility/page.tsx`
- `/app/instructor/create-assessments/page.tsx`
- `/app/instructor/submitted-work/page.tsx`
- `/app/instructor/assessment-feedback/page.tsx`
- `/app/instructor/performance-reports/page.tsx`
- `/app/instructor/mark-attendance/page.tsx`
- `/app/instructor/attendance-reports/page.tsx`
- `/app/instructor/receivables/page.tsx`
- `/app/instructor/demo-revenue/page.tsx`
- `/app/instructor/live-revenue/page.tsx`
- `/app/instructor/class-reports/page.tsx`
- `/app/instructor/engagement-reports/page.tsx`
- `/app/instructor/learning-outcomes/page.tsx`
- `/app/instructor/settings/page.tsx`
- `/app/instructor/profile/page.tsx`

## Skipped Pages (Already Exist)


## Next Steps
1. Review generated pages and implement specific functionality
2. Update API method calls with proper parameters
3. Implement proper TypeScript interfaces
4. Add proper error handling and loading states
5. Implement responsive design patterns
6. Add proper authentication and authorization checks

## API Methods Used
- `demo-classes`: `getDemoClasses`
- `demo-requests`: `updateDemoStatus`
- `demo-presentations`: `getDemoClasses`
- `demo-live`: `getDemoClasses`
- `demo-feedback`: `getDemoFeedbackStats`
- `demo-recordings`: `getDemoClasses`
- `assigned-courses`: `getAssignedBatches`
- `class-schedules`: `getAssignedBatches`
- `live-presentations`: `getAssignedBatches`
- `live-classes`: `getAssignedBatches`
- `live-recordings`: `getAssignedBatches`
- `student-lists`: `getStudentsByBatch`
- `student-progress`: `getStudentProgress`
- `student-communication`: `getStudentsByBatch`
- `upload-materials`: `uploadCourseMaterial`
- `lesson-plans`: `createVideoLesson`
- `resource-visibility`: `getAssignedBatches`
- `create-assessments`: `createAssignment`
- `submitted-work`: `getAssignmentSubmissions`
- `assessment-feedback`: `gradeSubmission`
- `performance-reports`: `getAttendanceAnalytics`
- `mark-attendance`: `markAttendance`
- `attendance-reports`: `getAttendanceAnalytics`
- `receivables`: `getInstructorRevenue`
- `demo-revenue`: `getInstructorRevenue`
- `live-revenue`: `getInstructorRevenue`
- `class-reports`: `getAttendanceAnalytics`
- `engagement-reports`: `getAttendanceAnalytics`
- `learning-outcomes`: `getAttendanceAnalytics`
- `settings`: `getInstructorProfile`
- `profile`: `getInstructorProfile`
