import ProtectedPage from "@/app/protectedRoutes";
import FeedbackPage from "@/components/layout/main/dashboards/FeedbackPage";



import React from "react";

const Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        
          <FeedbackPage />
          
        
      </main>
    </ProtectedPage>
  );
};

export default Feedback;
