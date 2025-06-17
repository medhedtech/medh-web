import ProtectedPage from "@/app/protectedRoutes";
import InstructoreManage from "@/components/layout/main/dashboards/InstructorManage";

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
          <InstructoreManage />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
