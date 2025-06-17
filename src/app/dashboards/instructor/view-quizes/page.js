import ProtectedPage from "@/app/protectedRoutes";
import ViewQuizes from "@/components/layout/main/dashboards/Instructor-View-Quiz";


export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Quizes = () => {
  return (
    <ProtectedPage>
      <main>
        
          <ViewQuizes />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_View_Quizes;
