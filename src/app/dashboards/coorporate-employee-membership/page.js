

import StudentMembership from "@/components/layout/main/dashboards/studentMembership";
import ProtectedPage from "@/app/protectedRoutes";
import CorporateEmpMembership from "@/components/layout/main/dashboards/CorporateEmpMembership";
export const metadata = {
  title: "Student Message | Medh - Education",
  description: "Student Message | Medh - Education",
};
const Corporate_Emp_Membership = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CorporateEmpMembership />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Emp_Membership;
