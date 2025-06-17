import React from "react";

import ProtectedPage from "@/app/protectedRoutes";
import CoorporateCourseDetails from "@/components/layout/main/dashboards/Coorporate-Course-Details";

const CoorporateCourseDetailsPage = () => {
  return (
    <ProtectedPage>
      
        <CoorporateCourseDetails />
      
    </ProtectedPage>
  );
};

export default CoorporateCourseDetailsPage;
