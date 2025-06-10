import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const MembershipDashboard = dynamic(
  () => import('@/components/sections/dashboards/MembershipDashboard'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'My Membership | Student Dashboard',
  description: 'Manage your membership subscription and benefits on Medh platform.',
  keywords: ['membership', 'subscription', 'dashboard', 'student', 'benefits']
};

export default function MembershipPage() {
  return <MembershipDashboard />;
} 