import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";


import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";
import CorporateEnrolledCoursesMain from "@/components/layout/main/dashboards/CorporateEnrolledCoursesMain";

export const metadata = {
  title: "Corporate Enrolled Courses | Medh - Education LMS Template",
  description: "Corporate Enrolled Courses | Medh - Education LMS Template",
};

const Corporate_Emp_Enrolled_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <CorporateEnrolledCoursesMain />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Emp_Enrolled_Courses;
