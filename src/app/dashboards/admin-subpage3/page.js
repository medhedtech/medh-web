import Zeta from "@/components/layout/main/dashboards/Zeta";


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
        
          <div>
            <HeadingDashboard />
          </div>
          <Zeta />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
