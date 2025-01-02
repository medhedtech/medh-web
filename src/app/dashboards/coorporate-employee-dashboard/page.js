import ProtectedPage from "@/app/protectedRoutes";
import CoEmpDashboardMain from "@/components/layout/main/dashboards/CoEmpDashboardMain";
import StudentDashboardMain from "@/components/layout/main/dashboards/StudentDashboardMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Student Dashboard | Medh - Education LMS Template",
  description: "Student Dashboard | Medh - Education LMS Template",
};
const Corporate_Employee_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoEmpDashboardMain />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Employee_Dashboard;
