import GenrateCertificate from "@/components/layout/main/dashboards/GenrateCertificate";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
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
        {/* <DashboardWrapper> */}
        
          <div>
            <HeadingDashboard />
          </div>
          {/* <Previewdetail /> */}
          <GenrateCertificate />
        
        {/* </DashboardWrapper> */}
        
      </main>
    </ProtectedPage>
    // </PageWrapper>
  );
};

export default Admin_Reviews;
