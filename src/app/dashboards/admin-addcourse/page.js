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
    // <PageWrapper>
    <main>
      {/* <DsahboardWrapper> */}
      <DashboardContainer>
        <div className="px-4">
          <HeadingDashboard />
        </div>

        <AddCourse />
      </DashboardContainer>
      {/* </DsahboardWrapper> */}
      <ThemeController />
    </main>
    // </PageWrapper>
  );
};

export default Admin_Reviews;
