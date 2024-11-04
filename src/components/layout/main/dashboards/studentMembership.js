import React from "react";
import StudentMembershipCard from "./studentMembershipCard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
function StudentMembership() {
  return (
    <div className="p-10px md:px-10 md:py-50px dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark ">
      <HeadingDashboard />
      <StudentMembershipCard />
    </div>
  );
}
export default StudentMembership;
