import ProtectedPage from "@/app/protectedRoutes";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <StudentQuizedashboard />
          
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
