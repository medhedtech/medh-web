import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CorporateBanner from "@/components/sections/corporate-training/corporateBanner";
import CorporateFaq from "@/components/sections/corporate-training/corporateFaq";
import CorporateOverview from "@/components/sections/corporate-training/corporateOverview";
import CourceBanner from "@/components/sections/corporate-training/courseBanner";

import Certified from "@/components/sections/why-medh/Certified";
import CorporateJourneyForm from "@/components/sections/corporate-enquiry-form/Corporate-Form";

function CorporateTraining() {
  return (
    <PageWrapper>
      <div className="py-12">
        <CorporateBanner />
      </div>
      <CorporateOverview />
      {/* <CorporateJourneyForm
        mainText="Transform Your Workforce Today: Drive Change, Unlock Growth!"
        subText="Let’s Connect"
      /> */}
      <Certified />
      <CorporateFaq />
      <CourceBanner />
      
    </PageWrapper>
  );
}

export default CorporateTraining;
