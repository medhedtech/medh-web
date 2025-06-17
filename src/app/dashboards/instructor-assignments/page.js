import ProtectedPage from "@/app/protectedRoutes";
import InstructorAssignmentsMain from "@/components/layout/main/dashboards/InstructorAssignmentsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Assignments | Medh - Education LMS Template",
  description: "Instructor Assignments | Medh - Education LMS Template",
};
const Instructor_Assignments = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <InstructorAssignmentsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Instructor_Assignments;
