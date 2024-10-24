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

const CourseAiOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10  w-full flex justify-center items-center">
      <div className=" w-full md:w-[80%] ">
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4 ">
          <h1 className="text-[32px]  leading-10 max-w-4xl md:text-4xl  font-bold md:mb-3 mb-2 text-[#252525] dark:text-gray-100 text-center ">
            Empower Your Journey to Success in the Modern Era of AI and Data
            Science with MEDH.
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
            Medh’s Artificial Intelligence and Data Science course combines
            advanced AI techniques and technologies with the principles of Data
            Science.
            <br />
            This fusion leverages AI algorithms, models, and tools to
            efficiently analyze data, extract valuable insights, automate
            processes, and support data-driven decision-making.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0  mx-5 space-x-2 flex-wrap">
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
        <section className=" bg-white dark:bg-screen-dark px-2 mx-5 md:mx-0 md:px-6 py-8 border-2 border-gray-500 text-lightGrey14 dark:text-gray300 ">
          <h1 className="md:text-[23px] text-[22px] font-bold text-primaryColor dark:text-gray50 ">
            Why Choose the Combined AI and Data Science Course?
          </h1>
          <p className=" mb-2 md:text-[15px] text-[14px]  ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Synergy between AI and Data Science:
            </span>
            AI and Data Science are closely related fields. AI techniques, such
            as machine learning and deep learning, are essential components of
            data science. By studying them together, you can better understand
            how AI algorithms are applied to real-world data problems, making
            the learning experience more cohesive and practical.
          </p>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Real-world Relevance:
            </span>
            In the real world, AI and Data Science are often used in conjunction
            to solve complex problems and make data-driven decisions. Combining
            the two in a course allows us to see the practical applications and
            how they complement each other.
          </p>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Comprehensive Skill Set:
            </span>
            Students who take a combined AI and Data Science course can develop
            a more comprehensive skill set. They learn not only how to analyze
            and interpret data but also how to build and deploy AI models to
            gain valuable insights from that data
          </p>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Efficiency and Time-saving:
            </span>
            Offering both subjects in a single course can save time for students
            who are interested in both AI and Data Science. They don’t have to
            take separate courses for each, reducing the overall duration of
            their learning.
          </p>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1  dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Interdisciplinary Perspective:
            </span>
            AI and Data Science draw concepts and techniques from various
            disciplines, such as computer science, statistics, and
            domain-specific knowledge. Integrating them in a single course can
            help students understand the interdisciplinary nature of these
            fields and how they interact in the real world.
          </p>

          <h1 className="text-[23px] font-bold text-primaryColor  ">
            Course Features:
          </h1>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Expert-Led Instruction
            </span>
            Our course is facilitated by industry experts with extensive
            experience in AI and Data Science. They will guide you through
            complex concepts, offer real-world insights, and share practical
            tips to enhance your learning experience.
          </p>
          <p className=" mb-2 md:text-[15px]  text-[14px] ">
            <span className="text-lightGrey14 pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Interactive Learning Environment:
            </span>
            Our platform fosters an engaging and collaborative learning
            environment. Connect with fellow learners, participate in
            discussions, and exchange ideas, enhancing your overall learning
            experience.
          </p>
          <p className=" mb-2 md:text-[15px]  text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Practical Tools and Software:
            </span>
            Gain proficiency in popular tools and software used in AI and Data
            Science, such as Python, R, TensorFlow, and more. Acquiring these
            skills will make you stand out in the job market and empower you to
            tackle real-world challenges.
          </p>
          <p className=" mb-2 md:text-[15px] text-[14px] ">
            <span className="text-lightGrey14  pr-1 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Career Support:
            </span>
            We care about your success beyond the course completion. Benefit
            from career support, resume building assistance, and interview
            preparation to boost your chances of landing rewarding positions in
            the AI and Data Science industry.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CourseAiOverview;
