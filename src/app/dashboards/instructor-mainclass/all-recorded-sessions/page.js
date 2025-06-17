import ProtectedPage from "@/app/protectedRoutes";
import Instructor_Recorded_Sessions from "@/components/layout/main/dashboards/Instructor_recorded_sessions";


import React from "react";

const All_Recorded_Classes = () => {
  return (
    <ProtectedPage>
      <main>
        
          <Instructor_Recorded_Sessions />
        
        
      </main>
    </ProtectedPage>
  );
};

export default All_Recorded_Classes;
