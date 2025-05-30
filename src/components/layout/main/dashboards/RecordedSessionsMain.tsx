"use client";

import React from "react";
import RecordedSessions from "@/components/shared/dashboards/RecordedSessions";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

/**
 * RecordedSessionsMain - Component that wraps RecordedSessions with header
 */
const RecordedSessionsMain: React.FC = () => {
  return (
    <div>
      <RecordedSessions />
    </div>
  );
};

export default RecordedSessionsMain; 