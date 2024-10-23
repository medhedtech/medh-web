


"use client";
import React from "react";

import Registration from "@/components/sections/registrations/Registration";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import SchoolBanner from "@/components/sections/join-as-school/schoolBanner";
import KeyAdvantages from "@/components/sections/join-as-school/keyAdvantagesSchool";
import SchoolCourceBanner from "@/components/sections/join-as-school/schoolCourseBanner";
import SchoolFaq from "@/components/sections/join-as-school/schoolFaq";
import AdvanceEducational from "@/components/sections/join-as-school/advanceEducational";

function JoinSchool() {
  return (
    <PageWrapper>
      <SchoolBanner/>
      <KeyAdvantages/>
      <AdvanceEducational/>
      <Registration />
      <SchoolFaq/>
      <SchoolCourceBanner />
    </PageWrapper>
  );
}

export default JoinSchool;
