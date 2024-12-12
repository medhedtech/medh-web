import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import MyMainClass from "./MyMainClass";
import RecordedClass from "./RecordedClass";
import UpComingClass from "./UpComingClass";

const MainClass = () => {
  return (
    <div className="px-4">
      <div className="px-10">
      <HeadingDashboard />
      </div>
      <MyMainClass />
      <UpComingClass />
      {/* <RecordedClass /> */}
    </div>
  );
};

export default MainClass;
