import ProtectedPage from "@/app/protectedRoutes";
import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Student Profile | Medh - Education",
  description: "Student Profile | Medh - Education",
};
const Student_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <StudentProfileMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Student_Profile;
