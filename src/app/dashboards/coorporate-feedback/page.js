import ProtectedPage from "@/app/protectedRoutes";
import CoorporateFeedbackPage from "@/components/layout/main/dashboards/Coorporate-Feedback";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Coorporate_Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoorporateFeedbackPage />
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Feedback;
