import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamic import for StudentGoalsDashboard component
const StudentGoalsDashboard = dynamic(() => import('@/components/sections/dashboards/StudentGoalsDashboard'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading study goals...</p>
      </div>
    </div>
  ),
});

// SEO Metadata
export const metadata: Metadata = {
  title: 'Study Goals | Student Dashboard - Medh',
  description: 'Set, track, and manage your study goals. Monitor your progress, set deadlines, and achieve your learning objectives with personalized goal tracking.',
  keywords: [
    'study goals',
    'learning objectives',
    'goal tracking',
    'student dashboard',
    'progress tracking',
    'study planning',
    'academic goals',
    'medh goals',
    'online learning'
  ],
  openGraph: {
    title: 'Study Goals | Student Dashboard - Medh',
    description: 'Set, track, and manage your study goals. Monitor your progress, set deadlines, and achieve your learning objectives.',
    type: 'website',
    url: '/dashboards/student/goals',
    images: [
      {
        url: '/images/student-goals-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Medh Student Goals Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Goals | Student Dashboard - Medh',
    description: 'Set, track, and manage your study goals. Monitor your progress, set deadlines, and achieve your learning objectives.',
    images: ['/images/student-goals-og.jpg'],
  },
  alternates: {
    canonical: '/dashboards/student/goals',
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

// Student Goals Page Component
const StudentGoalsPage = () => {
  return <StudentGoalsDashboard />;
};

export default StudentGoalsPage; 