import ProtectedPage from "@/app/protectedRoutes";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ComingSoonPage from "@/components/shared/others/ComingSoonPage";

import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          {/* Previous implementation:
          <StudentQuizedashboard />
          */}
          
          <ComingSoonPage 
            title="Quiz Feature Coming Soon" 
            description="Our interactive quiz feature is currently under development. Get ready for a fun learning experience with adaptive quizzes tailored to your courses!"
            returnPath="/dashboards/student"
          />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
