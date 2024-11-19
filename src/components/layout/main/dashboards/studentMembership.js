import React from "react";
import StudentMembershipCard from "./studentMembershipCard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
function StudentMembership() {
  return (
    <div>
      <div className="px-8">
        <HeadingDashboard />
      </div>
      <div className="px-4">
        <StudentMembershipCard />
      </div>
    </div>
  );
}
export default StudentMembership;
