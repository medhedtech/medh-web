import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import Registration from "@/components/sections/registrations/Registration";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";
import ThemeController from "@/components/shared/others/ThemeController";

function CorporateTraining() {
  return (
    <PageWrapper>
      <CorporateBanner />
      <CorporateOverview />
      <Registration />
      <CorporateFaq />
      <CourceBanner />
      <ThemeController />
    </PageWrapper>
  );
}

export default CorporateTraining;
