import ProtectedPage from "@/app/protectedRoutes";
import AssignInst from "@/components/layout/main/dashboards/AssignInst";
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
        {/* <DsahboardWrapper> */}
        <DashboardContainer>
          <div className="px-10">
            <HeadingDashboard />
          </div>

          <AssignInst />
        </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
