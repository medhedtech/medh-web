import ProtectedPage from "@/app/protectedRoutes";
import ViewAssignments from "@/components/layout/main/dashboards/Instructor-View-Assignments";


export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Assignments = () => {
  return (
    <ProtectedPage>
      <main>
        
          <ViewAssignments />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_View_Assignments;
