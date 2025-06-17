import ProtectedPage from "@/app/protectedRoutes";
import CorporateFreeCourses from "@/components/layout/main/dashboards/CorporateFreeCourses";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Corporate_Free_Courses = () => {
  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <CorporateFreeCourses />
        
      
    </ProtectedPage>
  );
};

export default Corporate_Free_Courses;
