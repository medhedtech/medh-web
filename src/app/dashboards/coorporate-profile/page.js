import ProtectedPage from "@/app/protectedRoutes";
import CoorporateProfile_Main from "@/components/layout/main/dashboards/Coorporate-Profile-Main";

import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";


export const metadata = {
  title: "Corporate Profile | Medh",
  description: "Corporate Profile | Medh - Education",
};
const Coorporate_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <CoorporateProfile_Main />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Profile;
