import CourseAiOverview from "@/components/sections/course-ai/courseai-overview";
import CourseAiBanner from "@/components/sections/course-ai/courseaiBanner";
import CourseAiCourseBanner from "@/components/sections/course-ai/courseAiCourseBanner";
import CourseAiFaq from "@/components/sections/course-ai/courseAiFaq";
import CourseAiRelatedCourses from "@/components/sections/course-ai/courseAiRelatedCourse";
import CourseOptions from "@/components/sections/course-ai/courseOptions";
import Registration from "@/components/sections/registrations/Registration";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import React from "react";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";

function CouseAi() {
  return (
    <PageWrapper>
      <CourseAiBanner />
      <CourseAiOverview />
      <CourseOptions />
      {/* <Registration /> */}
      <ExploreJourney 
        mainText="Transform Your Career. Explore Your Journey in AI and Data Science."
        subText="Enroll Now !"
      />
      <CourseAiFaq />
      <CourseAiCourseBanner />
      <CourseAiRelatedCourses />
      <ThemeController />
    </PageWrapper>
  );
}

export default CouseAi;
