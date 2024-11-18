"use client";
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseDetailedNew from "./[courseId]/page";

function CourseDetailed() {
  return (
    <PageWrapper>
      <CourseDetailedNew />
      <ThemeController />
    </PageWrapper>
  );
}

export default CourseDetailed;
