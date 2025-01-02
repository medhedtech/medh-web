import React from "react";
import StudentMembershipCard from "./studentMembershipCard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import CorporateEmpMembershipCard from "./CorporateEmpMembershipCard";
function CorporateEmpMembership() {
  return (
    <div>
      <div className="px-8">
        <HeadingDashboard />
      </div>
      <div className="px-4">
        <CorporateEmpMembershipCard />
      </div>
    </div>
  );
}
export default CorporateEmpMembership;
