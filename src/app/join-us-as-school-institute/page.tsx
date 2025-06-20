"use client";
import React from "react";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import SchoolBanner from "@/components/sections/join-as-school/schoolBanner";
import KeyAdvantages from "@/components/sections/join-as-school/keyAdvantagesSchool";
import SchoolCourceBanner from "@/components/sections/join-as-school/schoolCourseBanner";
import SchoolFaq from "@/components/sections/join-as-school/schoolFaq";
import AdvanceEducational from "@/components/sections/join-as-school/advanceEducational";
import Certified from "@/components/sections/why-medh/Certified";
import MultiStepSchoolPartnershipForm from "@/components/sections/join-as-school/MultiStepSchoolPartnershipForm";

const JoinSchool: React.FC = () => {
  return (
    <PageWrapper>
      <SchoolBanner />
      <KeyAdvantages />
      <AdvanceEducational />
      <div id="registration-section">
        <MultiStepSchoolPartnershipForm />
      </div>
      <Certified />
      <SchoolFaq />
    </PageWrapper>
  );
};

export default JoinSchool; 