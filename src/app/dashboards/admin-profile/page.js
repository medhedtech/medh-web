import ProtectedPage from "@/app/protectedRoutes";
import AdminProfileMain from "@/components/layout/main/dashboards/AdminProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";


export const metadata = {
  title: "Admin Profile | Medh - Education LMS Template",
  description: "Admin Profile | Medh - Education LMS Template",
};
const Admin_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <AdminProfileMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Profile;
