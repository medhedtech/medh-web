"use client";

import React, { useState } from "react";

// Example of importing JSON content
const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content:
        "Introducing Medh’s Personality Development Courses that offer practical insights and techniques to enhance confidence, communication, and leadership capabilities for personal and professional success.",
    },
    {
      id: 2,
      name: "Benefits",
      content:
        "Benefits of the course include improved self-confidence, better communication skills, and enhanced leadership capabilities.",
    },
    {
      id: 3,
      name: "Career Prospects",
      content:
        "Courses can open up various career opportunities, especially in fields that value soft skills.",
    },
  ],
  overview: {
    // title: "Overview",
    keyFeatures: [
      {
        title: "Age-Appropriate Content",
        description:
          "Tailored for different age groups from preschool to entry-level professionals.",
      },
      {
        title: "Interactive Learning",
        description:
          "Delivered through online sessions, hands-on activities, role-plays, and assessments.",
      },
      {
        title: "Expert Instructors",
        description:
          "Experienced educators provide engaging, multimedia-rich content.",
      },
      {
        title: "Enhanced Confidence",
        description:
          "Build a strong sense of self-assurance to tackle life’s challenges.",
      },
      {
        title: "Improved Communication Skills",
        description:
          "Articulate thoughts clearly, fostering better relationships.",
      },
      {
        title: "Leadership Development",
        description: "Cultivate qualities to excel in diverse roles.",
      },
      {
        title: "Professional Etiquette",
        description:
          "Gain insights into conduct for enhanced career prospects.",
      },
      {
        title: "Emotional Intelligence",
        description: "Develop empathy and resilience for better well-being.",
      },
      {
        title: "Adaptability and Resilience",
        description: "Acquire skills to thrive in dynamic environments.",
      },
      {
        title: "Personal Branding",
        description:
          "Learn to create a lasting impression in personal and professional settings.",
      },
      {
        title: "Lifelong Learning",
        description:
          "Foster continuous self-improvement for personal and professional growth.",
      },
    ],
  },
};

const PersonalityOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white h-auto py-10  w-full flex justify-center items-center">
      <div className=" w-full md:w-[80%] ">
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4 ">
        <h1 className="text-[24px]  leading-7 md:text-4xl  font-bold md:mb-3 mb-2 text-[#41454F] ">Welcome to Medh's Transformative Personality Development Course</h1>
        <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695]">Our course is designed to foster crucial life skills and character traits, offering inclusivity for individuals at every stage of life. Whether you’re a student, professional, or homemaker, this program empowers you with essential life skills, confidence, and interpersonal abilities.</p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0  mx-3 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-1 md:px-6 md:py-2 py-1  transition ${
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
        <section className=" bg-white px-5 md:px-6 py-8 border-2 border-gray-300 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-primaryColor ">
            {activeContent.name}
          </h1>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            Introducing{" "}
            <span className="text-lightGrey14 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Medh’s Personality Development Courses{" "}
            </span>{" "}
            that offer practical insights and techniques to enhance confidence,
            communication, and leadership capabilities for personal and
            professional success.",
          </p>
          {activeTab === 1 && (
            <>
              <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] ">
                <span className="text-lightGrey14 md:text-[1rem] text-[15px]font-bold tracking-wide ">
                  Tailored for diverse range of Age Groups:
                </span>{" "}
                From preschoolers, school students, college students,
                professionals, and homemakers, providing unique and engaging
                content designed to enhance their confidence, communication, and
                leadership skills.",
              </p>
              {/* Key Features Section */}
              <h2 className=" text-[1.3rem] font-bold mb-4 tracking-wide ">
                Key Features:
              </h2>
              <ul className="list-none list-inside space-y-2 pb-2">
                {data.overview.keyFeatures.map((feature, index) => (
                  <li key={index}>
                    <strong className=" text-[1rem] font-bold tracking-wide ">
                      {feature.title}:
                    </strong>{" "}
                    {feature.description}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PersonalityOverview;
