"use client";
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseDetailedNew from "./[courseId]/page";

function CourseDetailed({ params }) {
  const { courseId } = params;
  console.log("course id in course detailed", courseId);
  return (
    <PageWrapper>
      <CourseDetailedNew courseId={courseId} />
      <ThemeController />
    </PageWrapper>
  );
}

export default CourseDetailed;
