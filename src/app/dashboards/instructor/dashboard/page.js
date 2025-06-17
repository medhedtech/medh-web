import ProtectedPage from "@/app/protectedRoutes";
import InstructorDashbordMain from "@/components/layout/main/dashboards/InstructorDashbordMain";


export const metadata = {
  title: "Instructor Dashboard | Medh - Education LMS Template",
  description: "Instructor Dashboard | Medh - Education LMS Template",
};
const Instructor_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        
          <InstructorDashbordMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Dashboard;
