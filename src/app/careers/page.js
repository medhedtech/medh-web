"use client";
import React from "react";
import dynamic from "next/dynamic";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CareerBanner from "@/components/sections/careers/careersBanner";
import Certified from "@/components/sections/why-medh/Certified";
import Preloader from "@/components/shared/others/Preloader";


// Dynamically import components for better performance
const CareerCourceBanner = dynamic(() => import("@/components/sections/careers/careersCourseBanner"));
const CareerFaq = dynamic(() => import("@/components/sections/careers/careersFaq"));
const JobOpening = dynamic(() => import("@/components/sections/careers/jobPositions"), {
  loading: () => <Preloader />,
  ssr: false
});
const UniqueBenefits = dynamic(() => import("@/components/sections/careers/uniqueBenefits"));

export default function CareersPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen">
        <CareerBanner />
        <UniqueBenefits />
        <JobOpening />
        <CareerFaq />
        <CareerCourceBanner />
        <div className="bg-white dark:bg-screen-dark pb-16">
          <Certified />
        </div>
        
      </main>
    </PageWrapper>
  );
}
