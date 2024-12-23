import ProtectedPage from "@/app/protectedRoutes";
import ListOfCourse from "@/components/layout/main/dashboards/ListOfCourse";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Admin Reviews | Medh - Education LMS Template",
  description: "Admin Reviews | Medh - Education LMS Template",
};
const Admin_Reviews = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-12">
            <HeadingDashboard />
          </div>
          <ListOfCourse />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
