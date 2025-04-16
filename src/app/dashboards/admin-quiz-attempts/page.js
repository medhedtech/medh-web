import ProtectedPage from "@/app/protectedRoutes";
import AdminQuizAttemptsMain from "@/components/layout/main/dashboards/AdminQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
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
          <DashboardWrapper>
            <DashboardContainer>
              <AdminQuizAttemptsMain />
            </DashboardContainer>
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Quiz_Attempts;
