import ProtectedPage from "@/app/protectedRoutes";
import CoorporateAdminTable from "@/components/layout/main/dashboards/CoorporateAdmin_Table";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Coorporate Admin Management | Medh - Education",
  description: "Coorporate Admin Management | Medh - Education",
};
const Admin_Coorporate_Management = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-6">
            <HeadingDashboard />
          </div>
          <CoorporateAdminTable />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Coorporate_Management;
