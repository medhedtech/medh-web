import ProtectedPage from "@/app/protectedRoutes";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";

import ComingSoonPage from "@/components/shared/others/ComingSoonPage";

import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        
          {/* Previous implementation:
          <StudentQuizedashboard />
          */}
          
          <ComingSoonPage 
            title="Quiz Feature Coming Soon" 
            description="Our interactive quiz feature is currently under development. Get ready for a fun learning experience with adaptive quizzes tailored to your courses!"
            returnPath="/dashboards/student"
          />
        
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
