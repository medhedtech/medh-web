import ProtectedPage from "@/app/protectedRoutes";
import CoEmpDashboardMain from "@/components/layout/main/dashboards/CoEmpDashboardMain";
import StudentDashboardMain from "@/components/layout/main/dashboards/StudentDashboardMain";


export const metadata = {
  title: "Student Dashboard | Medh - Education LMS Template",
  description: "Student Dashboard | Medh - Education LMS Template",
};
const Corporate_Employee_Dashboard = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CoEmpDashboardMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Employee_Dashboard;
