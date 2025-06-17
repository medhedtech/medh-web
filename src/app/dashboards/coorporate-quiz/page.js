import ProtectedPage from "@/app/protectedRoutes";
import CorporateQuizDashboard from "@/components/layout/main/dashboards/CorporateQuizDashboard";


import React from "react";

const StudentQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CorporateQuizDashboard />
          
        
      </main>
    </ProtectedPage>
  );
};

export default StudentQuizes;
