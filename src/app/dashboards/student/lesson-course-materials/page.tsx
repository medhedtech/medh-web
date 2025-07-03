'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamically import the dashboard component
const LessonCourseMaterialsDashboard = dynamic(
  () => import('@/components/sections/dashboards/LessonCourseMaterialsDashboard'),
  {
    loading: () => <LoadingSpinner size="lg" />,
    ssr: false // Disable SSR for this component since it uses browser APIs
  }
);

export default function LessonCourseMaterialsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" fullScreen />}>
      <LessonCourseMaterialsDashboard />
    </Suspense>
  );
} 