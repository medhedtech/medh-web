import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import VedicBanner from "@/components/sections/vedic-mathematics/vedicBanner";
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicCource from "@/components/sections/vedic-mathematics/vedicCource";
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";
import VedicCourceBanner from "@/components/sections/vedic-mathematics/vedicCourseBanner";
import VedicRalatedCource from "@/components/sections/vedic-mathematics/vedicRalatedCource";

function VedicMathematics() {
  return (
    <PageWrapper>
      <VedicBanner />
      <VedicOverview />
      <VedicCource />
      <VedicFaq />
      <VedicCourceBanner />
      <VedicRalatedCource />
    </PageWrapper>
  );
}

export default VedicMathematics;
