import ProtectedPage from "@/app/protectedRoutes";
import AllInstructorMainClass from "@/components/layout/main/dashboards/All-Main-Classes";


import React from "react";

const AllMainClasses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <AllInstructorMainClass />
        
        
      </main>
    </ProtectedPage>
  );
};

export default AllMainClasses;
