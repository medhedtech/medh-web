import ProtectedPage from "@/app/protectedRoutes";
import StudentMyQuizAttemptsMain from "@/components/layout/main/dashboards/StudentMyQuizAttemptsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student My Quiz Attempts | Medh - Education LMS Template",
  description: "Student My Quiz Attempts | Medh - Education LMS Template",
};
const Student_My_Quiz_Attempts = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <StudentMyQuizAttemptsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_My_Quiz_Attempts;
