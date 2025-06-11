import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for StudentResourcesDashboard component
const StudentResourcesDashboard = dynamic(() => import('@/components/sections/dashboards/StudentResourcesDashboard'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading learning resources...</p>
      </div>
    </div>
  ),
});

// SEO Metadata
export const metadata: Metadata = {
  title: 'Learning Resources | Student Dashboard - Medh',
  description: 'Access your learning resources including PDFs, videos, code samples, and study materials. Organize and bookmark your favorite resources for easy access.',
  keywords: [
    'learning resources',
    'study materials',
    'student dashboard',
    'educational content',
    'course materials',
    'PDFs',
    'video tutorials',
    'medh resources',
    'online learning'
  ],
  openGraph: {
    title: 'Learning Resources | Student Dashboard - Medh',
    description: 'Access your learning resources including PDFs, videos, code samples, and study materials.',
    type: 'website',
    url: '/dashboards/student/resources',
    images: [
      {
        url: '/images/student-resources-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Medh Student Learning Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Resources | Student Dashboard - Medh',
    description: 'Access your learning resources including PDFs, videos, code samples, and study materials.',
    images: ['/images/student-resources-og.jpg'],
  },
  alternates: {
    canonical: '/dashboards/student/resources',
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

// Student Resources Page Component
const StudentResourcesPage = () => {
  return <StudentResourcesDashboard />;
};

export default StudentResourcesPage; 