import ProtectedPage from "@/app/protectedRoutes";
import EnrollmentFormsAdmin from "@/components/layout/main/dashboards/AdminEnrollent-Form";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Enrollments",
  description: "Enrollments",
};
const Admin_Form_Enrollments = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <EnrollmentFormsAdmin />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Form_Enrollments;
