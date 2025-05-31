"use client";

import React from "react";
import LiveClasses from "./LiveClasses";

/**
 * LiveClassesMain - Component that wraps LiveClasses with header
 */
const LiveClassesMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <LiveClasses />
    </div>
  );
};

export default LiveClassesMain; 