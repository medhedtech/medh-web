import ProtectedPage from "@/app/protectedRoutes";
import CorporateUpcomigClasses from "@/components/layout/main/dashboards/CorporateUpcomingClasses";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Upcoming_Classes = () => {
  return (
    <ProtectedPage>
      
        <div className="px-12">
          <HeadingDashboard />
        </div>
        <CorporateUpcomigClasses />
        
      
    </ProtectedPage>
  );
};

export default Student_Upcoming_Classes;
