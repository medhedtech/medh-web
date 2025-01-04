import ProtectedPage from "@/app/protectedRoutes";
import Coorporate_Employee_Profile_Detalis from "@/components/sections/sub-section/dashboards/CoorporateEmployeeDetails";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Corporate Employee Profile | Medh",
  description: "Corporate Employee Profile | Medh - Education",
};
const Coorporate_Employee_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <Coorporate_Employee_Profile_Detalis />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Employee_Profile;
