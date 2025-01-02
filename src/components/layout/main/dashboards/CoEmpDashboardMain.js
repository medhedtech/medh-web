"use client";
import React, { useState } from "react";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";
import SearchDetails from "./SearchDetails";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";

const CoEmpDashboardMain = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div className="px-12">
        <HeadingDashboardOnly setIsFocused={setIsFocused} />
      </div>
      {isFocused ? (
        <SearchDetails />
      ) : (
        <>
          <CounterStudent />
          <ProgressOverview />
          <UpcomigClasses />
        </>
      )}
    </>
  );
};

export default CoEmpDashboardMain;
