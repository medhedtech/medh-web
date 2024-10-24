"use client";

import React, { useState } from "react";
const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content:
        "Vedic Mathematics Course offers a wide array of benefits, from simplifying complex calculations to enhancing mental agility and boosting confidence. The system’s versatility and applicability across various branches of mathematics make it a valuable tool for individuals preparing for competitive exams or seeking to improve their mathematical skills. ",
    },
    {
      id: 2,
      name: "Benefits",
      content:
        "Benefits of Vedic Mathematics include improved speed in calculations, better mental agility, and stronger problem-solving skills. It's highly beneficial for students preparing for competitive exams.",
    },
    {
      id: 3,
      name: "What You'll Gain",
      content:
        "Vedic Mathematics provides excellent career prospects for those aiming to excel in mathematics, teaching, tutoring, and competitive exams.",
    },
  ],
  overview: {
    keyFeatures: [
      {
        title: "Customized Training Courses",
        description:
          "Acknowledging the unique characteristics of each company, our seasoned trainers collaborate closely to tailor training courses that effectively address your IT and other training requirements. From AI, Data Science & Analytics, Cybersecurity, Cloud computing to Digital Marketing, Personality Development, our dynamic training courses are meticulously crafted to align with your business objectives.",
      },
      {
        title: "Expert Instructors",
        description:
          " Our trainers are seasoned IT professionals with extensive industry experience. They bring real-world insights and practical knowledgeto the training sessions, ensuring that your employees receive top-notch instruction and guidance.",
      },
      {
        title: "Flexible Learning Options",
        description:
          "We recognize that every company operates within its own scheduling constraints. Hence, we offer flexible learning options,including on-site training, virtual classrooms, and self-paced e-learning modules. This allows your employees to conveniently access our training courses,balancing learning with their regular work responsibilities.",
      },
      {
        title: "Cutting-Edge Curriculum ",
        description:
          "Our training curriculum is regularly updated to reflect the latest trends and advancements in the IT industry. By enrolling in ourcourses, your employees will be equipped with the most relevant and up-to-date skills, empowering them to contribute meaningfully to your company’s success.",
      },
      {
        title: "Hands-On Practical Experience  ",
        description:
          "Hands-On Practical Experience: We firmly believe that experiential learning is one of the most effective ways to grasp complex IT concepts. Our training advancements in the IT industry. By enrolling in ourcourses, your employees will be equipped with the most relevant and up-to-date skills, empowering them to contribute meaningfully to your company’s success.",
        descript:
          "Reach out to us today to discuss your training needs and let us design a customized training plan that aligns with your goals and aspirations. Together,let’s embark on a journey of growth and success through our Corporate Training Solutions.",
      },
    ],
  },
};

export default function CorporateOverview() {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto pt-10 pb-6 w-full flex justify-center items-center px-1 md:px-0">
      <div className="w-full md:w-[80%]">
        {/* Title */}
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
          <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-3 mb-2 dark:text-white text-[#000000]">
            Gain a competitive edge with Medh's Corporate Training Courses
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] dark:text-gray300 text-[#727695]">
            Our SMART (Specific, Measurable, Achievable, Relevant, and
            Time-bound), approach ensures that the training is catering to your
            unique organizational goals.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0  mx-4 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-2 md:px-6 md:py-2 py-1 transition md:mb-0 ${
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
        <section className="bg-white dark:bg-inherit px-2 mx-4 md:mx-0 md:px-6 py-8 border-2 border-gray-300 dark:border-gray600 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-[#5F2DED] ">
            {activeContent.name}
          </h1>

          {activeTab === 1 && (
            <>
              {/* Key Features */}

              <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
                {data.overview.keyFeatures.map((feature, index) => (
                  <li key={index}>
                    <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                      {feature.title}:
                    </strong>{" "}
                    {feature.description} <br />
                    {feature.descript}
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
