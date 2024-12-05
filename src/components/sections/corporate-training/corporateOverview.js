"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Customized Training Courses",
                description:
                  "Acknowledging the unique characteristics of each company, our seasoned trainers collaborate closely to tailor training courses that effectively address your IT and other training requirements. From AI, Data Science & Analytics, Cybersecurity, Cloud computing to Digital Marketing, Personality Development, our dynamic training courses are meticulously crafted to align with your business objectives.",
              },
              {
                title: "Expert Instructors",
                description:
                  "Our trainers are seasoned IT professionals with extensive industry experience. They bring real-world insights and practical knowledge to the training sessions, ensuring that your employees receive top-notch instruction and guidance.",
              },
              {
                title: "Flexible Learning Options",
                description:
                  "We recognize that every company operates within its own scheduling constraints. Hence, we offer flexible learning options, including on-site training, virtual classrooms, and self-paced e-learning modules. This allows your employees to conveniently access our training courses, balancing learning with their regular work responsibilities.",
              },
              {
                title: "Cutting-Edge Curriculum",
                description:
                  "Our training curriculum is regularly updated to reflect the latest trends and advancements in the IT industry. By enrolling in our courses, your employees will be equipped with the most relevant and up-to-date skills, empowering them to contribute meaningfully to your company’s success.",
              },
              {
                title: "Hands-On Practical Experience",
                description:
                  "We firmly believe that experiential learning is one of the most effective ways to grasp complex IT concepts. Our training includes hands-on practical exercises and projects, enabling your employees to apply their newfound knowledge in a controlled environment.",
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
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Reach out to us today to discuss your training needs and let us
            design a customized training plan that aligns with your goals and
            aspirations. Together, let&#39;s embark on a journey of growth and
            success through our Corporate Training Solutions.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Attracting Top Talent",
                description:
                  "Organizations offering comprehensive training and development opportunities attract top-tier candidates. A positive reputation for employee growth serves as a magnet for highly skilled professionals, reducing the need for frequent recruitment efforts.",
              },
              {
                title: "Improved Employee Skills",
                description:
                  "Training courses serve to enrich employees knowledge and skills, equipping them to execute their roles with enhanced effectiveness. This leads to heightened workplace productivity and efficiency, contributing to overall organizational success.",
              },
              {
                title: "Enhanced Performance",
                description:
                  "As employees acquire new skills and knowledge, their performance ascends, fostering greater confidence and capability. Consequently, job performance improves, resulting in the delivery of high-quality outputs.",
              },
              {
                title: "Increased Engagement",
                description:
                  "Providing tailored training programs communicates a commitment to employee growth, elevating satisfaction and engagement levels. This, in turn, leads to higher retention rates and a more contented workforce.",
              },
              {
                title: "Technological Advances",
                description:
                  "Corporate training initiatives ensure that employees stay abreast of technological trends, thus bolstering the organization’s competitiveness and enabling the effective utilization of new tools and technologies.",
              },

              {
                title: "Addressing Skill Gaps",
                description:
                  "Identifying and bridging skill gaps within the workforce is a key outcome of training courses, ensuring that employees possess the expertise necessary to achieve organizational objectives.",
              },
              {
                title: "Consistency in Processes",
                description:
                  "Corporate training promotes standardization across departments, fostering improved internal collaboration, and ensuring utmost efficiency in operations.",
              },
              {
                title: "Succession Planning",
                description:
                  "Training programs aid in talent development and succession planning by identifying high-potential employees for future leadership roles, contributing to the continuity of organizational leadership.",
              },
              {
                title: "Increased Innovation",
                description:
                  "A culture of innovation thrives through continuous learning, as employees continuously developing skills generate fresh ideas and innovative solutions to challenges.",
              },

              {
                title: "Improved Reputation",
                description:
                  "Employers investing in employee growth are perceived as more attractive. A positive reputation serves to draw top talent, enhancing the company’s market position.",
              },
              {
                title: "Building Corporate Culture",
                description:
                  "An impactful training program that aligns values and strategies strengthens corporate culture, demonstrating to employees their significance and value within the company.",
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
      name: "What You'll Gain",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            By enrolling in MEDH&#39;s Corporate Training Programs for your
            employees, your company stands to gain a multitude of benefits,
            including:
          </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Increased Productivity",
                description:
                  "Empower your team with the latest tools and strategies, enabling them to work more efficiently and enhance their overall output. By honing their skills and knowledge, employees become better equipped to contribute to the company’s productivity and success.",
              },
              {
                title: "Elevated Performance",
                description:
                  "Witness your employees evolve into high-performing professionals, ready to take on any challenge. Through our tailored training programs, your workforce will gain the necessary skills and confidence to excel in their roles, ultimately elevating the overall performance of your organization.",
              },
              {
                title: "Talent Retention",
                description:
                  "Cultivate a culture of continuous learning and growth within your company, attracting and retaining top talent in your industry. Offering robust training opportunities communicates a commitment to employee development, making your organization an appealing and rewarding place to work.",
              },
              {
                title: "Increased Cross-Functional Collaboration",
                description:
                  "Training encourages employees to acquire a broader understanding of various functions within the organization, promoting cross-functional collaboration and knowledge sharing.",
              },
              {
                title: "Strengthened Leadership",
                description:
                  "Effective training programs can identify and nurture future leaders within the organization, fostering a pipeline of capable individuals who can step into leadership roles when needed.",
              },
              {
                title: "Enhanced Adaptability",
                description:
                  "Training equips employees with the skills and knowledge to adapt to changing market dynamics, technological advancements, and evolving customer needs, enabling the organization to stay agile and responsive.",
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
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            By investing in MEDH&#39;s Corporate Training Programs, your company
            can expect a more efficient and skilled workforce, heightened
            employee performance, and a competitive edge in talent retention
            within the industry.
          </p>
        </>
      ),
    },
  ],
};

const CorporateOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10  w-full flex justify-center items-center">
      <div className="w-full md:w-[80%]">
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
          <h1 className="text-[24px] w-[70%] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 text-[#7ECA9D] dark:text-gray-50">
            Gain a competitive edge with Medh&#39;s <br /> Corporate Training
            Courses
          </h1>
          <p className="text-center md:text-[1.2rem] text-gray-600 text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
            meticulously designed to align with your company&#39;s vision and
            mission. Our SMART (Specific, Measurable, Achievable, Relevant, and
            Time-bound), approach ensures that the training is catering to your
            unique organizational goals.
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

export default CorporateOverview;
