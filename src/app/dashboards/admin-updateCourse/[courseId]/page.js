import ProtectedPage from "@/app/protectedRoutes";
import UpdateCourse from "@/components/layout/main/dashboards/UpdateCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Update Course",
  description: "Admin Update Course",
};
const Admin_Update_Course = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <UpdateCourse />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Update_Course;
