import { Metadata } from "next";
import ProtectedPage from "@/app/protectedRoutes";
import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <AdminDashboardMain />
        </DashboardContainer>
        <ThemeController />
      </div>
    </ProtectedPage>
  );
};
export default AdminDashboard;