import ProtectedPage from "@/app/protectedRoutes";
import ViewQuizes from "@/components/layout/main/dashboards/Instructor-View-Quiz";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Quizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <ViewQuizes />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_View_Quizes;
