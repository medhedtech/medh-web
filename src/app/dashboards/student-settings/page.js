import ProtectedPage from "@/app/protectedRoutes";
import StudentSettingsMain from "@/components/layout/main/dashboards/StudentSettingsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Settings | Medh - Education",
  description: "Student Settings | Medh - Education",
};
const Student_Settings = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            <DashboardContainer>
              <StudentSettingsMain />
            </DashboardContainer>
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Settings;
