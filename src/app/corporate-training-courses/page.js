"use client"
import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";

import Certified from "@/components/sections/why-medh/Certified";
import CorporateJourneyForm from "@/components/sections/corporate-enquiry-form/Corporate-Form";
import { AnimatedContent } from "@/components/shared/course-content";

function CorporateTraining() {
  return (
    <PageWrapper>
      <main>
        <section className="relative w-full">
          <CorporateBanner />
        </section>
        
        <section className="relative w-full bg-gray-50 dark:bg-gray-900">
          <CorporateOverview />
          <Certified />
          <CorporateFaq />
        </section>
      </main>
    </PageWrapper>
  );
}

export default CorporateTraining;
