import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import MyMainClass from "./MyMainClass";
import UpComingClass from "./UpComingClass";
import LiveDemoClass from "./LiveDemoClass";

const MainClass = () => {
  return (
    <div className="px-4">
      <div className="px-10">
        <HeadingDashboard />
      </div>
      <MyMainClass /> 
      <LiveDemoClass />
      <UpComingClass />
    </div>
  );
};

export default MainClass;
