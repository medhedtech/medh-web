import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";

export const metadata = {
  title: "Student Enrolled Courses | Medh - Education LMS Template",
  description: "Student Enrolled Courses | Medh - Education LMS Template",
};

const Student_Enrolled_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <StudentEnrolledCoursesMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Student_Enrolled_Courses;
