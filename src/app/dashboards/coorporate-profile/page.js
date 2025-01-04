import ProtectedPage from "@/app/protectedRoutes";
import CoorporateProfile_Main from "@/components/layout/main/dashboards/Coorporate-Profile-Main";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Corporate Profile | Medh",
  description: "Corporate Profile | Medh - Education",
};
const Coorporate_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <CoorporateProfile_Main />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Profile;
