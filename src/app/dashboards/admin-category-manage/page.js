import ProtectedPage from "@/app/protectedRoutes";
import CategoriesManage from "@/components/layout/main/dashboards/CateogiresManage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Admin Categories",
  description: "Admin Categories",
};
const Admin_Categories = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <CategoriesManage />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Admin_Categories;
