import ProtectedPage from "@/app/protectedRoutes";
import StudentUpcomigClasses from "@/components/layout/main/dashboards/StudentUpcomingClasses";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Upcoming_Classes = () => {
  return (
    <ProtectedPage>
      
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <StudentUpcomigClasses />
        
      
    </ProtectedPage>
  );
};

export default Student_Upcoming_Classes;
