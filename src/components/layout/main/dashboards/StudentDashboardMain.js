"use client";
import React, { useState } from "react";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";
import CourseDetails from "./CourseDetails";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import SearchDetails from "./SearchDetails";
import FreeClasses from "@/components/shared/dashboards/FreeClasses";

const StudentDashboardMain = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <HeadingDashboard setIsFocused={setIsFocused} />
      {isFocused ? (
        <SearchDetails />
      ) : (
        <>
          <CounterStudent />
          <ProgressOverview />
          <UpcomigClasses />
          <FreeClasses />
        </>
      )}
    </>
  );
};

export default StudentDashboardMain;
