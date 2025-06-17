import ProtectedPage from "@/app/protectedRoutes";
import CorporateEmpQuizDashboard from "@/components/layout/main/dashboards/CorporateEmpQuizDashboard";
import CorporateQuizDashboard from "@/components/layout/main/dashboards/CorporateQuizDashboard";
import StudentQuizedashboard from "@/components/layout/main/dashboards/StudentQuizedashboard";


import React from "react";

const CorporateEmpQuizes = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CorporateEmpQuizDashboard />
          
        
      </main>
    </ProtectedPage>
  );
};

export default CorporateEmpQuizes;
