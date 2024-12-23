import ProtectedPage from "@/app/protectedRoutes";
import CategoriesManage from "@/components/layout/main/dashboards/CateogiresManage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Categories",
  description: "Admin Categories",
};
const Admin_Categories = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-6">
            <HeadingDashboard />
          </div>
          <CategoriesManage />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Categories;
