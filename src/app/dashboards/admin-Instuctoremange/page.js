import ProtectedPage from "@/app/protectedRoutes";
import InstructoreManage from "@/components/layout/main/dashboards/InstructoreManage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
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
          <div className="px-6">
            <HeadingDashboard />
          </div>
          <InstructoreManage />
        </DashboardContainer>
        {/* </DsahboardWrapper> */}
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Admin_Reviews;
