import ProtectedPage from "@/app/protectedRoutes";
import StudentReviewsMain from "@/components/layout/main/dashboards/StudentReviewsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
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
          <DashboardWrapper>
            
              <StudentReviewsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Reviews;
