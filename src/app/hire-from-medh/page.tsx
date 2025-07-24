"use client";

import HireFromMedhBanner from "@/components/sections/hire-from-medh/hireFromMedhBanner";
import HireFromMedhCourseBanner from "@/components/sections/hire-from-medh/HireFromMedhCourseBanner";
import HireFromMedhFaq from "@/components/sections/hire-from-medh/HireFromMedhFaq";
import HireSection from "@/components/sections/hire-from-medh/HireSection";
import HiringProcess from "@/components/sections/hire-from-medh/HiringProcess";
import EmbeddedHireForm from "@/components/forms/EmbeddedHireForm";
import SkillsSection from "@/components/sections/hire-from-medh/SkillsSection";
import Certified from "@/components/sections/why-medh/Certified";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
import { NextPage } from "next";

/**
 * Hire from Medh Page Component
 * 
 * This page showcases Medh's hiring services and talent acquisition solutions.
 * 
 * @returns The complete hire from Medh page
 */
const HireFromMedh: NextPage = () => {
  return (
    <>
      <style jsx global>{`
        html, body {
          padding: 0 !important;
          margin: 0 !important;
          height: 100% !important;
        }
        
        #main-content {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
          min-height: 100vh !important;
        }
        
        .flex.flex-col.min-h-screen {
        }
        
        main {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
        
        section:last-child {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>
      <PageWrapper addTopPadding={false} addBottomPadding={false} showFooter={true}>
        <div className="space-y-0">
          <HireFromMedhBanner />
          <HireSection />
          <SkillsSection />
          <HiringProcess />
          <section id="registration-form" tabIndex={-1} className="scroll-mt-24 py-12 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <EmbeddedHireForm 
                onSubmitSuccess={(data) => {
                  console.log('✅ Hire form submitted successfully:', data);
                }}
                onSubmitError={(error) => {
                  console.error('❌ Hire form submission failed:', error);
                }}
              />
            </div>
          </section>
          <Certified />
          <div className="pb-0 mb-0">
            <HireFromMedhFaq />
          </div>
        </div>
        {/* <HireFromMedhCourseBanner /> */}
      </PageWrapper>
    </>
  );
};

export default HireFromMedh;
