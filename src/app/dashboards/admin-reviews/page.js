import ProtectedPage from "@/app/protectedRoutes";
import AdminReviewsMain from "@/components/layout/main/dashboards/AdminReviewsMain";



import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <AdminReviewsMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
