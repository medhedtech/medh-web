# Medh Project - Contextual Routes

## Key Component Paths
- **WhyMedh Section**: `/src/components/sections/why-medh/WhyMedh.js`
- **Certified Component**: `/src/components/sections/why-medh/Certified.js`
- **Header Component**: `/src/components/layout/header/Header.js`
- **Navbar Component**: `/src/components/layout/navbar/Navbar.js`
- **Footer Component**: `/src/components/layout/footer/Footer.js`

## Page Routes
- **Home Page**: `/src/app/page.js`
- **About Us**: `/src/app/about-us/page.js`
- **Courses**: `/src/app/courses/page.js`
- **Placement Guaranteed Courses**: `/src/app/placement-guaranteed-courses/page.js`
- **Blog**: `/src/app/blog/page.js`
- **Contact**: `/src/app/contact/page.js`

## Asset Paths
- **Images**: `/src/assets/images/`
- **Icons**: `/src/assets/images/icon/`
- **ISO Certification Images**: `/src/assets/images/iso/`
- **Hero Banner Images**: `/src/assets/images/herobanner/`

## Styling Configuration
- **Tailwind Config**: `/tailwind.config.js`
- **Global CSS**: `/src/app/globals.css`

## Utility Files
- **API Routes**: `/src/apis/`
- **Contexts**: `/src/contexts/`
- **Hooks**: `/src/hooks/`
- **Utils**: `/src/utils/`

## Important Files for Mobile Optimization
- **Layout File**: `/src/app/layout.js` (Contains viewport meta tags)
- **Mobile Menu**: `/src/components/layout/navbar/MobileMenu.js`
- **Responsive Components**: Look for media query breakpoints in Tailwind classes (sm:, md:, lg:, xl:)

## API and Backend
- `src/apis/index.js`: API endpoint definitions and URL construction
- `src/utils/apiUtils.js`: Utility functions for API calls
- `src/contexts/AuthContext.js`: Authentication context

## Course Management
- `src/components/layout/main/dashboards/AddCourse.js`: Course creation form
- `src/components/layout/main/dashboards/UpdateCourse.js`: Course update form
- `src/components/layout/main/dashboards/ListOfCourse.js`: Course listing and management
- `src/components/layout/main/dashboards/CourseHeader.js`: Course header component with metadata
- `src/components/layout/main/dashboards/CourseDetails.js`: Detailed course information

## Course Display
- `src/components/sections/courses/HomeCourseSection.js`: Home page course sections
- `src/components/sections/courses/CourseCard.js`: Course card component
- `src/components/shared/courses/CourseCard.js`: Shared course card component used across the app
- `src/components/sections/course-detailed/courseEducation.js`: Detailed course education information

## Layout Components
- `src/components/layout/header/NavbarRight.js`: Right section of navbar with user actions
- `src/components/layout/main/Home1.js`: Main home page component
- `src/app/home-courses/page.js`: Home courses page

## Utility and Context
- `src/contexts/CurrencyContext.js`: Currency conversion context
- `src/utils/priceUtils.js`: Price formatting and calculation utilities

## Important Models
- `models/course-model.js`: Course data model schema
- `models/enrolled-courses-model.js`: Enrolled courses data model schema

## Pages and Routes
- `/app/home-courses/page.js`: Home courses page
- `/app/course-detailed/[slug]/page.js`: Course detail page
- `/app/dashboard/add-course/page.js`: Add course page
- `/app/dashboard/course-list/page.js`: Course list page 