"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "MEDH Membership Overview",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            MEDH Membership is designed to provide members with unparalleled
            access to resources, support, and opportunities that drive
            educational and professional development. Our membership program is
            tailored to meet the diverse needs of our community, offering a
            range of benefits that cater to individuals, students, and
            educational institutions. By joining MEDH Membership, you become
            part of a forward-thinking community dedicated to innovation and
            excellence in education.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Silver Membership",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title:
                  "You have a choice to explore and learn any or all courses within a ‘Single-Course-Category’ of your preferences",
              },
              {
                title: "Exclusive Content Access",
                description:
                  "Enjoy access to a curated library of exclusive educational content, including webinars, tutorials, and research papers.",
              },
              {
                title: "Discounts on Courses",
                description:
                  "Receive up to 20% discount on all MEDH skill development courses including LIVE and Blended both, allowing you to learn more for less.",
              },
              {
                title: "Community Engagement",
                description:
                  "Participate in members-only forums and discussion groups to connect with like-minded individuals and share knowledge.",
              },
              {
                title: "Monthly Newsletter",
                description:
                  "Stay informed with our monthly newsletter featuring the latest updates, tips, and insights from industry experts.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },

    {
      id: 3,
      name: "Gold Membership",
      content: (
        <>
        <p className="text-lightGrey14 font-bold md:text-[15px] text-[14px] dark:text-gray300 ">
          You have a choice to explore and learn any or all programs within
          any of the Three-Course-Categories of your preference.
        </p>
        <p className="text-lightGrey14 md:text-[15px] text-[14px] dark:text-gray300 my-4">
          All Silver Membership Benefits plus additional perks.
        </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Premium Content Access",
                description:
                  "Gain access to advanced courses, special workshops, and exclusive events that are not available to the general public.",
              },
              {
                title: "Personalized Support",
                description:
                  "Receive one-on-one mentoring sessions and personalized guidance from our team of experts to help you achieve your goals.",
              },
              {
                title: "Early Access to New Courses",
                description:
                  "Be the first to access new courses and programs before they are released to the public.",
              },
              {
                title: "Higher Discount Rates",
                description:
                  "Enjoy up to 30% discount on all Medh courses, including LIVE and Blended both, maximizing your learning opportunities.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ],
};

const MembershipOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10  w-full flex justify-center items-center">
      <div className="w-full md:w-[80%]">
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 text-[#41454F] dark:text-gray-50">
            Unlock Your Potential with MEDH Membership! Become an expert in your
            chosen field of interest by gaining comprehensive knowledge and
            skills.
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
            Welcome to MEDH Membership, where we empower individuals, students,
            and educational institutions with exclusive benefits that foster
            growth, learning, and success. Whether you are looking to enhance
            your skills in your chosen domains, gain access to premium content,
            or receive personalized support, our membership program offers
            something for everyone.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0 mx-4 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-1 md:px-6 md:py-2 py-1  transition sm:mb-0 mb-1 ${
                activeTab === tab.id
                  ? "bg-primaryColor text-white font-semibold"
                  : "bg-white text-primaryColor border border-primaryColor"
              } hover:bg-primaryColor hover:text-white`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Rendering */}
        <section className=" bg-white mx-4 md:mx-0 dark:bg-screen-dark px-2 md:px-6 py-8 border-2 border-gray-200 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            {activeContent.name}
          </h1>
          <div className="mt-4">{activeContent.content}</div>
        </section>
      </div>
    </div>
  );
};

export default MembershipOverview;
