"use client";

import HireFromMedhBanner from "@/components/sections/hire-from-medh/hireFromMedhBanner";
import HireFromMedhCourseBanner from "@/components/sections/hire-from-medh/HireFromMedhCourseBanner";
import HireFromMedhFaq from "@/components/sections/hire-from-medh/HireFromMedhFaq";
import HireSection from "@/components/sections/hire-from-medh/HireSection";
import HiringProcess from "@/components/sections/hire-from-medh/HiringProcess";
import SkillsSection from "@/components/sections/hire-from-medh/SkillsSection";
import MultiStepHireForm from "@/components/sections/hire/MultiStepHireForm";
import Certified from "@/components/sections/why-medh/Certified";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import { NextPage } from "next";

/**
 * Hire from Medh Page Component
 * 
 * This page showcases Medh's hiring services and talent acquisition solutions.
 * Features a multi-step inquiry form for companies looking to hire Medh-trained
 * professionals or request corporate training services.
 * 
 * @returns {JSX.Element} The complete hire from Medh page
 */
const HireFromMedh: NextPage = (): JSX.Element => {
  return (
    <PageWrapper>
      <HireFromMedhBanner />
      <HireSection />
      <SkillsSection />
      <HiringProcess />
      <div id="hire-form" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MultiStepHireForm />
        </div>
      </div>
      <Certified />
      <HireFromMedhFaq />
      {/* <HireFromMedhCourseBanner /> */}
    </PageWrapper>
  );
};

export default HireFromMedh; 