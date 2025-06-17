import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEmployeeEnrollCourses from "@/components/layout/main/dashboards/Coorporate_employee_Enroll_Course";


import React from "react";

const Coorporate_Employee_My_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CoorporateEmployeeEnrollCourses />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Employee_My_Courses;
