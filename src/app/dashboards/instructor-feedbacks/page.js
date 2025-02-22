import ProtectedPage from "@/app/protectedRoutes";
import InstructorFeedbackComponents from "@/components/layout/main/dashboards/Instructor-Feedback-Components";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";

const Instructor_Feedbacks = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <div>
            <HeadingDashboard />
          </div>
          <InstructorFeedbackComponents />
        </DashboardContainer>
        <ThemeController />
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Feedbacks;
