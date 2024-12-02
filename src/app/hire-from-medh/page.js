"use client";

import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import CertificationsCarousel from "@/components/sections/hire-from-medh/CertificationsCarousel";
import HireFromMedhBanner from "@/components/sections/hire-from-medh/hireFromMedhBanner";
import HireFromMedhCourseBanner from "@/components/sections/hire-from-medh/HireFromMedhCourseBanner";
import HireFromMedhFaq from "@/components/sections/hire-from-medh/HireFromMedhFaq";
import HireSection from "@/components/sections/hire-from-medh/HireSection";
import HiringProcess from "@/components/sections/hire-from-medh/HiringProcess";
import SkillsSection from "@/components/sections/hire-from-medh/SkillsSection";
import Registration from "@/components/sections/registrations/Registration";
import Certified from "@/components/sections/why-medh/Certified";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";

function HireFromMedh() {
  return (
    <PageWrapper>
      <HireFromMedhBanner />
      <HireSection />
      <SkillsSection />
      <HiringProcess />
      <Registration showUploadField={true} />
      {/* <ExploreJourney
        mainText="Start Hiring Skilled Professionals Now! Discover your next IT talent here…"
        subText="Let's Connect"
      /> */}
      <div className="bg-white py-6">
        <Certified />
      </div>
      <HireFromMedhFaq />
      <HireFromMedhCourseBanner />
      <ThemeController />
    </PageWrapper>
  );
}

export default HireFromMedh;
