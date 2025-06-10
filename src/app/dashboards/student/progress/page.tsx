import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const StudentProgressDashboard = dynamic(
  () => import('@/components/sections/dashboards/StudentProgressDashboard'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'Learning Progress | Student Dashboard',
  description: 'Track your learning journey and course progress on Medh platform.',
  keywords: ['progress', 'learning', 'dashboard', 'student', 'courses', 'tracking']
};

export default function StudentProgressPage() {
  return <StudentProgressDashboard />;
} 