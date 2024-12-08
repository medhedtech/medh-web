import React, { useState } from "react";
import SelectCourseModal from "@/components/layout/main/dashboards/SelectCourseModal";

const membershipData = [
  {
    type: "Silver",
    plans: [
      { duration: "MONTHLY", price: "$49.00" },
      { duration: "QUARTERLY", price: "$99.00" },
      { duration: "HALF-YEARLY", price: "$129.00" },
      { duration: "ANNUALLY", price: "$149.00" },
    ],
    description:
      "You have a choice to explore and learn any or all programs within a 'single-course-category' of your preference.",
  },
  {
    type: "Gold",
    plans: [
      { duration: "MONTHLY", price: "$69.00" },
      { duration: "QUARTERLY", price: "$119.00" },
      { duration: "HALF-YEARLY", price: "$149.00" },
      { duration: "ANNUALLY", price: "$199.00" },
    ],
    description:
      "Gold membership gives access to multiple course categories for a premium experience.",
  },
];

const PrimeMembership = () => {
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [isSelectCourseModalOpen, setSelectCourseModalOpen] = useState(false);
  const [planType, setPlanType] = useState("");
  const [selectedMembership, setSelectedMembership] = useState(""); // State for dropdown value

  const plans = {
    Monthly: { silver: "$49", gold: "$59", period: "per month" },
    Quarterly: { silver: "$129", gold: "$149", period: "per 3 months" },
    "Half-Yearly": { silver: "$249", gold: "$299", period: "per 6 months" },
    Yearly: { silver: "$499", gold: "$599", period: "per year" },
  };

  const handleSelectCourseModal = (membershipType) => {
    if (!membershipType) return; // Ensure a valid membership type is passed
    setPlanType(membershipType.toLowerCase());
    setSelectCourseModalOpen(true);
  };

  const handleMembershipChange = (e) => {
    const membership = e.target.value;
    setSelectedMembership(membership);
    if (membership) {
      handleSelectCourseModal(membership);
    }
  };

  return (
    <div
      id="enroll-section"
      className="flex items-center justify-center py-12 w-full dark:bg-screen-dark bg-white"
    >
      <div className="lg:w-[80%] w-[92%] flex justify-center items-center dark:text-white flex-col">
        <h1 className="text-2xl md:text-3xl font-bold mb-10 dark:text-gray50">
          Medh-SDP-Membership
        </h1>
        <div className="flex justify-between flex-wrap w-full">
          {membershipData.map((membership, index) => (
            <div
              key={index}
              className="rounded-xl dark:border-gray-600 p-6 lg:w-[48%] md:w-full mb-5 border border-[#0000004D]"
              style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
            >
              <div className="md:text-3xl text-[27px] font-semibold border-b-2 border-[#252525] dark:border-gray-500 pb-5 font-Popins">
                <h2 className="text-primaryColor">{membership.type}</h2>
                <h2>Membership</h2>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-8">
                {membership.plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-[#5C6574] rounded-xl px-4 py-2"
                  >
                    <p className="font-medium lg:text-[1rem] text-sm ">
                      {plan.duration}
                    </p>
                    <p className="lg:text-xl text-base font-semibold">
                      {plan.price}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm mt-6 text-gray-600 dark:text-gray-400">
                {membership.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-base px-6 text-[#F6B335]">
          Note: Only Medh&#39;s Blended Courses having &#39;Pre-Recorded Videos
          with Live Interactive Doubt Clearing Sessions&#39; would be eligible
          for these memberships.
        </p>

        <div className="mt-8">
          <label className="block text-center mb-2 text-xl dark:text-white text-[#5C6574]">
            Select Membership
          </label>
          <select
            className="border-2 rounded px-10 py-2 w-full dark:bg-screen-dark text-[#727695]"
            value={selectedMembership}
            onChange={handleMembershipChange} // Call function on change
          >
            <option value="">Select One</option>
            <option value="Silver">Silver Membership</option>
            <option value="Gold">Gold Membership</option>
          </select>
        </div>
      </div>

      {isSelectCourseModalOpen && (
        <SelectCourseModal
          isOpen={isSelectCourseModalOpen}
          onClose={() => setSelectCourseModalOpen(false)}
          planType={planType}
          amount={plans[selectedPlan][planType]}
          selectedPlan={selectedPlan}
          closeParent={() => setSelectCourseModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PrimeMembership;