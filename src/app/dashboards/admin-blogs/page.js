import ProtectedPage from "@/app/protectedRoutes";
import AdminBlogs from "@/components/layout/main/dashboards/AdminBlogs";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Blogs",
  description: "Blogs",
};
const Admin_Blogs = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <AdminBlogs />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Blogs;
