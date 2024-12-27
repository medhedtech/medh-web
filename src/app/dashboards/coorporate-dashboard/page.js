import ProtectedPage from "@/app/protectedRoutes";
import CorporateDashboardMain from "@/components/layout/main/dashboards/CorporateDashboardMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Corporate Dashboard | Medh - Education LMS Template",
  description: "Corporate Dashboard | Medh - Education LMS Template",
};
const Corporate_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CorporateDashboardMain />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Dashboard;
