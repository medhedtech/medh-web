import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import DemoClasses from "@/components/layout/main/dashboards/DemoClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Demo Class",
  description: "Demo Class",
};
const Demo_Class = () => {
  return (
    <main>
      <DashboardContainer>
        <DemoClasses />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Demo_Class;
