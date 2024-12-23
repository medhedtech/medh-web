import ProtectedPage from "@/app/protectedRoutes";
import AdminCourseMain from "@/components/layout/main/dashboards/AdminCourseMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
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
          <DsahboardWrapper>
            <DashboardContainer>
              <AdminCourseMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Course;
