"use client";

import React, { useState } from "react";

const Section = ({ title, data }) => (
  <section className="mt-8">
    <div className="px-0 pl-6 flex flex-col md:flex-row border border-gray300 rounded-md shadow bg-white dark:bg-gray800 dark:border-gray700">
      {/* Left Section */}
      <div className="w-full md:w-[30%] pr-4 flex justify-start items-center text-center border-r border-gray300 dark:border-gray700">
        <h2 className="text-[1rem] font-bold tracking-wide dark:text-gray50">
          {title}
        </h2>
      </div>
      {/* Right Section */}
      <div className="w-full md:w-[70%] flex flex-col justify-center py-4 pl-0">
        <div className="flex flex-col divide-y divide-gray300 dark:divide-gray700">
          {data.map((item, index) => (
            <p key={index} className="mb-0 py-2 pl-6">
              <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                {item.label}:
              </strong>{" "}
              {item.content}
            </p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const sections = [
  {
    title: "Data Management",
    data: [
      { label: "Role", content: "Data Scientist, Data Engineer" },
      {
        label: "Responsibilities",
        content: "Gathering, cleaning, transforming, and storing data.",
      },
      {
        label: "Skills Needed",
        content: "Data wrangling, ETL processes, database management.",
      },
    ],
  },
  {
    title: "Data Analysis",
    data: [
      { label: "Role", content: "Data Analyst, Business Analyst" },
      {
        label: "Responsibilities",
        content:
          "Identifying trends, patterns, and relationships in large data sets.",
      },
      {
        label: "Skills Needed",
        content: "Statistical analysis, data visualization, SQL, Python, R.",
      },
    ],
  },
  {
    title: "Tool Development",
    data: [
      { label: "Role", content: "AI Engineer, Machine Learning Engineer" },
      {
        label: "Responsibilities",
        content:
          "Developing and improving intelligent algorithms and tools to be robust, flexible, and scalable.",
      },
      {
        label: "Skills Needed",
        content:
          "Algorithm development, software engineering, TensorFlow, PyTorch.",
      },
    ],
  },
  {
    title: "Machine Learning",
    data: [
      { label: "Role", content: "Machine Learning Scientist, AI Specialist" },
      {
        label: "Responsibilities",
        content:
          "Training and testing tools and applications on relevant, clean data.",
      },
      {
        label: "Skills Needed",
        content: "Model training, hyperparameter tuning, deep learning.",
      },
    ],
  },
  {
    title: "Communication",
    data: [
      {
        label: "Role",
        content: "Data Storyteller, Data Visualization Specialist",
      },
      {
        label: "Responsibilities",
        content:
          "Interpreting, visualizing, and communicating essential findings from data analysis.",
      },
      {
        label: "Skills Needed",
        content:
          "Data visualization tools (e.g., Tableau, Power BI), storytelling, presentation skills.",
      },
    ],
  },
  {
    title: "Decision-Making",
    data: [
      { label: "Role", content: "Decision Scientist, Strategic Analyst" },
      {
        label: "Responsibilities",
        content: "Supporting and improving the decision-making process.",
      },
      {
        label: "Skills Needed",
        content:
          "Decision analysis, business intelligence, strategic planning.",
      },
    ],
  },
];

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Why Choose the Combined AI and Data Science Course?
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Synergy between AI and Data Science",
                description:
                  "AI and Data Science are closely related fields. AI techniques, such as machine learning and deep learning, are essential components of data science. By studying them together, you can better understand how AI algorithms are applied to real-world data problems, making the learning experience more cohesive and practical.",
              },
              {
                title: "Real-world Relevance",
                description:
                  "In the real world, AI and Data Science are often used in conjunction to solve complex problems and make data-driven decisions. Combining the two in a course allows us to see the practical applications and how they complement each other.",
              },
              {
                title: "Comprehensive Skill Set",
                description:
                  "Students who take a combined AI and Data Science course can develop a more comprehensive skill set. They learn not only how to analyze and interpret data but also how to build and deploy AI models to gain valuable insights from that data.",
              },
              {
                title: "Efficiency and Time-saving",
                description:
                  "Offering both subjects in a single course can save time for students who are interested in both AI and Data Science. They don’t have to take separate courses for each, reducing the overall duration of their learning.",
              },
              {
                title: "Interdisciplinary Perspective",
                description:
                  "AI and Data Science draw concepts and techniques from various disciplines, such as computer science, statistics, and domain-specific knowledge. Integrating them in a single course can help students understand the interdisciplinary nature of these fields and how they interact in the real world.",
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

          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Course Features:
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Expert-Led Instruction",
                description:
                  "Our course is facilitated by industry experts with extensive experience in AI and Data Science. They will guide you through complex concepts, offer real-world insights, and share practical tips to enhance your learning experience.",
              },
              {
                title: "Hands-on Projects",
                description:
                  "Theory alone won’t suffice in this ever-evolving domain. That’s why we emphasize hands-on projects that allow you to apply your knowledge to real-world scenarios. Through these projects, you’ll gain the confidence to tackle AI and Data Science challenges head-on.",
              },
              {
                title: "Interactive Learning Environment",
                description:
                  "Our platform fosters an engaging and collaborative learning environment. Connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
              },
              {
                title: "Practical Tools and Software",
                description:
                  "Gain proficiency in popular tools and software used in AI and Data Science, such as Python, R, TensorFlow, and more. Acquiring these skills will make you stand out in the job market and empower you to tackle real-world challenges.",
              },
              {
                title: "Career Support",
                description:
                  "We care about your success beyond the course completion. Benefit from career support, resume building assistance, and interview preparation to boost your chances of landing rewarding positions in the AI and Data Science industry.",
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
      id: 2,
      name: "Benefits",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Comprehensive Curriculum",
                description:
                  "The AI and Data Science course offers a well-rounded education in machine learning, deep learning, statistical analysis, data visualization, natural language processing, and more. This diverse skill set equips you to address complex real-world data science challenges effectively.",
              },
              {
                title: "Flexibility and Convenience",
                description:
                  "The flexibility to access course material anywhere, anytime is advantageous for busy working professionals and students, enabling learning at their own pace without sacrificing other commitments. The absence of a rigid class schedule allows learners to review challenging concepts and focus more on intriguing areas.",
              },
              {
                title: "Hands-on Projects and Practical Experience",
                description:
                  "Emphasizing hands-on learning, we focus on projects and real-world applications. Working with practical assignments and real datasets, you’ll gain invaluable experience in AI algorithm implementation, data pattern exploration, and insightful analysis. This experiential approach equips you to excel in data science roles that demand both theoretical knowledge and practical expertise.",
              },
              {
                title: "Expert Instruction and Mentorship",
                description:
                  "Our virtual classroom is led by industry experts and experienced data scientists, enriching your learning journey with practical insights. Access to these seasoned professionals guarantees high-quality instruction and mentorship. They provide personalized guidance, answer questions, and share industry best practices, empowering you to excel as a proficient AI and Data Science professional.",
              },
              {
                title: "Networking Opportunities",
                description:
                  "Our diverse learner cohort fosters valuable networking chances. Engaging with peers, participating in discussions, and collaborating on projects can lead to meaningful industry connections. Networking enhances knowledge and opens doors to potential job offers or collaborations in the future.",
              },
              {
                title: "Career Advancement",
                description:
                  "The rising demand for AI and Data Science experts in healthcare, finance, marketing, e-commerce, and other industries is evident. Completing an online course that equips you with these skills enhances employability and career prospects. Whether switching careers or seeking advancement, a strong foundation in AI and Data Science sets you apart in the job market.",
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
      name: "Career Prospects",
      content: (
        <>
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Career Prospects: Unlock Limitless Opportunities with AI and Data
            Science Course
          </h1>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            In today&#39;s rapidly evolving technological landscape, the demand
            for professionals with expertise in Data Science and AI is
            skyrocketing. As computational power and data volumes continue to
            expand, the need for skilled individuals in these fields will only
            grow. Our AI and Data Science course equips you with the knowledge
            and skills to capitalize on a wide range of career opportunities
            across various industries, including engineering, medicine, and
            finance. Whether you aim to pursue a role in industry, government,
            or academia, this course sets you on the path to success.
          </p>

          <div>
            <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
              Career Opportunities in AI and Data Science
            </h1>
            {sections.map((section, index) => (
              <Section key={index} title={section.title} data={section.data} />
            ))}
          </div>

          <h1 className="text-[23px] pt-8 font-bold text-primaryColor dark:text-gray50">
            Who Should Enroll in This Course?
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Aspiring Data Scientists",
                description:
                  "If you are fascinated by data and aspire to become a Data Scientist, this course provides the ideal launching pad for your career. You’ll gain the foundational and advanced skills needed to analyze data, build models, and generate insights that drive business decisions.",
              },
              {
                title: "AI Enthusiasts",
                description:
                  "Whether you're an AI hobbyist or an enthusiast seeking to delve deeper into AI and its applications, this course will nurture your passion and enhance your expertise. You’ll explore cutting-edge AI technologies and learn how to apply them to solve real-world problems.",
              },
              {
                title: "Professionals Seeking to Upskill",
                description:
                  "If you are already working in the tech industry and wish to upskill in AI and Data Science, our course offers a convenient and efficient way to do so. Enhance your current skill set with the latest AI and data science techniques to stay competitive in the job market.",
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

const CourseAiOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-6  w-full flex justify-center items-center">
      <div className="w-full md:w-[80%]">
        <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
          <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-3 mb-2 text-[#41454F] dark:text-gray-50">
            Welcome to Medh&#39;s Transformative Personality Development Course
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
            Our course is designed to foster crucial life skills and character
            traits, offering inclusivity for individuals at every stage of life.
            Whether you&#39;re a student, professional, or homemaker, this
            program empowers you with essential life skills, confidence, and
            interpersonal abilities.
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

export default CourseAiOverview;
