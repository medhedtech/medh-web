'use client';

import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import VedicBanner from "@/components/sections/vedic-mathematics/vedicBanner";
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicCource from "@/components/sections/vedic-mathematics/vedicCource";
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";
import VedicCourceBanner from "@/components/sections/vedic-mathematics/vedicCourseBanner";
import VedicRalatedCource from "@/components/sections/vedic-mathematics/vedicRalatedCource";
import ThemeController from "@/components/shared/others/ThemeController";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import AnimatedContent from './AnimatedContent';

function VedicMathematics() {
  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transform-gpu">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vedic Mathematics
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
              VedicBanner,
              VedicOverview,
              VedicCource,
              VedicFaq,
              VedicCourceBanner,
              VedicRalatedCource,
              ExploreJourney,
              ThemeController
            }}
            exploreJourneyProps={{
              mainText: "Discover the Art of Quick Problem-Solving. Turn Math Fear into Math Fun.",
              subText: "Enroll in Vedic Math Course Today!"
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

export default VedicMathematics;
