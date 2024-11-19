import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

export const metadata = {
  title: "Student Enrolled Courses | Edurock - Education LMS Template",
  description: "Student Enrolled Courses | Edurock - Education LMS Template",
};

const Student_Enrolled_Courses = () => {
  return (
    <main>
      <DashboardContainer>
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <StudentEnrolledCoursesMain />
      </DashboardContainer>
      <ThemeController />
    </main>
  );
};

export default Student_Enrolled_Courses;
