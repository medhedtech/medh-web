import ProtectedPage from "@/app/protectedRoutes";
import AdminJobAplicants from "@/components/layout/main/dashboards/AdminJobApplicants";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Job Applicants",
  description: "Job Applicants",
};
const Admin_Job_Aplicants = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <AdminJobAplicants />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Job_Aplicants;
