import ProtectedPage from "@/app/protectedRoutes";
import AdminMessageMain from "@/components/layout/main/dashboards/AdminMessageMain";



import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
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
          <DashboardWrapper>
            
              <AdminMessageMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Message;
