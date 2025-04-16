import ProtectedPage from "@/app/protectedRoutes";
import AssignInst from "@/components/layout/main/dashboards/AssignInst";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        {/* <DashboardWrapper> */}
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <AssignInst />
        </DashboardContainer>
        {/* </DashboardWrapper> */}
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
