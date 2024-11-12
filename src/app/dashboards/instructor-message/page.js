import InstructorMessageMain from "@/components/layout/main/dashboards/InstructorMessageMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Message | Edurock - Education LMS Template",
  description: "Instructor Message | Edurock - Education LMS Template",
};
const Instructor_Message = () => {
  return (
    <main>
      <DashboardContainer>
        <InstructorMessageMain />
      </DashboardContainer>

      <ThemeController />
    </main>
  );
};

export default Instructor_Message;
