import ProtectedPage from "@/app/protectedRoutes";
import StudentNewCourses from "@/components/layout/main/dashboards/Student-Enroll-New-Course";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Student_Enroll_New_Courses = () => {
  return (
    <ProtectedPage>
      
        <HeadingDashboard />
        <StudentNewCourses />
        
      
    </ProtectedPage>
  );
};

export default Student_Enroll_New_Courses;
