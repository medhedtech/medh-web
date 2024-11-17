import AdminBlogs from "@/components/layout/main/dashboards/AdminBlogs";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Blogs",
  description: "Blogs",
};
const Admin_Blogs = () => {
  return (
    <main>
      <DashboardContainer>
        <HeadingDashboard />
        <AdminBlogs />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Admin_Blogs;
