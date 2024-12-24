import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import StudentMembership from "@/components/layout/main/dashboards/studentMembership";
import ProtectedPage from "@/app/protectedRoutes";
export const metadata = {
  title: "Student Message | Medh - Education",
  description: "Student Message | Medh - Education",
};
const Student_Membership = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <StudentMembership />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Student_Membership;
