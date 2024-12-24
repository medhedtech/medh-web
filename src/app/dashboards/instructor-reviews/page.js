import ProtectedPage from "@/app/protectedRoutes";
import InstructorReviewsMain from "@/components/layout/main/dashboards/InstructorReviewsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
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
          <DsahboardWrapper>
            <DashboardContainer>
              <InstructorReviewsMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Reviews;
