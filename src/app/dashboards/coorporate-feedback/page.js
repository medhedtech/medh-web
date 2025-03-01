import ProtectedPage from "@/app/protectedRoutes";
import CoorporateFeedbackPage from "@/components/layout/main/dashboards/Coorporate-Feedback";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";


import React from "react";

const Coorporate_Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoorporateFeedbackPage />
          
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Feedback;
