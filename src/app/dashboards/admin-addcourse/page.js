import ProtectedPage from "@/app/protectedRoutes";
import AddCourse from "@/components/layout/main/dashboards/AddCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Reviews",
  description: "Admin Reviews",
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

          <AddCourse />
        </DashboardContainer>
        {/* </DashboardWrapper> */}
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
