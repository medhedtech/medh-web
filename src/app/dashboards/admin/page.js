import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";
import Loading from "@/app/loading";
import dynamic from 'next/dynamic';

// Import AdminDashboard component
const AdminDashboard = dynamic(
  () => import("@/components/sections/dashboards/AdminDashboard"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

export const metadata = {
  title: "Admin Dashboard | Medh",
  description: "Comprehensive admin dashboard for managing courses, students, instructors, and more.",
  keywords: "admin dashboard, course management, student management, instructor management, medh admin",
  openGraph: {
    title: "Admin Dashboard | Medh",
    description: "Comprehensive admin dashboard for managing courses, students, instructors, and more.",
    type: "website",
  },
};

export default function AdminDashboardPage() {
  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Suspense fallback={<Loading/>}>
          <AdminDashboard />
        </Suspense>
      </div>
    </ProtectedPage>
  );
}