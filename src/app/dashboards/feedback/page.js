import FeedbackandSupport from "@/components/layout/main/dashboards/FeedbackandSupport";
import FeedbackPage from "@/components/layout/main/dashboards/FeedbackPage";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Feedback = () => {
  return (
    <div>
      <main>
        <DashboardContainer>
          <FeedbackPage />

          <ThemeController />
        </DashboardContainer>
      </main>
    </div>
  );
};

export default Feedback;
