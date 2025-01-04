import React from "react";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ProtectedPage from "@/app/protectedRoutes";
import CoorporateEmployeeCourseDetails from "@/components/layout/main/dashboards/Coorporate_Employee_Course_Details";

const CoorporateEmployeeCourseDetailsPage = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <CoorporateEmployeeCourseDetails />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default CoorporateEmployeeCourseDetailsPage;
