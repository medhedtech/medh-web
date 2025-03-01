import ProtectedPage from "@/app/protectedRoutes";
import StudentReviewsMain from "@/components/layout/main/dashboards/StudentReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Reviews | Medh - Education LMS Template",
  description: "Student Reviews | Medh - Education LMS Template",
};
const Student_Reviews = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <StudentReviewsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Reviews;
