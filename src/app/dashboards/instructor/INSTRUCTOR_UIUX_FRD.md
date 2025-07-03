# Instructor Dashboard – UI/UX-Driven Functional Requirements Document (FRD)

---

## 1. Design Vision & Principles

- **Empower instructors:** Make every action discoverable, every insight actionable, and every workflow frictionless.
- **Reduce cognitive load:** Group related tasks, use progressive disclosure, and surface only what matters most at each step.
- **Delight through clarity:** Use modern, minimal UI with clear hierarchy, micro-interactions, and positive feedback.
- **Mobile-first, always:** Every screen, every interaction, every touch target is designed for mobile and scales up.
- **Accessible for all:** Color, contrast, keyboard navigation, and ARIA are non-negotiable.

---

## 2. User Journey Mapping

### A. First Impression (Dashboard Home)
- **Emotion:** “I feel in control and welcomed.”
- **UI:** Personalized greeting, avatar, today's agenda, urgent actions (e.g., "Grade 2 assignments"), and a single clear CTA ("Start Next Class").
- **Design:** Glassmorphism header, stat cards, and a "What's New" section for updates.
- **API:** `getInstructorById`, `getInstructorBatches`, `getPendingActions`

---

### B. Managing Courses & Classes
- **Emotion:** "I can find and manage my courses in seconds."
- **UI:** 
  - **Assigned Courses:** Responsive grid/list, filter/search, status badges, quick links to students/schedule.
  - **Class Schedules:** Calendar/list toggle, color-coded by type/status, "Add Session" floating action button.
- **Design:** Shadcn Card, Table, and Calendar components, sticky action bar on mobile.
- **API:** `getInstructorBatches`, `getClassSessions`

---

### C. Handling Demo Classes
- **Emotion:** "I never miss a demo request and can act instantly."
- **UI:** 
  - **Demo Requests:** Card stack with swipe/accept/reject, student info, and scheduled time.
  - **Demo Classes/Presentations/Recordings:** Timeline view, status chips, join/playback buttons.
- **Design:** Shadcn Card, Badge, Avatar, and Timeline components, animated transitions for status changes.
- **API:** `getAssignedDemoClasses`, `updateDemoStatus`

---

### D. Student Engagement
- **Emotion:** "I know who needs help and can reach out easily."
- **UI:** 
  - **Student Lists:** Table with avatars, progress bars, status filters.
  - **Student Progress:** Drill-down modal with attendance, grades, feedback history.
  - **Communication:** Inline message composer, quick templates, and read receipts.
- **Design:** Shadcn Table, Progress, Modal, and Message components, sticky "Contact" button.
- **API:** `getStudentLists`, `getStudentProgress`, `sendMessageToStudent`

---

### E. Assignments & Feedback
- **Emotion:** "Grading and feedback are fast, fair, and transparent."
- **UI:** 
  - **Create Assessments:** Stepper form, autosave drafts, preview mode.
  - **Submitted Work:** List with file previews, status chips, bulk actions.
  - **Assessment Feedback:** Side-by-side submission and feedback form, instant save, feedback templates.
  - **Grading:** Kanban for status (pending/graded/late), quick grade entry.
- **Design:** Shadcn Form, Stepper, Table, and Kanban components, toast feedback for actions.
- **API:** `createAssignment`, `getAssignmentSubmissions`, `gradeSubmission`

---

### F. Analytics & Insights
- **Emotion:** "I see trends, not just numbers. I know where to focus."
- **UI:** 
  - **Overview:** Stat cards, sparkline trends, "AI Insight" callouts.
  - **Attendance/Class/Engagement/Performance Reports:** Filterable charts, export buttons, "Top 3" and "Needs Attention" lists.
  - **Learning Outcomes:** Progress rings, mastery breakdown, actionable next steps.
- **Design:** Shadcn Stat, Chart, and List components, export menu, tooltips for all metrics.
- **API:** `getAttendanceAnalytics`, `getBatchAnalytics`, `getEngagementReports`, `getPerformanceReports`, `getLearningOutcomes`

---

### G. Lesson Planning
- **Emotion:** "Planning is organized, collaborative, and reusable."
- **UI:** 
  - List of plans, drag-and-drop reordering, quick edit modal, share/copy template.
- **Design:** Shadcn List, Modal, and Drag-and-Drop components.
- **API:** `getLessonPlans`, `saveLessonPlan`, `deleteLessonPlan`

---

### H. Profile & Settings
- **Emotion:** "My profile is professional and my preferences respected."
- **UI:** 
  - Profile card, avatar upload, editable fields, notification/language/theme toggles.
- **Design:** Shadcn Form, Avatar, Switch, and Card components, real-time validation.
- **API:** `getInstructorById`, `updateInstructor`

---

### I. Revenue & Receivables
- **Emotion:** "I know what I've earned and what's pending."
- **UI:** 
  - Stat cards (total, pending, paid), payout history table, filter by period/status, export.
- **Design:** Shadcn Stat, Table, and Badge components, sticky export bar.
- **API:** `getDemoRevenueMetrics`, `getBatchRevenueMetrics`, `getInstructorPayouts`

---

## 3. Micro-Interactions & Feedback
- **Loading:** Skeletons for all data, shimmer on cards/tables.
- **Success:** Toasts for all actions, confetti for major milestones (e.g., "All assignments graded!").
- **Error:** Inline error banners, retry buttons, and contextual help links.
- **Empty States:** Custom illustrations, "What to do next" guidance, and quick action buttons.

---

## 4. Navigation & Information Architecture
- **Sidebar:** Collapsible, icons + labels, highlights current section.
- **Topbar:** Profile, notifications, quick search.
- **Mobile:** Bottom nav for most-used actions, floating action button for "Add"/"Create".

---

## 5. Accessibility & Responsiveness
- **Touch targets:** ≥44px, focus rings, ARIA labels.
- **Contrast:** All text/buttons meet 4.5:1 minimum.
- **Keyboard:** All actions and navigation are keyboard-accessible.
- **Breakpoints:** 360px (mobile) → 768px (tablet) → 1024px (desktop) → 1440px+ (ultrawide).

---

## 6. API/Data Handling
- **All data via `@/apis/instructor.ts`**
- **SWR/React Query for caching, optimistic updates for actions**
- **Graceful fallback for network errors and empty data**

---

## 7. Design System & Component Patterns
- **Shadcn UI** for all primitives (Card, Table, Form, Modal, Badge, Avatar, Stat, Progress, Switch, Stepper, Kanban, Timeline, Chart)
- **Tailwind** for layout, spacing, and custom tokens
- **Your design system utilities** for glassmorphism, responsive grids, and semantic colors

---

## 8. Documentation & Handoff
- **Storybook** for all custom components
- **README** in each feature folder with usage, props, and design rationale
- **Figma** (if available) for wireframes/mockups

---

## 9. Prioritization & Next Steps
1. **Validate this UI/UX FRD with stakeholders**
2. **Wireframe key flows (Dashboard, Courses, Assignments, Analytics)**
3. **Implement page-by-page, starting with highest impact**
4. **Test on real devices, gather feedback, iterate**

---

**This document is the master reference for building the full instructor dashboard experience.** 