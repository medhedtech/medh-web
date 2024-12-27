"use client";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import CoorporateFeedbackAndSupport from "./Coorporate_Feeback_Support";

const CoorporateFeedbackPage = () => {
  return (
    <div>
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <CoorporateFeedbackAndSupport />
    </div>
  );
};

export default CoorporateFeedbackPage;
