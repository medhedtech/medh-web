"use client";
import React from "react";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CareerBanner from "@/components/sections/careers/careersBanner";
import CareerCourceBanner from "@/components/sections/careers/careersCourseBanner";
import CareerFaq from "@/components/sections/careers/careersFaq";
import Certified from "@/components/sections/why-medh/Certified";
import JobOpening from "@/components/sections/careers/jobPositions";
import UniqueBenefits from "@/components/sections/careers/uniqueBenefits";
import ThemeController from "@/components/shared/others/ThemeController";

function JoinSchool() {
  return (
    <PageWrapper>
      <CareerBanner />
      <UniqueBenefits />
      <JobOpening />
      <CareerFaq />
      <CareerCourceBanner />
<<<<<<< HEAD
      <Certified />
      <ThemeController />
=======
      <Certified/>
      <ThemeController/>
>>>>>>> origin/chandan-implement
    </PageWrapper>
  );
}

export default JoinSchool;
