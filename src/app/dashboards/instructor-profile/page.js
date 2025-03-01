import ProtectedPage from "@/app/protectedRoutes";
import InstructorProfileMain from "@/components/layout/main/dashboards/InstructorProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

export const metadata = {
  title: "Instructor Profile | Medh - Education LMS Template",
  description: "Instructor Profile | Medh - Education LMS Template",
};
const Instructor_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboardOnly />
          </div>
          <InstructorProfileMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Profile;
