import EnrollmentFormsAdmin from "@/components/layout/main/dashboards/AdminEnrollent-Form";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Enrollments",
  description: "Enrollments",
};
const Admin_Form_Enrollments = () => {
  return (
    <main>
      <DashboardContainer>
        <div className="px-6">
          <HeadingDashboard />
        </div>
        <EnrollmentFormsAdmin />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Admin_Form_Enrollments;
