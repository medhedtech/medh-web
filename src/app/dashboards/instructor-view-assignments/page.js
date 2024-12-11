import ViewAssignments from "@/components/layout/main/dashboards/Instructor-View-Assignments";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Instructor View Assignments | Medh",
  description: "Instructor View Assignments | Medh",
};
const Instructor_View_Assignments = () => {
  return (
    <main>
      <DashboardContainer>
        <ViewAssignments />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Instructor_View_Assignments;
