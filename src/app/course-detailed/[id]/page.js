import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseEducation from "@/components/sections/course-detailed/courseEducation";
import AboutProgram from "@/components/sections/course-detailed/aboutProgram";
import CaurseFaq from "@/components/sections/course-detailed/caurseFaq";
import CourseCertificate from "@/components/sections/course-detailed/courseCertificate";
import CourceRalated from "@/components/sections/course-detailed/courseRelated";
import ThemeController from "@/components/shared/others/ThemeController";

function CourseDetailedNew({ params }) {
  const { courseId } = params;
  console.log("course id in the course detailded page new", courseId);
  return (
    <PageWrapper>
      <CourseEducation courseId={courseId} />
      <AboutProgram />
      <CaurseFaq />
      <CourceRalated />
      <CourseCertificate />
      <ThemeController />
    </PageWrapper>
  );
}

export default CourseDetailedNew;
