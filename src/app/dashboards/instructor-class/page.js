import ProtectedPage from "@/app/protectedRoutes";
import DemoClasses from "@/components/layout/main/dashboards/DemoClasses";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Demo Class",
  description: "Demo Class",
};
const Demo_Class = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <DemoClasses />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Demo_Class;
