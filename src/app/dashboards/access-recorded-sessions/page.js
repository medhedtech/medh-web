import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import StudentRecordedSessions from "@/components/layout/main/dashboards/Access-Recorded-Sessions";
import ProtectedPage from "@/app/protectedRoutes";

export const metadata = {
  title: "Student Enrolled Courses | Medh - Education LMS Template",
  description: "Student Enrolled Courses | Medh - Education LMS Template",
};

const Access_Recorded_Sessions = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <HeadingDashboard />
          <StudentRecordedSessions />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Access_Recorded_Sessions;
