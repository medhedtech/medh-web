import CorporateEnrolledCoursesMain from "@/components/layout/main/dashboards/CorporateEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";

export const metadata = {
  title: "Corporate Enrolled Courses | Medh - Education LMS Template",
  description: "Corporate Enrolled Courses | Medh - Education LMS Template",
};

const Corporate_Enrolled_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <CorporateEnrolledCoursesMain />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Corporate_Enrolled_Courses;
