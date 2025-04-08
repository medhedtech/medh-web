import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React, { Suspense, lazy } from "react";

const AssignedDemoClass = lazy(() => import("./AssignedDemoClass"));
const LiveDemoClass = lazy(() => import("./LiveDemoClass"));
const RecordedSession = lazy(() => import("./RecordedSessions"));

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
          <RecordedSession />
        </Suspense>
      </div>
    </div>
  );
};

export default DemoClasses;
