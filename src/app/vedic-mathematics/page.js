import React from 'react'
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import VedicBanner from '@/components/sections/vedic-mathematics/vedicBanner'
import VedicOverview from '@/components/sections/vedic-mathematics/vedicOverview';
import VedicCource from '@/components/sections/vedic-mathematics/vedicCource';
import VedicFaq from '@/components/sections/vedic-mathematics/vedicFaq';
// import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
// import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
// import PageWrapper from "@/components/shared/wrappers/PageWrapper";
// import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";

function VedicMathematics() {
  return (
    <PageWrapper>
    <VedicBanner />
    <VedicOverview />
    <VedicCource />
    <VedicFaq />
  </PageWrapper>
  )
}

export default VedicMathematics
