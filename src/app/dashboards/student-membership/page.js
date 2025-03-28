import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import StudentMembership from "@/components/layout/main/dashboards/studentMembership";
import ProtectedPage from "@/app/protectedRoutes";
import UpComingClass from "@/components/layout/main/dashboards/UpComingClass";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Message | Medh - Education",
  description: "Student Message | Medh - Education",
};
const Student_Membership = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="py-12">
          <ComingSoonPage />
          {/* <StudentMembership /> */}
          </div>
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default Student_Membership;
