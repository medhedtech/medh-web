import React from "react";
import CounterStudent from "@/components/sections/sub-section/dashboards/CounterStudent";
import ProgressOverview from "./ProgressOverview";
import UpcomigClasses from "@/components/shared/dashboards/UpcomigClasses";
import CourseDetailed from "@/app/course-detailed/page";
import CourseDetails from "./CourseDetails";

const StudentDashboardMain = () => {
  return (
    <>
      {/* <CounterStudent />
      <ProgressOverview />
      <UpcomigClasses /> */}
      <CourseDetails />
      {/* <AdminFeedbacks /> */}
    </>
  );
};

export default StudentDashboardMain;
