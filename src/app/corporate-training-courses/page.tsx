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
      <main className="min-h-screen">
        <div className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8">
          <section className="min-h-screen">
            <CorporateBanner />
          </section>

          <section className="px-2 sm:px-4 md:px-6 lg:px-8">
            <CorporateOverview />
          </section>

          <section className="px-2 sm:px-4 md:px-6 lg:px-8">
            <Certified />
          </section>

          <section className="px-2 sm:px-4 md:px-6 lg:px-8" id="enroll-form">
            <div className="max-w-4xl mx-auto">
              <CorporateJourneyForm 
                mainText="Enroll Now for Corporate Training" 
                subText="Fill out the form below to start your corporate learning journey with us"
              />
            </div>
          </section>

          <section className="px-2 sm:px-4 md:px-6 lg:px-8 pb-8 md:pb-12 lg:pb-16">
            <CorporateFaq />
          </section>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CorporateTraining; 