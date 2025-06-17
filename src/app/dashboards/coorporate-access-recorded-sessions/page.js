

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ProtectedPage from "@/app/protectedRoutes";
import CoorporateRecordedSessions_Access from "@/components/layout/main/dashboards/Coorporate-Access-Recorded-Sessions";

export const metadata = {
  title: "Student Enrolled Courses | Medh - Education LMS Template",
  description: "Student Enrolled Courses | Medh - Education LMS Template",
};

const Coorporate_Access_Recorded_Sessions = () => {
  return (
    <ProtectedPage>
      <main>
        
          <HeadingDashboard />
          <CoorporateRecordedSessions_Access />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Access_Recorded_Sessions;
