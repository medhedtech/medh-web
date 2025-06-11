import ProtectedPage from "@/app/protectedRoutes";
import InstructorAnnoucementsMain from "@/components/layout/main/dashboards/InstructorAnnoucementsMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";


export const metadata = {
  title: "Instructor Announcements | Medh - Education LMS Template",
  description: "Instructor Announcements | Medh - Education LMS Template",
};

const Instructor_Announcements = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <InstructorAnnoucementsMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Announcements;
