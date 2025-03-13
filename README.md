This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Medh Web

The Medh Web platform is a modern EdTech solution built with Next.js, React, Tailwind CSS, and a comprehensive tech stack.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Course Details Integration

The platform now features an integrated course details component (`CourseDetailsPage`) that provides:

- Unified display of course information including about, curriculum, reviews, FAQs, and certificates
- Dynamic tab-based navigation that changes content without requiring page scrolling
- Consistent styling across different sections and course types
- Responsive design with animations and interactive elements

### Implementation Details

The `CourseDetailsPage` component has been integrated into the enrollment flow and uses:

- Tab-based navigation with `CourseNavigation` component
- Dynamic content rendering based on the active tab
- Framer Motion animations for smooth transitions
- Consistent API data handling with appropriate fallbacks

### Usage Examples

To use the integrated course details component:

```jsx
<CourseDetailsPage 
  courseId={selectedCourse?._id} 
  initialActiveSection="about"
/>
```

The component accepts:
- `courseId`: The ID of the course to display
- `initialActiveSection`: The tab to display by default (options: about, curriculum, reviews, faq, certificate)

## Development Guidelines

Please refer to the project documentation for development guidelines, coding standards, and contribution requirements.
