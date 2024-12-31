"use client";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import CoorporateFeedbackAndSupport from "./Coorporate_Feeback_Support";
import CoorporateEmpFeedbackAndSupport from "./Corporate_Emp_Feedback_Support";

const CoorporateEmpFeedbackPage = () => {
  return (
    <div>
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <CoorporateEmpFeedbackAndSupport />
    </div>
  );
};

export default CoorporateEmpFeedbackPage;
