import ProtectedPage from "@/app/protectedRoutes";
import InstructorOrderHistoryMain from "@/components/layout/main/dashboards/InstructorOrderHistoryMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Order History | Medh - Education LMS Template",
  description: "Instructor Order History | Medh - Education LMS Template",
};
const Instructor_Order_History = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            <DashboardContainer>
              <InstructorOrderHistoryMain />
            </DashboardContainer>
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Order_History;
