import InstructorFeedbackComponents from "@/components/layout/main/dashboards/Instructor-Feedback-Components";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const InstructorFeedback = () => {
  <main>
    <DashboardContainer>
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <InstructorFeedbackComponents />
    </DashboardContainer>
    <ThemeController />
  </main>
};

export default InstructorFeedback;
