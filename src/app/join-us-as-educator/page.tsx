"use client";

import React from "react";
import { NextPage } from "next";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import HiringProcess from "@/components/sections/join-educator/hiringProcess";
import Benefits from "@/components/sections/join-educator/joinAsBenefits";
import EducatorBanner from "@/components/sections/join-educator/educatorBanner";
import TechEducator from "@/components/sections/join-educator/techEducator";
import MedhOffering from "@/components/sections/join-educator/medhOffering";
import EducatorFaq from "@/components/sections/join-educator/educatorFaq";
import Certified from "@/components/sections/why-medh/Certified";

// Import the new comprehensive educator registration form
import MultiStepEducatorForm from "@/components/sections/join-educator/MultiStepEducatorForm";

const JoinEducatorPage: NextPage = () => {
  return (
    <PageWrapper>
      <div>
        <EducatorBanner />
        <TechEducator />
        <MedhOffering />
        <Benefits />
        <HiringProcess />
        
        {/* Enhanced Multi-Step Educator Registration Form */}
        <div id="registration-section">
          <MultiStepEducatorForm />
        </div>
        
        <Certified />
        <EducatorFaq />
        {/* 
        <div className="pb-16">
          <EducatorCourceBanner />
        </div> 
        */}
      </div>
    </PageWrapper>
  );
};

export default JoinEducatorPage; 