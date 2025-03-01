import ProtectedPage from "@/app/protectedRoutes";
import GetInTouch from "@/components/layout/main/dashboards/AdminGetInTouch";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Get In Touch",
  description: "Get In Touch",
};
const Admin_Contacts = () => {
  return (
    <ProtectedPage>
    <main>
      <DashboardContainer>
        <div className="px-6">
          <HeadingDashboard />
        </div>
        <GetInTouch />
      </DashboardContainer>
      
    </main>
    </ProtectedPage>
  );
};

export default Admin_Contacts;
