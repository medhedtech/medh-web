import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React, { Suspense } from "react";
import AssignedDemoClass from "./AssignedDemoClass";
import LiveDemoClass from "./LiveDemoClass";
import RecordedSessions from "./RecordedSessions";

const LoadingFallback = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
);

const DemoClasses = () => {
  return (
    <div className="px-4">
      <HeadingDashboard />
      <div className="bg-white rounded-lg dark:bg-inherit dark:border shadow-md space-y-4">
        <Suspense fallback={<LoadingFallback />}>
          <AssignedDemoClass />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <LiveDemoClass />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <RecordedSessions />
        </Suspense>
      </div>
    </div>
  );
};

export default DemoClasses;
