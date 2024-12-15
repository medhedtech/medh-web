import ViewQuizes from "@/components/layout/main/dashboards/Instructor-View-Quiz";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Quizes = () => {
  return (
    <main>
      <DashboardContainer>
        <ViewQuizes />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Instructor_View_Quizes;
