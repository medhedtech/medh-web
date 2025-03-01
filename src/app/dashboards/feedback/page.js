import ProtectedPage from "@/app/protectedRoutes";
import FeedbackPage from "@/components/layout/main/dashboards/FeedbackPage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";


import React from "react";

const Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <FeedbackPage />
          
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default Feedback;
