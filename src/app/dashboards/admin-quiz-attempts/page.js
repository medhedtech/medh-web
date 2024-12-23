import ProtectedPage from "@/app/protectedRoutes";
import AdminQuizAttemptsMain from "@/components/layout/main/dashboards/AdminQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Quiz Attempts | Medh - Education LMS Template",
  description: "Admin Quiz Attempts | Medh - Education LMS Template",
};
const Admin_Quiz_Attempts = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <AdminQuizAttemptsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Quiz_Attempts;
