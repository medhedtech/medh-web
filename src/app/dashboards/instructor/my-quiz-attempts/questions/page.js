import ProtectedPage from "@/app/protectedRoutes";
import QuizQuestionsDetails from "@/components/sections/sub-section/dashboards/View-Questions";

import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

import React from "react";

const page = () => {
  return (
    <ProtectedPage>
      
        <div className="px-8">
          <HeadingDashboard />
        </div>
        <QuizQuestionsDetails />
      
      
    </ProtectedPage>
  );
};

export default page;
