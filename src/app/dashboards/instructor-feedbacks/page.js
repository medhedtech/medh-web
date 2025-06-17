import ProtectedPage from "@/app/protectedRoutes";
import InstructorFeedbackComponents from "@/components/layout/main/dashboards/Instructor-Feedback-Components";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const Instructor_Feedbacks = () => {
  return (
    <ProtectedPage>
      <main>
        
          <div>
            <HeadingDashboard />
          </div>
          <InstructorFeedbackComponents />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Feedbacks;
