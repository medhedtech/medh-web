"use client";

import React from "react";
import LiveClasses from "./LiveClasses";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

/**
 * LiveClassesMain - Component that wraps LiveClasses with header
 */
const LiveClassesMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="px-6">
        <HeadingDashboard />
      </div>
      <LiveClasses />
    </div>
  );
};

export default LiveClassesMain; 