import AdminProfileMain from "@/components/layout/main/dashboards/AdminProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Profile | Medh - Education LMS Template",
  description: "Admin Profile | Medh - Education LMS Template",
};
const Admin_Profile = () => {
  return (
    // <PageWrapper>
    <main>
      {/* <DsahboardWrapper> */}
      <DashboardContainer>
        <div className="px-4">
          <HeadingDashboardOnly />
        </div>
        <AdminProfileMain />
      </DashboardContainer>
      {/* </DsahboardWrapper> */}
      <ThemeController />
    </main>
    // </PageWrapper>
  );
};

export default Admin_Profile;
