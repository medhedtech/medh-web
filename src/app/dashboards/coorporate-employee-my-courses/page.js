import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEmployeeEnrollCourses from "@/components/layout/main/dashboards/Coorporate_employee_Enroll_Course";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import React from "react";

const Coorporate_Employee_My_Courses = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoorporateEmployeeEnrollCourses />
        </DashboardContainer>
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Employee_My_Courses;
