import ProtectedPage from "@/app/protectedRoutes";
import InstructorSettingsMain from "@/components/layout/main/dashboards/InstructorSettingsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Setting | Medh - Education LMS Template",
  description: "Instructor Setting | Medh - Education LMS Template",
};
const Instructor_Setting = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <InstructorSettingsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Setting;
