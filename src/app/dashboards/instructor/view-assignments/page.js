import ProtectedPage from "@/app/protectedRoutes";
import ViewAssignments from "@/components/layout/main/dashboards/Instructor-View-Assignments";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Assignments = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <ViewAssignments />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_View_Assignments;
