"use client";

import React from "react";
import { NextPage } from "next";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { toast } from 'react-toastify';
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";
import Certified from "@/components/sections/why-medh/Certified";
import EmbeddedCorporateForm from "@/components/forms/EmbeddedCorporateForm";
import { AnimatedContent } from "@/components/shared/course-content";
import { mobilePatterns } from "@/utils/designSystem";

/**
 * Corporate Training Courses Page Component
 * 
 * This page showcases corporate training programs with mobile-first optimization.
 * Includes hero banner, overview, certifications, enrollment form, and FAQ sections.
 * 
 * @returns The complete corporate training courses page
 */
const CorporateTraining: NextPage = () => {
  return (
    <PageWrapper addBottomPadding={false}>
      <main className="min-h-screen">
        {/* Mobile-optimized sections container */}
        <div className="space-y-0">
          {/* Hero Banner - Mobile optimized */}
          <section className="min-h-screen relative">
            <CorporateBanner />
          </section>

          {/* Corporate Overview - Mobile enhanced */}
          <section className="relative">
            <CorporateOverview />
          </section>

          {/* Certifications - Mobile friendly */}
          <section className="relative">
            <Certified />
          </section>

          {/* Corporate Training Inquiry Form - Mobile optimized professional styling */}
          <section 
            id="enroll-form" 
            className={`relative ${mobilePatterns.mobileSection()} ${mobilePatterns.mobileSpacing.section}`}
          >
            <div className={`${mobilePatterns.mobileContainer('lg')} relative z-10`}>
              {/* Mobile-friendly header */}
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4 leading-tight">
                  Ready to <span className="text-blue-600 dark:text-blue-400">Transform</span> Your Team?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
                  Get started with our corporate training programs designed for enterprise success
                </p>
              </div>
              
              {/* Enhanced Corporate Training Form */}
              <div className="flex justify-center">
                <EmbeddedCorporateForm 
                  onSubmitSuccess={(data) => {
                    console.log('🎉 Corporate training inquiry submitted successfully:', data);
                    toast.success(
                      `Thank you! Your corporate training inquiry has been submitted successfully. 
                       Application ID: ${data.application_id || 'Generated'}. 
                       Our team will contact you within 24 hours.`,
                      {
                        position: "top-center",
                        autoClose: 8000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      }
                    );
                    // Could add analytics tracking or redirect here
                    // Example: gtag('event', 'corporate_inquiry_submitted', { application_id: data.application_id });
                  }}
                  onSubmitError={(error) => {
                    console.error('❌ Corporate training inquiry submission failed:', error);
                    toast.error(
                      'There was an issue submitting your corporate training inquiry. Please try again or contact our support team.',
                      {
                        position: "top-center",
                        autoClose: 6000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      }
                    );
                    // Could add error analytics tracking here
                    // Example: gtag('event', 'corporate_inquiry_error', { error: error.message });
                  }}
                  className="w-full max-w-4xl"
                />
              </div>
            </div>
            
            {/* Mobile-optimized background elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
            <div className="absolute top-10 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl"></div>
          </section>

          {/* FAQ Section - Mobile enhanced */}
          <section className="relative">
            <CorporateFaq />
          </section>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CorporateTraining;
