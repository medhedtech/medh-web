import ProtectedPage from "@/app/protectedRoutes";
import InstructorMessageMain from "@/components/layout/main/dashboards/InstructorMessageMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Message | Medh - Education LMS Template",
  description: "Instructor Message | Medh - Education LMS Template",
};
const Instructor_Message = () => {
  return (
    <ProtectedPage>
      <main>
        
          <InstructorMessageMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Message;
