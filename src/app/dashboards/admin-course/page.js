import ProtectedPage from "@/app/protectedRoutes";
import AdminCourseMain from "@/components/layout/main/dashboards/AdminCourseMain";



import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Course | Medh - Education LMS Template",
  description: "Admin Course | Medh - Education LMS Template",
};
const Admin_Course = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <AdminCourseMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Course;
