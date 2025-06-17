import ProtectedPage from "@/app/protectedRoutes";
import AssignedAllDemoClasses from "@/components/layout/main/dashboards/AssignedAllDemoClasses";


import React from "react";

const AssignedDemoClasses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <AssignedAllDemoClasses />
        
        
      </main>
    </ProtectedPage>
  );
};

export default AssignedDemoClasses;
