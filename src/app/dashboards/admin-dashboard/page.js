import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};
const Admin_Dashboard = () => {
  return (
    <main>
      <DashboardContainer>
        <AdminDashboardMain />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Admin_Dashboard;
