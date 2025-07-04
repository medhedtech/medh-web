import { Suspense } from 'react';
import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Import Admin2Dashboard component
const Admin2Dashboard = dynamic(
  () => import("@/components/sections/dashboards/Admin2Dashboard"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Advanced Admin Dashboard | Medh",
  description: "Enhanced admin dashboard with advanced analytics, performance metrics, and comprehensive management tools.",
  keywords: "advanced admin dashboard, analytics, performance metrics, course management, student management, instructor management, medh admin",
  openGraph: {
    title: "Advanced Admin Dashboard | Medh",
    description: "Enhanced admin dashboard with advanced analytics, performance metrics, and comprehensive management tools.",
    type: "website",
  },
};

export default function Admin2DashboardPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <Admin2Dashboard />
    </Suspense>
  );
} 