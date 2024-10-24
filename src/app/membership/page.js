"use client";
import React from "react";

import MembershipBanner from "@/components/sections/membership/membershipBanner";
import MembershipOverview from "@/components/sections/membership/membershipOverview";
import MembershipFaq from "@/components/sections/membership/membershipFaq";
import MembershipCourceBanner from "@/components/sections/membership/membershipCourseBanner";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PrimeMembership from "@/components/sections/membership/primeMembership";
import MembershipFeatures from "@/components/sections/membership/membershipFeatures";
import Certified from "@/components/sections/why-medh/Certified";
import ThemeController from "@/components/shared/others/ThemeController";

export default function Membership() {
  return (
    <PageWrapper>
      <MembershipBanner />
      <MembershipOverview />
      <PrimeMembership />
      <MembershipFeatures />
      <MembershipFaq />
      <MembershipCourceBanner />
      <Certified />
      <ThemeController />
    </PageWrapper>
  );
}
