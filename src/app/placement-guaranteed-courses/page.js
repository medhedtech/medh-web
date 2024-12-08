"use client";

import PlacementGauranteedBanner from "@/components/sections/placement-guaranteed/placement-banner";
import Registration from "@/components/sections/registrations/Registration";
import Certified from "@/components/sections/why-medh/Certified";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import HireSectionPlacement from "@/components/sections/placement-guaranteed/HireSection";
import HiringProcessPlacement from "@/components/sections/placement-guaranteed/workProcessPlacement";
import PlacementBenefits from "@/components/sections/placement-guaranteed/placementBenefits";
import PlacementFaq from "@/components/sections/placement-guaranteed/PlacementFaq";
import PlacementCourseBanner from "@/components/sections/placement-guaranteed/PlacementCourseBanner";

function PlacementGauranty() {
  return (
    <PageWrapper>
      <PlacementGauranteedBanner />
      <HireSectionPlacement/>
      <HiringProcessPlacement/>
      <PlacementBenefits/>
      <PlacementFaq />
      <div className="bg-white pb-6 mt-[-3%]">
        <Certified />
      </div>
      <PlacementCourseBanner />
      {/* <SkillsSection /> */}
      {/* <HiringProcess />
      <Registration showUploadField={true} pageTitle="hire_from_medh" />
      <div className="bg-white py-6">
        <Certified />
      </div>
    //   <HireFromMedhFaq />
      <HireFromMedhCourseBanner /> */}
      <ThemeController />
    </PageWrapper>
  );
}

export default PlacementGauranty;
