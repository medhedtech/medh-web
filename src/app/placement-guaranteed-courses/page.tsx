"use client";

import PlacementGauranteedBanner from "@/components/sections/placement-guaranteed/placement-banner";
import Registration from "@/components/sections/registrations/Registration";
import Certified from "@/components/sections/why-medh/Certified";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import HireSectionPlacement from "@/components/sections/placement-guaranteed/HireSection";
import HiringProcessPlacement from "@/components/sections/placement-guaranteed/workProcessPlacement";
import PlacementBenefits from "@/components/sections/placement-guaranteed/placementBenefits";
import PlacementFaq from "@/components/sections/placement-guaranteed/PlacementFaq";
import PlacementCourseBanner from "@/components/sections/placement-guaranteed/PlacementCourseBanner";
import PlacementCourseDetails from "@/components/sections/placement-guaranteed/placement-course-details";

const PlacementGauranty: React.FC = () => {
  return (
    <PageWrapper>
      <PlacementGauranteedBanner />
      <PlacementCourseDetails />
      <HireSectionPlacement/>
      <HiringProcessPlacement/>
      <PlacementBenefits/>
      <PlacementFaq />
      <div>
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
      
    </PageWrapper>
  );
};

export default PlacementGauranty;
