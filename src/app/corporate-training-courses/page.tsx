"use client";

import React from "react";
import { NextPage } from "next";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";
import Certified from "@/components/sections/why-medh/Certified";
import CorporateJourneyForm from "@/components/sections/corporate-enquiry-form/Corporate-Form";
import { AnimatedContent } from "@/components/shared/course-content";

const CorporateTraining: NextPage = () => {
  return (
    <PageWrapper>
      <main>
        <div>
          <CorporateBanner />
          <CorporateOverview />
          <Certified />
          <div id="enroll-form">
            <CorporateJourneyForm 
              mainText="Enroll Now for Corporate Training" 
              subText="Fill out the form below to start your corporate learning journey with us"
            />
          </div>
          <CorporateFaq />
        </div>
      </main>
    </PageWrapper>
  );
};

export default CorporateTraining; 