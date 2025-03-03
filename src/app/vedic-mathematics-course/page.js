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
    </PageWrapper>
  );
}

export default VedicMathematics;
