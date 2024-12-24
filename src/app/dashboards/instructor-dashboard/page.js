import ProtectedPage from "@/app/protectedRoutes";
import InstructorDashbordMain from "@/components/layout/main/dashboards/InstructorDashbordMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Instructor Dashboard | Medh - Education LMS Template",
  description: "Instructor Dashboard | Medh - Education LMS Template",
};
const Instructor_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <InstructorDashbordMain />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Dashboard;
