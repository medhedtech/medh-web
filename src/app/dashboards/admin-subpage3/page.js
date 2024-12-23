import Zeta from "@/components/layout/main/dashboards/Zeta";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboard />
          </div>
          <Zeta />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
