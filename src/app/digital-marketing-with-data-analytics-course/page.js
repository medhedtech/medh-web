'use client';

import React from 'react';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import DigiMarketingBanner from '@/components/sections/digital-marketing/digiMarketingBanner';
import DigiMarketingOverview from '@/components/sections/digital-marketing/digiMarketingOverview';
import DigiMarketingCource from '@/components/sections/digital-marketing/digiMarketingCource';
import DigiMarketingFaq from '@/components/sections/digital-marketing/digiMarketingFaq';
import DigiMarketingCourceBanner from '@/components/sections/digital-marketing/digiMarketingCourceBanner';
import DigiMarketingRalatedCource from '@/components/sections/digital-marketing/digiMarketingRalatedCource';
import ThemeController from "@/components/shared/others/ThemeController";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import AnimatedContent from './AnimatedContent';

function DigitalMarketing() {
  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Digital Marketing & Analytics
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                Course
              </span>
            </div>
          </nav>
        </header>

        {/* Content with Header Offset */}
        <main className="flex-grow pt-16">
          <AnimatedContent 
            components={{
              DigiMarketingBanner,
              DigiMarketingOverview,
              DigiMarketingCource,
              DigiMarketingFaq,
              DigiMarketingCourceBanner,
              DigiMarketingRalatedCource,
              ExploreJourney,
              ThemeController
            }}
            exploreJourneyProps={{
              mainText: "Transform Your Career in Digital Marketing. Master Data-Driven Strategies.",
              subText: "Enroll Now!"
            }}
          />
        </main>

        {/* Theme Controller - Fixed Position */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
    </PageWrapper>
  );
}

export default DigitalMarketing;





