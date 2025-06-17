import ProtectedPage from "@/app/protectedRoutes";
import CoorporateNewCourses from "@/components/layout/main/dashboards/Coorporate-Enroll-New-Courses";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Coorporate_Enroll_New_Courses = () => {
  return (
    <ProtectedPage>
      
        <div className="px-8">
        <HeadingDashboard />
        </div>
        <CoorporateNewCourses />
        
      
    </ProtectedPage>
  );
};

export default Coorporate_Enroll_New_Courses;
