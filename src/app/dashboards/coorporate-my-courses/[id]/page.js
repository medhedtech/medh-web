import React from "react";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ProtectedPage from "@/app/protectedRoutes";
import CoorporateCourseDetails from "@/components/layout/main/dashboards/Coorporate-Course-Details";

const CoorporateCourseDetailsPage = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <CoorporateCourseDetails />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default CoorporateCourseDetailsPage;
