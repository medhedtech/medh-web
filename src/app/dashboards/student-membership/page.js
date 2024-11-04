import StudentMessageMain from "@/components/layout/main/dashboards/StudentMessageMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import StudentMembership from "@/components/layout/main/dashboards/studentMembership";
export const metadata = {
  title: "Student Message | Edurock - Education LMS Template",
  description: "Student Message | Edurock - Education LMS Template",
};
const Student_Message = () => {
  return (
    <PageWrapper>
      <main>
          <DashboardContainer>
            <StudentMembership />
          </DashboardContainer>
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Student_Message;
