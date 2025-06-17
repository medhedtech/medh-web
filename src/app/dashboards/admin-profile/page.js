import ProtectedPage from "@/app/protectedRoutes";
import AdminProfileMain from "@/components/layout/main/dashboards/AdminProfileMain";

import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";


export const metadata = {
  title: "Admin Profile | Medh - Education LMS Template",
  description: "Admin Profile | Medh - Education LMS Template",
};
const Admin_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <AdminProfileMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Profile;
