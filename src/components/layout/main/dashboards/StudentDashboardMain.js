import AdminFeedbacks from "@/components/sections/sub-section/dashboards/AdminFeedbacks";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import React from "react";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";

const StudentDashboardMain = () => {
  return (
    <>
      <CounterStudent />
      <ProgressOverview />
      <UpcomigClasses />
      {/* <AdminFeedbacks /> */}
    </>
  );
};

export default StudentDashboardMain;
