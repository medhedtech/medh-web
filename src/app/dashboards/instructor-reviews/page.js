import ProtectedPage from "@/app/protectedRoutes";
import InstructorReviewsMain from "@/components/layout/main/dashboards/InstructorReviewsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Reviews | Medh - Education LMS Template",
  description: "Instructor Reviews | Medh - Education LMS Template",
};
const Instructor_Reviews = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <InstructorReviewsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Reviews;
