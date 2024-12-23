import ProtectedPage from "@/app/protectedRoutes";
import AdminMessageMain from "@/components/layout/main/dashboards/AdminMessageMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Message | Medh - Education LMS Template",
  description: "Admin Message | Medh - Education LMS Template",
};
const Admin_Message = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DsahboardWrapper>
            <DashboardContainer>
              <AdminMessageMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Message;
