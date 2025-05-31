"use client";

import React from "react";
import RecordedSessions from "@/components/shared/dashboards/RecordedSessions";

/**
 * RecordedSessionsMain - Component that wraps RecordedSessions with header
 */
const RecordedSessionsMain: React.FC = () => {
  return (
    <div className="space-y-6">
      <RecordedSessions />
    </div>
  );
};

export default RecordedSessionsMain; 