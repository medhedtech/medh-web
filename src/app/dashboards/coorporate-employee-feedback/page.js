import ProtectedPage from "@/app/protectedRoutes";
import CoorporateFeedbackPage from "@/components/layout/main/dashboards/Coorporate-Feedback";
import CoorporateEmpFeedbackPage from "@/components/layout/main/dashboards/Corporate-emp-feedback";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";


import React from "react";

const Coorporate_Emp_Feedback = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardContainer>
          <CoorporateEmpFeedbackPage />
          
        </DashboardContainer>
      </main>
    </ProtectedPage>
  );
};

export default Coorporate_Emp_Feedback;
