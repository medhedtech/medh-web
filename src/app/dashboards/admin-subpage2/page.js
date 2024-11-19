import Omega from "@/components/layout/main/dashboards/Omega";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Reviews | Edurock - Education LMS Template",
  description: "Admin Reviews | Edurock - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    // <PageWrapper>
    <main>
      {/* <DsahboardWrapper> */}
      <DashboardContainer>
        <div className="px-8">
          <HeadingDashboard />
        </div>
        <Omega />
      </DashboardContainer>
      {/* </DsahboardWrapper> */}
      <ThemeController />
    </main>
    // </PageWrapper>
  );
};

export default Admin_Reviews;
