import ProtectedPage from "@/app/protectedRoutes";
import AdminSettingsMain from "@/components/layout/main/dashboards/AdminSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Settings | Medh - Education LMS Template",
  description: "Admin Settings | Medh - Education LMS Template",
};
const Admin_Settings = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <AdminSettingsMain />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Settings;
