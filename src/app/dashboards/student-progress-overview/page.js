import ProtectedPage from "@/app/protectedRoutes";
import StudentProgressOverview from "@/components/layout/main/dashboards/Student-ProgressOverview";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Progress_Overview = () => {
  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <StudentProgressOverview />
        
      
    </ProtectedPage>
  );
};

export default Student_Progress_Overview;
