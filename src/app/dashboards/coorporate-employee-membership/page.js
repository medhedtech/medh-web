import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import StudentMembership from "@/components/layout/main/dashboards/studentMembership";
import ProtectedPage from "@/app/protectedRoutes";
import CorporateEmpMembership from "@/components/layout/main/dashboards/CorporateEmpMembership";
export const metadata = {
  title: "Student Message | Medh - Education",
  description: "Student Message | Medh - Education",
};
const Corporate_Emp_Membership = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CorporateEmpMembership />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Emp_Membership;
