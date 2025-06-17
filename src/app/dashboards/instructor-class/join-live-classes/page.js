import ProtectedPage from "@/app/protectedRoutes";
import Live_Demo_Classess_instructor from "@/components/layout/main/dashboards/Access_Live_Classess_Instructor";


import React from "react";

const Access_Live_Classes = () => {
  return (
    <ProtectedPage>
      <main>
        
          <Live_Demo_Classess_instructor />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Access_Live_Classes;
