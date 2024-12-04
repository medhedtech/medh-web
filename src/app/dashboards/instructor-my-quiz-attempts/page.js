import InstructorMyQuizAttemptsMain from "@/components/layout/main/dashboards/InstructorMyQuizAttemptsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor My Quiz Attempts | Edurock - Education LMS Template",
  description: "Instructor My Quiz Attempts | Edurock - Education LMS Template",
};
const Instructor_My_Quiz_Attempts = () => {
  return (
    <main>
      <DashboardContainer>
        <InstructorMyQuizAttemptsMain />
      </DashboardContainer>

      <ThemeController />
    </main>
  );
};

export default Instructor_My_Quiz_Attempts;
