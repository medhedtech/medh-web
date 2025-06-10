import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for FreeCourses component
const FreeCourses = dynamic(() => import('@/components/sections/courses/FreeCourses'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading free courses...</p>
      </div>
    </div>
  ),
});

// SEO Metadata
export const metadata: Metadata = {
  title: 'Free Courses | Medh - Start Learning Today',
  description: 'Explore our collection of high-quality free courses. Start your learning journey with expert instructors and comprehensive content. No cost, no commitment.',
  keywords: [
    'free courses',
    'online learning',
    'education',
    'skill development',
    'professional development',
    'medh courses',
    'free education',
    'online training'
  ],
  openGraph: {
    title: 'Free Courses | Medh',
    description: 'Start your learning journey with our collection of high-quality free courses. Expert instructors, comprehensive content, no cost.',
    type: 'website',
    url: '/courses/free',
    images: [
      {
        url: '/images/free-courses-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Medh Free Courses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Courses | Medh',
    description: 'Start your learning journey with our collection of high-quality free courses.',
    images: ['/images/free-courses-og.jpg'],
  },
  alternates: {
    canonical: '/courses/free',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Free Courses Page Component
const FreeCoursesPage = () => {
  return <FreeCourses />;
};

export default FreeCoursesPage; 