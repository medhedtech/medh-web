import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "All Courses | MEDH - Comprehensive Learning Platform",
  description: "Explore our comprehensive range of courses including AI & Data Science, Personality Development, Vedic Mathematics, and Digital Marketing. Find the perfect course to enhance your skills and accelerate your career growth.",
  keywords: [
    "online courses",
    "AI courses",
    "data science",
    "personality development",
    "vedic mathematics",
    "digital marketing",
    "skill development",
    "professional training",
    "MEDH courses"
  ],
  openGraph: {
    title: "All Courses | MEDH",
    description: "Discover courses designed to enhance your skills and accelerate your career growth",
    type: "website",
    siteName: "MEDH",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Courses | MEDH",
    description: "Explore our comprehensive range of courses for skill development and career growth",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 