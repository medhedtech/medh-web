import React from "react";
import CourseDetails from "@/components/layout/main/dashboards/CourseDetails";

import ProtectedPage from "@/app/protectedRoutes";

const CourseDetailsPage = () => {
  return (
    <ProtectedPage>
      
        <CourseDetails />
      
    </ProtectedPage>
  );
};

export default CourseDetailsPage;
