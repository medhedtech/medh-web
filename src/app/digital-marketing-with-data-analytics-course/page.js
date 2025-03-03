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
    </PageWrapper>
  );
}

export default DigitalMarketing;





