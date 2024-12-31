import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import React from "react";
import CoorporateEnrollCourses from "./Coorporate_Enroll_Courses";
import CoorporateRecorded_Sessions from "@/components/shared/dashboards/CoorporateRecordedSessions";
import CoorporateNew_Courses from "@/components/shared/dashboards/Coorporate_New_Courses";

const CoorporateMyCoursesDashboard = () => {
  return (
    <div>
      <div className="px-9">
        <HeadingDashboard />
      </div>
      <CoorporateEnrollCourses />
      {/* <CoorporateRecorded_Sessions /> */}
      <CoorporateNew_Courses />
    </div>
  );
};

export default CoorporateMyCoursesDashboard;
