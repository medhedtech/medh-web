import ProtectedPage from "@/app/protectedRoutes";
import StudentManagement from "@/components/layout/main/dashboards/StudentManagement";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <StudentManagement />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
