import ProtectedPage from "@/app/protectedRoutes";
import CoorporateStudentProfile_Main from "@/components/layout/main/dashboards/CoorporateStudentProfile_Details";

import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";


export const metadata = {
  title: "Corporate Student Profile | Medh",
  description: "Corporate Profile | Medh - Education",
};
const Coorporate_Student_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <CoorporateStudentProfile_Main />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Student_Profile;
