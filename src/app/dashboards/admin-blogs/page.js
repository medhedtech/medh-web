import ProtectedPage from "@/app/protectedRoutes";
import AdminBlogs from "@/components/layout/main/dashboards/AdminBlogs";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Blogs",
  description: "Blogs",
};
const Admin_Blogs = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <AdminBlogs />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Blogs;
