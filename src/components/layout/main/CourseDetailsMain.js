import CourseDetailsPrimary from "@/components/sections/course-details/CourseDetailsPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CourseDetailsMain = ({ id, courseId }) => {
  return (
    <>
      <HeroPrimary path={"Course-Details"} title={"Course Details"} />
      <CourseDetailsPrimary id={id} courseId={courseId} />
    </>
  );
};

export default CourseDetailsMain;
