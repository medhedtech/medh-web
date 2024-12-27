import React from "react";
import CorporateMembershipCard from "./CorporateMembershipCard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
function CorporateMembership() {
  return (
    <div>
      <div className="px-8">
        <HeadingDashboard />
      </div>
      <div className="px-4">
        <CorporateMembershipCard />
      </div>
    </div>
  );
}
export default CorporateMembership;
