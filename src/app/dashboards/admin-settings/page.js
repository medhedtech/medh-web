import AdminSettingsMain from "@/components/layout/main/dashboards/AdminSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Settings | Edurock - Education LMS Template",
  description: "Admin Settings | Edurock - Education LMS Template",
};
const Admin_Settings = () => {
  return (
    <main>
      <DashboardContainer>
        <AdminSettingsMain />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Admin_Settings;
