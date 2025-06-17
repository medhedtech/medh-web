import ProtectedPage from "@/app/protectedRoutes";
import StudentAssignmentsMain from "@/components/layout/main/dashboards/StudentAssignmentsMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Assignments | Medh - Education LMS Template",
  description: "Student Assignments| Medh - Education LMS Template",
};
const Student_Assignments = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <StudentAssignmentsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Assignments;
