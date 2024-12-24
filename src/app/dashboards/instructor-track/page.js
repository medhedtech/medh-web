import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Tracking_component from "@/components/layout/main/dashboards/Instructor_Track";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const InstructorTrack = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div className="px-8">
            <HeadingDashboard />
          </div>
          <Instructor_Tracking_component />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default InstructorTrack;
