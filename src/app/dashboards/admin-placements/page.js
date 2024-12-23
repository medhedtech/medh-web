import ProtectedPage from "@/app/protectedRoutes";
import StudentPlacements from "@/components/layout/main/dashboards/Admin-Placements";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Enrollments",
  description: "Enrollments",
};
const Admin_Placements = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-6">
            <HeadingDashboard />
          </div>
          <StudentPlacements />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Placements;
