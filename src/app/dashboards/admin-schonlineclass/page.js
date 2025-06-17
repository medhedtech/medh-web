import ProtectedPage from "@/app/protectedRoutes";
import OnlineClass from "@/components/layout/main/dashboards/OnlineClass";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div className="px-4">
            <HeadingDashboard />
          </div>

          <OnlineClass />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
