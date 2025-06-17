import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Tracking_component from "@/components/layout/main/dashboards/Instructor_Track";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const InstructorTrack = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <Instructor_Tracking_component />
        
        
      </main>
    </ProtectedPage>
  );
};

export default InstructorTrack;
