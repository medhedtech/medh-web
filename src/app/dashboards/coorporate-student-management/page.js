import ProtectedPage from "@/app/protectedRoutes";
import CoorporateTableStudent from "@/components/layout/main/dashboards/CoorporateStudentManagement";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Coorporate_Student_Management = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <CoorporateTableStudent />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Student_Management;
