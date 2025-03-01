import ProtectedPage from "@/app/protectedRoutes";
import CoorporateAdminTable from "@/components/layout/main/dashboards/CoorporateAdmin_Table";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Coorporate Admin Management | Medh - Education",
  description: "Coorporate Admin Management | Medh - Education",
};
const Admin_Coorporate_Management = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <CoorporateAdminTable />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Coorporate_Management;
