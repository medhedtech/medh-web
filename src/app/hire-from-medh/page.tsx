"use client";

import HireFromMedhBanner from "@/components/sections/hire-from-medh/hireFromMedhBanner";
import HireFromMedhCourseBanner from "@/components/sections/hire-from-medh/HireFromMedhCourseBanner";
import HireFromMedhFaq from "@/components/sections/hire-from-medh/HireFromMedhFaq";
import HireSection from "@/components/sections/hire-from-medh/HireSection";
import HiringProcess from "@/components/sections/hire-from-medh/HiringProcess";
import SkillsSection from "@/components/sections/hire-from-medh/SkillsSection";
import Certified from "@/components/sections/why-medh/Certified";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import { NextPage } from "next";

/**
 * Hire from Medh Page Component
 * 
 * This page showcases Medh's hiring services and talent acquisition solutions.
 * 
 * @returns The complete hire from Medh page
 */
const HireFromMedh: NextPage = () => {
  return (
    <PageWrapper>
      <HireFromMedhBanner />
      <HireSection />
      <SkillsSection />
      <HiringProcess />
      <Certified />
      <HireFromMedhFaq />
      {/* <HireFromMedhCourseBanner /> */}
    </PageWrapper>
  );
};

export default HireFromMedh;
