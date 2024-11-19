"use client";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import FeedbackandSupport from "./FeedbackandSupport";

const FeedbackPage = () => {
  return (
    <div>
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <FeedbackandSupport />
    </div>
  );
};

export default FeedbackPage;
