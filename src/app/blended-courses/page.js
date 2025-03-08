// Server component (no "use client" directive)
import BlendedCoursesClient from '@/components/pages/BlendedCoursesClient';
import PageWrapper from "@/components/layout/wrappers/PageWrapper";

// Metadata can be exported from server components
export const metadata = {
  title: "Blended Learning Courses | The Perfect Balance of Self-paced and Live Learning",
  description: "Discover our blended learning courses that combine the flexibility of self-paced learning with the guidance of live instructor sessions for an optimal learning experience.",
  keywords: "blended learning, hybrid courses, self-paced learning, instructor-led, online education, flexible courses"
};

// This is a server component
export default function BlendedCoursesPage() {
  return (
    <PageWrapper>
      {/* Client component boundary */}
      <BlendedCoursesClient />
    </PageWrapper>
  );
} 