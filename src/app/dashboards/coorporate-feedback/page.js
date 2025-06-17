import ProtectedPage from "@/app/protectedRoutes";
import CoorporateFeedbackPage from "@/components/layout/main/dashboards/Coorporate-Feedback";



import React from "react";

const Coorporate_Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        
          <CoorporateFeedbackPage />
          
        
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Feedback;
