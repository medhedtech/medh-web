import React from "react";
import CourseDetails from "@/components/layout/main/dashboards/CourseDetails";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ProtectedPage from "@/app/protectedRoutes";

const CoorporateCourseDetailsPage = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <CourseDetails />
      </DashboardContainer>
    </ProtectedPage>
  );
};

export default CoorporateCourseDetailsPage;
