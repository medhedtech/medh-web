import ProtectedPage from "@/app/protectedRoutes";
import EnrollmentFormsAdmin from "@/components/layout/main/dashboards/AdminEnrollent-Form";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Enrollments",
  description: "Enrollments",
};
const Admin_Form_Enrollments = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <EnrollmentFormsAdmin />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Form_Enrollments;
