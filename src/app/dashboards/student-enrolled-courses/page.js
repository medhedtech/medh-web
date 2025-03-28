import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Enrolled Courses | Medh - Education LMS Template",
  description: "Student Enrolled Courses | Medh - Education LMS Template",
};

const Student_Enrolled_Courses = () => {
  return (
    <PageWrapper>
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="py-12">
          <StudentEnrolledCoursesMain />
          </div>
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
    </PageWrapper>
  );
};

export default Student_Enrolled_Courses;
