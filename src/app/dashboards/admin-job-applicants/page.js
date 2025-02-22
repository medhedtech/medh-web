import ProtectedPage from "@/app/protectedRoutes";
import AdminJobAplicants from "@/components/layout/main/dashboards/AdminJobApplicants";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Job Applicants",
  description: "Job Applicants",
};
const Admin_Job_Aplicants = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <AdminJobAplicants />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Job_Aplicants;
