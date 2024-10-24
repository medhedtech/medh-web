"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content:
        "Combining the essential disciplines of Digital Marketing with Data Analytics, this course is instrumental in driving business success in today’s digital age. Here are several compelling reasons that underscore the exceptional value of this course:",
    },
    {
      id: 2,
      name: "Benefits",
      content:
        "Benefits of Vedic Mathematics include improved speed in calculations, better mental agility, and stronger problem-solving skills. It's highly beneficial for students preparing for competitive exams.",
    },
    {
      id: 3,
      name: "Career Prospects",
      content:
        "Vedic Mathematics provides excellent career prospects for those aiming to excel in mathematics, teaching, tutoring, and competitive exams.",
    },
  
  ],
  overview: {
    keyFeatures: [
      {
        title: "Data Empowerment",
        description:
          "In the data-driven landscape, data analytics enables digital marketers to extract valuable insights from vast data pools, facilitating informed decision-making and campaign optimization for maximum ROI.",
      },
      {
        title: "Speed",
        description:
          "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
      },
      {
        title: "Competitive Edge ",
        description:
          "Competitive Edge: Staying current with evolving digital marketing trends is crucial. Data analytics equips marketers to identify emerging trends, consumer behavior patterns, and market opportunities, providing a competitive advantage in the fast-paced digital arena.",
      },
      {
        title: "Personalized Marketing",
        description:
          "Personalized Marketing: By segmenting audiences based on preferences, behaviors, and demographics, data analytics facilitates the delivery of personalized and targeted marketing messages, enhancing campaign effectiveness and customer experiences.",
      },
       {
        title: "Performance Measurement",
        description:
          " Data analytics enables precise measurement of campaign impact, tracking key performance indicators (KPIs), identifying success metrics, and optimizing resource allocation for enhanced marketing strategies.",
      },   {
        title: "Customer Journey Insight",
        description:
          " Marketers gain insights into the entire customer journey, from initial contact to conversion and beyond, allowing for the creation of seamless and engaging customer experiences.",
      },
      {
        title: "Career Opportunities",
        description:
          " Professionals skilled in digital marketing and data analytics are highly sought after. This course offers diverse career prospects in marketing, advertising, market research, and business analytics.",
          description1:
          " Equipping marketers with a comprehensive skill set, this course empowers individuals to thrive in the digital landscape, make data-driven decisions, and deliver impactful results for businesses and organizations. It serves as a transformative learning journey, setting individuals on a path of continuous success in the digital age.",
      
      },
      
       

    ],
  },
};

function DigiMarketingOverview() {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark  h-auto pt-10 pb-6 w-full flex justify-center items-center px-1 md:px-0">
      <div className="w-full md:w-[80%] ">
        {/* Title */}
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4 ">
          <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-3 mb-2 text-[#41454F] dark:text-gray50">
          Your Path to Achieving Success in the Digital Age.
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] dark:text-gray300 text-[#727695]">
          Gain expertise in using data analytics to improve digital marketing strategies. The Digital Marketing with Data Science course brings together two
          essential components of modern marketing—digital marketing and data analytics—allowing businesses to make informed, data-driven decisions and implement highly effective, targeted marketing campaigns.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0 mx-4 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 md:px-6 md:py-2 py-1 transition md:mb-0  ${
                activeTab === tab.id
                  ? "bg-[#5C40FF] text-white font-semibold"
                  : "bg-[#E6E6FA] text-[#5C40FF] border-2 border-[#5C40FF]"
              } hover:bg-[#5C40FF] hover:text-white`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Rendering */}
        <section className="bg-white mx-4 md:mx-0 dark:bg-screen-dark dark:text-gray-300 px-2 md:px-6 py-8 border-2 border-gray-300 dark:border-gray-600 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-[#5C40FF] ">
            {activeContent.name}
          </h1>
          <p className="mb-2 md:text-[15px] text-[14px]">
            {activeContent.content}
          </p>
          

          {activeTab === 1 && (
            <>
              

            
              <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
                {data.overview.keyFeatures.map((feature, index) => (
                  <li key={index}>
                    <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                      {feature.title}:
                    </strong>{" "}
                    {feature.description}
                    <br />
                    {feature.description1}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default DigiMarketingOverview;
