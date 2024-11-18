"use client"
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import CourseDetailedNew from "./[id]/page";
import { useRouter } from "next/navigation";

function CourseDetailed() {
  const router = useRouter();
  const { courseId } = router.query;
  console.log("course id in the course detailded page", courseId);
  return (
    <PageWrapper>
      <CourseDetailedNew courseId={courseId} />
      <ThemeController />
    </PageWrapper>
  );
}

export default CourseDetailed;
