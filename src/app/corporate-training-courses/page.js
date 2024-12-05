import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";
import ThemeController from "@/components/shared/others/ThemeController";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import Certified from "@/components/sections/why-medh/Certified";

function CorporateTraining() {
  return (
    <PageWrapper>
      <CorporateBanner />
      <CorporateOverview />
      {/* <Registration /> */}
      <ExploreJourney
        mainText="Transform Your Workforce Today: Drive Change, Unlock Growth!"
        subText="Let’s Connect"
      />
      <Certified />
      <CorporateFaq />
      <CourceBanner />
      <ThemeController />
    </PageWrapper>
  );
}

export default CorporateTraining;
