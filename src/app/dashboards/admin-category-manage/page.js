import ProtectedPage from "@/app/protectedRoutes";
import CategoriesManage from "@/components/layout/main/dashboards/CateogiresManage";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Categories",
  description: "Admin Categories",
};
const Admin_Categories = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <CategoriesManage />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Categories;
