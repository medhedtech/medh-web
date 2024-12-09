import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import VedicBanner from "@/components/sections/vedic-mathematics/vedicBanner";
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicCource from "@/components/sections/vedic-mathematics/vedicCource";
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";
import VedicCourceBanner from "@/components/sections/vedic-mathematics/vedicCourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";
import VedicRalatedCource from "@/components/sections/vedic-mathematics/vedicRalatedCource";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";

function VedicMathematics() {
  return (
    <PageWrapper>
      <VedicBanner />
      <VedicOverview />
      <VedicCource />
      <ExploreJourney
        mainText="Discover the Art of Quick Problem-Solving. Turn Math Fear into Math Fun."
        subText="Enroll in Vedic Math Course Today!"
      />
      <VedicFaq />
      <VedicCourceBanner />
      <VedicRalatedCource />
      <ThemeController/>
    </PageWrapper>
  );
}

export default VedicMathematics;
