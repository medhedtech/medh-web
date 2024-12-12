import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import AssignedDemoClass from "./AssignedDemoClass";
import LiveDemoClass from "./LiveDemoClass";
import RecordedSession from "./RecordedSession";

const DemoClasses = () => {
  return (
    <div className="px-4">
      <HeadingDashboard />
      <div className="bg-white rounded-lg dark:bg-inherit dark:border shadow-md">
        <AssignedDemoClass />
        <LiveDemoClass />
        {/* <RecordedSession /> */}
      </div>
    </div>
  );
};

export default DemoClasses;
