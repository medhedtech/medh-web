import ProtectedPage from "@/app/protectedRoutes";
import InstructorMyQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorMyQuizAttemptsMain";


export const metadata = {
  title: "Instructor My Quiz Attempts | Medh - Education LMS Template",
  description: "Instructor My Quiz Attempts | Medh - Education LMS Template",
};
const Instructor_My_Quiz_Attempts = () => {
  return (
    <ProtectedPage>
      <main>
        
          <InstructorMyQuizAttemptsMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_My_Quiz_Attempts;
