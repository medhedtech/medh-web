"use client"
import React, { useEffect, useState } from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseEducation from "@/components/sections/course-detailed/courseEducation";
import AboutProgram from "@/components/sections/course-detailed/aboutProgram";
import CaurseFaq from "@/components/sections/course-detailed/caurseFaq";
import CourseCertificate from "@/components/sections/course-detailed/courseCertificate";
import CourceRalated from "@/components/sections/course-detailed/courseRelated";
import ThemeController from "@/components/shared/others/ThemeController";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

function CourseDetailedNew({ params }) {
  const { courseId } = params;
  const [categoryName, setCategoryName] = useState([]);
  const { getQuery } = useGetQuery();


  const fetchCourseDetails = async () => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${courseId}`,
        onSuccess: (data) => {
          setCategoryName(data?.category);
          console.log("kjahdshbahj", data);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };

  useEffect(() => {
  fetchCourseDetails()
  },[])


  return (
    <PageWrapper>
      <CourseEducation courseId={courseId} />
      <AboutProgram courseId={courseId} />
      <CaurseFaq courseId={courseId} />
      <CourceRalated categoryName={categoryName} courseId={courseId} />
      <CourseCertificate />
      <ThemeController />
    </PageWrapper>
  );
}

export default CourseDetailedNew;
