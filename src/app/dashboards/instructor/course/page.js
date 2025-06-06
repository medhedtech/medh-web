import ProtectedPage from "@/app/protectedRoutes";
import InstructorCourseMain from "@/components/layout/main/dashboards/InstructorCourseMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Course | Medh - Education LMS Template",
  description: "Instructor Course | Medh - Education LMS Template",
};
const Instructor_Course = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            <DashboardContainer>
              <InstructorCourseMain />
            </DashboardContainer>
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Course;
