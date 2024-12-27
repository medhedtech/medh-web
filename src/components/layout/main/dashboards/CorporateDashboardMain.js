"use client";
import React, { useState } from "react";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import SearchDetails from "./SearchDetails";
import HeadingDashboardOnly from "@/components/shared/headings/HeadingDashbordsOnly";
import UpcomigClassesCorporate from "@/components/shared/dashboards/UpcomingClassesCorporate";
import FreeClassesCorporate from "@/components/shared/dashboards/FreeClassesCorporate";

const CorporateDashboardMain = () => {
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
          <UpcomigClassesCorporate />
          <FreeClassesCorporate />
        </>
      )}
    </>
  );
};

export default CorporateDashboardMain;
