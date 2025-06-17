import ProtectedPage from "@/app/protectedRoutes";
import CoorporateAdminTable from "@/components/layout/main/dashboards/CoorporateAdmin_Table";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Coorporate Admin Management | Medh - Education",
  description: "Coorporate Admin Management | Medh - Education",
};
const Admin_Coorporate_Management = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <CoorporateAdminTable />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Coorporate_Management;
