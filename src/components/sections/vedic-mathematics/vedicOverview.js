"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content:
        "Vedic Mathematics Course offers a wide array of benefits, from simplifying complex calculations to enhancing mental agility and boosting confidence. The system&#39;s versatility and applicability across various branches of mathematics make it a valuable tool for individuals preparing for competitive exams or seeking to improve their mathematical skills. ",
         contents:"With its emphasis on simplicity, speed, and universality, Vedic Mathematics has the potential to transform the way individuals perceive and engage with mathematics, making it an essential skill for personal and professional growth.",
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
    {
      id: 4,
      name: "Sutras and Sub sutras",
      content:
        "This section covers the fundamental principles (sutras) and detailed applications (sub-sutras) for effective problem-solving in mathematics.",
    },
  ],
  overview: {
    keyFeatures: [
      {
        title: "Simplicity",
        description: "Aims to simplify complex mathematical calculations through its unique techniques.",
      },
      {
        title: "Speed",
        description:
          "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
      },
      {
        title: "Versatility",
        description:
          "Offers multiple approaches to solve a single problem, allowing users to choose the method that suits them best.",
      },
      {
        title: "Universality",
        description:
          "Applicable to various branches of mathematics, such as arithmetic, algebra, trigonometry, calculus, and more.",
      },
    ],
  },
};

const PersonalityOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10 w-full flex justify-center items-center">
      <div className="w-full md:w-[80%]">
        {/* Title */}
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
          <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-3 mb-2 dark:text-gray50 text-[#41454F]">
            Welcome to Medh&#39;s Vedic Mathematics Course
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray300">
            Our course is designed to simplify mathematical problems through ancient techniques that can be applied to a variety of real-world applications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0 mx-4  flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 md:px-6 mr-2 md:py-2 py-1 transition md:mb-0 mb-1 ${
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
        <section className="bg-white dark:text-gray300 dark:bg-screen-dark px-5 mx-4 sm:mx-0 md:px-6 py-8 border-2 border-gray300 dark:border-gray600 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-[#5C40FF] dark:text-gray50">
            {activeContent.name}
          </h1>
          <p className="mb-2 md:text-[15px] text-[14px] ">
            {activeContent.content}
          </p>
          <p className="mb-2 md:text-[15px] text-[14px]">
            {activeContent.contents}
          </p>

          {activeTab === 1 && (
            <>
              {/* Transformative Learning Experience */}
              <h2 className="text-[1.3rem] font-bold mb-3 tracking-wide dark:text-gray50">
                Transformative Learning Experience
              </h2>
              <p className="mb-2 text-[14px]">
                In today&#39;s competitive world, the ability to solve problems quickly is crucial, and that&#39;s where Vedic Mathematics comes to your rescue. Through interactive and easy-to-follow lessons and practice exercises, you will learn powerful techniques that make math easy and enjoyable, including:
              </p>
              <ul className=" list-none mb-4 ">
                <li className="text-[14px] ml-8">
                  <strong className="dark:text-gray50">Easy Tricks to Solve:</strong> Addition, Subtraction, Multiplication, and Division
                </li>
                <li className="text-[14px] ml-8 ">
                  <strong className="dark:text-gray50">Fast & Accurate Calculations of:</strong> Square Root, Cube, Cube Root, HCF, LCM, and Algebra
                </li>
              </ul>
              <p className="text-[14px] mb-6">
                And lots of other lessons that help you fall in love with Mathematics.
              </p>

              {/* Key Features */}
              <h2 className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50">
                Key Features of Vedic Mathematics:
              </h2>
              <ul className="list-none list-inside space-y-2 pb-2">
                {data.overview.keyFeatures.map((feature, index) => (
                  <li key={index}>
                    <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
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
