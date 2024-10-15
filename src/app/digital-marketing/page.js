import React from 'react'
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import DigiMarketingBanner from '@/components/sections/digital-marketing/digiMarketingBanner'
import DigiMarketingOverview from '@/components/sections/digital-marketing/digiMarketingOverview';
import DigiMarketingCource from '@/components/sections/digital-marketing/digiMarketingCource';
import DigiMarketingFaq from '@/components/sections/digital-marketing/digiMarketingFaq';
import DigiMarketingCourceBanner from '@/components/sections/digital-marketing/digiMarketingCourceBanner';
import DigiMarketingRalatedCource from '@/components/sections/digital-marketing/digiMarketingRalatedCource';

function DigitalMarketing() {
  return (
    <PageWrapper>
      <DigiMarketingBanner />
      <DigiMarketingOverview  />
      < DigiMarketingCource />
      <DigiMarketingFaq />
      <DigiMarketingCourceBanner />
      <DigiMarketingRalatedCource />
    </PageWrapper>
  )
}

export default DigitalMarketing





