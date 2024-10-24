"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      heading: "MEDH Membership Overview", // Heading for the Overview content
      keyFeatures: [
        {
          description:
            "MEDH Membership is designed to provide members with unparalleled access to resources, support, and opportunities that drive educational and professional development. Our membership program is tailored to meet the diverse needs of our community, offering a range of benefits that cater to individuals, students, and educational institutions.",
        },
      ],
    },
    {
      id: 2,
      name: "Silver Membership",
      heading: "MEDH Silver Membership",
      keyFeatures: [
        {
          description:
            "Silver Membership provides access to basic resources, educational materials, and support for personal development.",
        },
        {
          description:
            "Access to a monthly newsletter and exclusive webinars tailored to entry-level members.",
        },
      ],
    },
    {
      id: 3,
      name: "Gold Membership",
      heading: "MEDH Gold Membership",
      keyFeatures: [
        {
          description:
            "Gold Membership offers premium access to a wealth of advanced resources and direct mentorship opportunities.",
        },
        {
          description:
            "Includes all benefits of Silver Membership plus personalized coaching sessions.",
        },
      ],
    },
  ],
};

export default function MembershipOverview() {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto pt-10 pb-6 w-full flex justify-center items-center px-1 md:px-0">
      <div className="w-full lg:w-[80%]">
        {/* Title */}
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4 ">
          <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-1 mb-2 dark:text-white text-[#000000]">
            Unlock Your Potential with MEDH Membership!
          </h1>
          <p className="text-[#F2277E] text-[1rem]">
            Become an expert in your chosen field of interest by gaining
            comprehensive knowledge and skills.
          </p>
          <p className="text-center md:text-[15px] dark:text-gray300 text-[14px] leading-6 md:leading-7 md:w-[90%] text-[#727695] mt-3">
            Welcome to MEDH Membership, where we empower individuals, students,
            and educational institutions with exclusive benefits that foster
            growth, learning, and success. Whether you are looking to enhance
            your skills in your chosen domains, gain access to premium content,
            or receive personalized support, our membership program offers
            something for everyone.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0 mx-3 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 md:px-6 md:py-2 py-1 transition md:mb-0 mb-2 ${
                activeTab === tab.id
                  ? "bg-[#5F2DED] text-white font-semibold"
                  : "bg-[#E6E6FA]  text-[#5F2DED] border-2 border-[#5F2DED]"
              } hover:bg-[#5F2DED] hover:text-white`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Rendering */}
        <section className="bg-white dark:bg-screen-dark px-5 md:px-6 py-8 border-2 border-gray-300 text-lightGrey14 lg:mx-0 mx-2">
          <h1 className="text-[23px] font-bold text-[#5F2DED]">
            {activeContent.heading}
          </h1>

          {/* Render Key Features */}
          <ul className="list-none list-inside space-y-2 dark:text-white pb-2">
            {activeContent.keyFeatures.map((feature, index) => (
              <li key={index}>{feature.description}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
