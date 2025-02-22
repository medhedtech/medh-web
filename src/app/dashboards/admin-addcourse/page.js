import ProtectedPage from "@/app/protectedRoutes";
import AddCourse from "@/components/layout/main/dashboards/AddCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Reviews",
  description: "Admin Reviews",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        {/* <DsahboardWrapper> */}
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>

          <AddCourse />
        </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
