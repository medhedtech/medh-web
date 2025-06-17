

import CorporateMembership from "@/components/layout/main/dashboards/CorporateMembership";
import ProtectedPage from "@/app/protectedRoutes";
export const metadata = {
  title: "Student Message | Medh - Education",
  description: "Student Message | Medh - Education",
};
const Student_Membership = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CorporateMembership />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Student_Membership;
