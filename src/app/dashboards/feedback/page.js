import ProtectedPage from "@/app/protectedRoutes";
import FeedbackPage from "@/components/layout/main/dashboards/FeedbackPage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <FeedbackPage />
          <ThemeController />
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default Feedback;
