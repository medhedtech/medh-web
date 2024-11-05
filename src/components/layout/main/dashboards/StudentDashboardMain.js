"use client";
import React, { useState } from "react";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";
import CourseDetailed from "@/app/course-detailed/page";
import CourseDetails from "./CourseDetails";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import SearchDetails from "./SearchDetails";
import BillDetails from "./BillDetails";

const StudentDashboardMain = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <HeadingDashboard setIsFocused={setIsFocused} isFocused={isFocused} />
      {isFocused ? (
        <SearchDetails />
      ) : (
        <>
          <CounterStudent />
          <ProgressOverview />
          <UpcomigClasses />
        </>
      )}
      {/* <BillDetails /> */}
    </>
  );
};

export default StudentDashboardMain;
