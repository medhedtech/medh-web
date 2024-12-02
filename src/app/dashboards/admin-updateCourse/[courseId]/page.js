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
    // <PageWrapper>
    <main>
      {/* <DsahboardWrapper> */}
      <DashboardContainer>
        <div className="px-4">
          <HeadingDashboard />
        </div>

        <UpdateCourse />
      </DashboardContainer>
      {/* </DsahboardWrapper> */}
      <ThemeController />
    </main>
    // </PageWrapper>
  );
};

export default Admin_Update_Course;
