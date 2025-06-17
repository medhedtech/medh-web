import React from "react";

import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEmployeeCourseDetails from "@/components/layout/main/dashboards/Coorporate_Employee_Course_Details";

const CoorporateEmployeeCourseDetailsPage = () => {
  return (
    <ProtectedPage>
      
        <CoorporateEmployeeCourseDetails />
      
    </ProtectedPage>
  );
};

export default CoorporateEmployeeCourseDetailsPage;
