"use client";
import React, { useState } from "react";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";
import SearchDetails from "./SearchDetails";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";
import CoorporateCounterStudent from "@/components/sections/sub-section/dashboards/CounterCoorporateStudent";

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
          <CoorporateCounterStudent />
          <ProgressOverview />
          <UpcomigClasses />
        </>
      )}
    </>
  );
};

export default CoEmpDashboardMain;
