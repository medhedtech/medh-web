"use client";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { NextPage } from "next";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CareerBanner from "@/components/sections/careers/careersBanner";
import Certified from "@/components/sections/why-medh/Certified";
import Preloader from "@/components/shared/others/Preloader";
import { buildComponent } from "@/utils/designSystem";

// Dynamically import components for better performance
const CareerCourceBanner = dynamic(() => import("@/components/sections/careers/careersCourseBanner"));
const CareerFaq = dynamic(() => import("@/components/sections/careers/careersFaq"));
const JobOpening = dynamic(() => import("@/components/sections/careers/jobPositions"), {
  loading: () => <Preloader />,
  ssr: false
});
const UniqueBenefits = dynamic(() => import("@/components/sections/careers/uniqueBenefits"), {
  loading: () => <Preloader />,
  ssr: false
});

const CareersPage: NextPage = () => {
  const jobOpeningRef = useRef<HTMLDivElement>(null);

  const scrollToJobOpenings = (): void => {
    jobOpeningRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <main className={buildComponent.section()}>
        <CareerBanner onViewPositionsClick={scrollToJobOpenings} />
        <UniqueBenefits />
        <div ref={jobOpeningRef} id="job-openings">
          <JobOpening />
        </div>
        <CareerFaq />
        {/* <CareerCourceBanner /> */}
        <div className={buildComponent.section('dark')}>
          <div className="pb-16">
            <Certified />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CareersPage;
