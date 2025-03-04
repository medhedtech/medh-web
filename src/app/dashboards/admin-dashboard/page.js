import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedPage from "@/app/protectedRoutes";
import Loading from "@/app/loading";

// Dynamic imports for better code splitting
const AdminDashboardMain = dynamic(
  () => import("@/components/layout/main/dashboards/AdminDashboardMain"),
  { 
    loading: () => <Loading/>,
    ssr: true
  }
);

const DashboardContainer = dynamic(
  () => import("@/components/shared/containers/DashboardContainer"),
  { ssr: true }
);

const HeadingDashboard = dynamic(
  () => import("@/components/shared/headings/HeadingDashboard"),
  { ssr: true }
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

const AdminDashboard = () => {
  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Suspense fallback={<Loading/>}>
          <DashboardContainer>
            <div className="transform transition-transform duration-200 hover:scale-[1.01]">
              <HeadingDashboard />
            </div>
            <AdminDashboardMain />
          </DashboardContainer>
        </Suspense>
      </div>
    </ProtectedPage>
  );
};

// Prevent unnecessary re-renders
export default AdminDashboard;