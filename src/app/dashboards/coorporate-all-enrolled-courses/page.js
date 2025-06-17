import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEnroll_Courses from "@/components/layout/main/dashboards/CoorporateEnroll_Courses";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Coorporate_Enrolled_courses_01 = () => {
  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <CoorporateEnroll_Courses />
        
      
    </ProtectedPage>
  );
};

export default Coorporate_Enrolled_courses_01;
