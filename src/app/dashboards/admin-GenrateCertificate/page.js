import GenrateCertificate from "@/components/layout/main/dashboards/GenrateCertificate";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import Previewdetail from "@/components/layout/main/dashboards/Previewdetail";
import ProtectedPage from "@/app/protectedRoutes";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    // <PageWrapper>
    <ProtectedPage>
      <main>
        {/* <DsahboardWrapper> */}
        <DashboardContainer>
          <div className="px-6">
            <HeadingDashboard />
          </div>
          {/* <Previewdetail /> */}
          <GenrateCertificate />
        </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </ProtectedPage>
    // </PageWrapper>
  );
};

export default Admin_Reviews;
