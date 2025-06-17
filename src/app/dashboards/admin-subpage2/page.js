import ProtectedPage from "@/app/protectedRoutes";
import Omega from "@/components/layout/main/dashboards/Omega";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <Omega />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
