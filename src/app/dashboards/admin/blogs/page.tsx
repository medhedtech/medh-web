import ProtectedPage from "@/app/protectedRoutes";
import AdminBlogs from "@/components/layout/main/dashboards/AdminBlogs";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog Management | Admin Dashboard - Medh",
  description: "Manage blog posts for the Medh platform. View, create, edit and delete blog posts to share insights with our learning community.",
  keywords: "blog management, content management, admin dashboard, medh blogs, blog listing",
};

const AdminBlogsPage: React.FC = () => {
  return (
    <ProtectedPage>
      <main className="min-h-screen">
          <AdminBlogs />
      </main>
    </ProtectedPage>
  );
};

export default AdminBlogsPage; 