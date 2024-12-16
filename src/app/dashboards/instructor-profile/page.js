import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import InstructorProfileMain from "@/components/layout/main/dashboards/InstructorProfileMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Profile | Medh - Education LMS Template",
  description: "Instructor Profile | Medh - Education LMS Template",
};
const Instructor_Profile = () => {
  return (
    <main>
      <DashboardContainer>
      <div className="px-4">
          <HeadingDashboardOnly />
        </div>
        <InstructorProfileMain />
      </DashboardContainer>

      <ThemeController />
    </main>
  );
};

export default Instructor_Profile;
