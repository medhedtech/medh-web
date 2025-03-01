import ProtectedPage from "@/app/protectedRoutes";
import QuizQuestionsDetails from "@/components/sections/sub-section/dashboards/View-Questions";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      <DashboardContainer>
        <div className="px-8">
          <HeadingDashboard />
        </div>
        <QuizQuestionsDetails />
      </DashboardContainer>
      
    </ProtectedPage>
  );
};

export default page;
