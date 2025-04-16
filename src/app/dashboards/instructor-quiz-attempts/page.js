import ProtectedPage from "@/app/protectedRoutes";
import InstructorQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Quiz Attempts | Medh - Education LMS Template",
  description: "Instructor Quiz Attempts | Medh - Education LMS Template",
};
const Instructor_Quiz_Attempts = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            <DashboardContainer>
              <InstructorQuizAttemptsMain />
            </DashboardContainer>
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Quiz_Attempts;
