


"use client";
import React from "react";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CareerBanner from "@/components/sections/careers/careersBanner";
import CareerCourceBanner from "@/components/sections/careers/careersCourseBanner";
import CareerFaq from "@/components/sections/careers/careersFaq";
import Certified from "@/components/sections/why-medh/Certified";
import JobOpening from "@/components/sections/careers/jobPositions";
import UniqueBenefits from "@/components/sections/careers/uniqueBenefits";

function JoinSchool() {
  return (
    <PageWrapper>
      <CareerBanner/>
      <UniqueBenefits/>
      <JobOpening/>
      <CareerFaq/>
      <CareerCourceBanner />
      <Certified/>
    </PageWrapper>
  );
}

export default JoinSchool;
