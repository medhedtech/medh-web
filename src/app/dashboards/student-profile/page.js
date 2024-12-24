import ProtectedPage from "@/app/protectedRoutes";
import StudentProfileMain from "@/components/layout/main/dashboards/StudentProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
export const metadata = {
  title: "Student Profile | Medh - Education",
  description: "Student Profile | Medh - Education",
};
const Student_Profile = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-4">
            <HeadingDashboard />
          </div>
          <StudentProfileMain />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Student_Profile;
