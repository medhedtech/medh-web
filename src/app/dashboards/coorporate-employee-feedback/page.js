import ProtectedPage from "@/app/protectedRoutes";
import CoorporateFeedbackPage from "@/components/layout/main/dashboards/Coorporate-Feedback";
import CoorporateEmpFeedbackPage from "@/components/layout/main/dashboards/Corporate-emp-feedback";



import React from "react";

const Coorporate_Emp_Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CoorporateEmpFeedbackPage />
          
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Emp_Feedback;
