"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Lightbulb, GraduationCap, ArrowUp } from "lucide-react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Combining the essential disciplines of Digital Marketing with Data
            Analytics, this course is instrumental in driving business success
            in today&#39;s digital age. Here are several compelling reasons that
            underscore the exceptional value of this course:
          </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Data Empowerment",
                description:
                  "In the data-driven landscape, data analytics enables digital marketers to extract valuable insights from vast data pools, facilitating informed decision-making and campaign optimization for maximum ROI.",
              },
              {
                title: "Competitive Edge",
                description:
                  "Staying current with evolving digital marketing trends is crucial. Data analytics equips marketers to identify emerging trends, consumer behavior patterns, and market opportunities, providing a competitive advantage in the fast-paced digital arena.",
              },
              {
                title: "Personalized Marketing",
                description:
                  "By segmenting audiences based on preferences, behaviors, and demographics, data analytics facilitates the delivery of personalized and targeted marketing messages, enhancing campaign effectiveness and customer experiences.",
              },
              {
                title: "Performance Measurement",
                description:
                  "Data analytics enables precise measurement of campaign impact, tracking key performance indicators (KPIs), identifying success metrics, and optimizing resource allocation for enhanced marketing strategies.",
              },
              {
                title: "Customer Journey Insight",
                description:
                  "Marketers gain insights into the entire customer journey, from initial contact to conversion and beyond, allowing for the creation of seamless and engaging customer experiences.",
              },
              {
                title: "Career Opportunities",
                description:
                  "Professionals skilled in digital marketing and data analytics are highly sought after. This course offers diverse career prospects in marketing, advertising, market research, and business analytics.",
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
            Equipping marketers with a comprehensive skill set, this course
            empowers individuals to thrive in the digital landscape, make
            data-driven decisions, and deliver impactful results for businesses
            and organizations. It serves as a transformative learning journey,
            setting individuals on a path of continuous success in the digital
            age.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            The Digital Marketing with Data Analytics Course offers numerous
            benefits that are essential for businesses and professionals in the
            digital landscape. By integrating digital marketing and data
            analytics, this course provides a comprehensive skill set that
            empowers individuals to thrive in the modern business environment.
            Here are the key benefits of this course,
          </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Holistic Skill Set",
                description:
                  "Equips learners with a comprehensive skill set that combines the principles of digital marketing with data analytics.",
              },
              {
                title: "Data-Driven Decision Making",
                description:
                  "Enables learners to make informed decisions based on data insights rather than relying on guesswork.",
              },
              {
                title: "Enhanced Marketing Strategies",
                description:
                  "Equips learners with the ability to design and execute sophisticated marketing strategies tailored to specific target audiences.",
              },
              {
                title: "Improved Audience Targeting",
                description:
                  "Allows for precise targeting, ensuring that marketing efforts reach the right people at the right time.",
              },
              {
                title: "Optimized Campaign Performance",
                description:
                  "Acquires the skills to monitor and analyze campaign performance using data metrics.",
              },

              {
                title: "Business Growth and ROI",
                description:
                  "Data-driven marketing strategies have the potential to significantly impact business growth.",
              },
              {
                title: "Competitive Advantage",
                description:
                  "Provides a competitive advantage in the job market by leveraging data to drive marketing decisions.",
              },
              {
                title: "Career Opportunities",
                description:
                  "Opens up various career opportunities in digital marketing, data analysis, market research, and related fields.",
              },

              {
                title: "Adaptability to Industry Trends",
                description:
                  "Instills a mindset of continuous learning and adaptability to keep up with the ever-evolving digital landscape.",
              },
              {
                title: "Measuring Marketing Effectiveness",
                description:
                  "Empowers marketers to measure the effectiveness of their campaigns accurately.",
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
            Medh courses offer a comprehensive skill set that empowers learners
            to make data-driven marketing decisions, optimize campaigns, and
            achieve better results. Whether you are looking to enhance career
            prospects or contribute to the success and growth of businesses
            leveraging digital marketing in the data-centric world, our courses
            are your pathway to continuous learning and success in the digital
            age.
          </p>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Upon completing the Digital Marketing with Data Analytics Course,
            learners gain access to a wide array of dynamic and fulfilling
            career opportunities. Here are some potential career paths that
            individuals can pursue:
          </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Digital Marketing Specialist",
                description:
                  "As a digital marketing specialist, you will orchestrate and execute digital marketing campaigns across diverse channels, encompassing social media, email, search engines, and content marketing.",
              },
              {
                title: "Data Marketing Analyst",
                description:
                  "In this role, you will analyze marketing data to extract valuable insights and refine marketing strategies for enhanced performance and return on investment.",
              },
              {
                title: "SEO Analyst/Manager",
                description:
                  "As an SEO analyst or manager, your focus will be on optimizing websites and content to elevate organic search visibility and drive targeted traffic.",
              },
              {
                title: "Social Media Manager",
                description:
                  "Social media managers develop and implement social media strategies, manage social media accounts, and engage with the audience to cultivate brand presence and foster engagement.",
              },
              {
                title: "Digital Marketing Manager",
                description:
                  "Digital marketing managers supervise and synchronize all digital marketing endeavors within an organization, devising and implementing marketing plans to attain business objectives.",
              },

              {
                title: "Web Analytics Specialist",
                description:
                  "Web analytics specialists scrutinize website data and user behavior to pinpoint areas for improvement and enrich user experiences.",
              },
              {
                title: "PPC (Pay-Per-Click) Specialist",
                description:
                  "PPC specialists administer and refine pay-per-click advertising campaigns on platforms such as Google Ads and social media to drive conversions.",
              },
              {
                title: "Market Research Analyst",
                description:
                  "Market research analysts gather and analyze data to offer insights into market trends, customer behavior, and competitive landscapes.",
              },

              {
                title: "Digital Marketing Consultant",
                description:
                  "As a consultant, you can provide your expertise to businesses seeking to elevate their digital marketing efforts and data analytics strategies.",
              },
              {
                title: "Brand Manager",
                description:
                  "Brand managers devise and execute strategies to construct and sustain brand identity and reputation across digital channels.",
              },
              {
                title: "Digital Marketing Strategist",
                description:
                  "Digital marketing strategists formulate comprehensive marketing plans, integrating digital marketing and data analytics to realize business objectives.",
              },
              {
                title: "Customer Insights Analyst",
                description:
                  "Customer insights analysts scrutinize customer data to glean insights into customer behavior, preferences, and feedback.",
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
            The fusion of digital marketing and data analytics skills make
            learners indispensable to organizations striving to excel in the
            digital age. As the digital landscape continues to evolve, the
            demand for professionals proficient in these domains is anticipated
            to experience significant growth.
          </p>
        </>
      ),
    },
  ],
};

const DigiMarketingOverview = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Handle scroll to top visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  const tabIcons = {
    1: <LineChart className="w-5 h-5" />,
    2: <Lightbulb className="w-5 h-5" />,
    3: <GraduationCap className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
      
      <div className="relative container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-16"
        >
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600">
            Your Path to Achieving Success in the Digital Age
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[90%] text-[#727695] dark:text-gray-300">
            Gain expertise in using data analytics to improve digital marketing strategies. The Digital Marketing with Data Science course brings together two essential components of modern marketing—digital marketing and data analytics—allowing businesses to make informed, data-driven decisions and implement highly effective, targeted marketing campaigns.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex md:mx-0 mx-4 space-x-2 flex-wrap justify-center" 
          role="tablist"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 md:px-6 py-2 transition rounded-md flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primaryColor text-white font-semibold shadow-lg"
                  : "bg-white text-primaryColor border border-primaryColor hover:bg-primaryColor/10"
              }`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tabIcons[tab.id]}
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Rendering */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm mx-4 md:mx-auto mt-8 dark:bg-gray-800/80 px-6 py-8 border border-gray-200 dark:border-gray-700 text-lightGrey14 rounded-2xl shadow-xl"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <h2 className="text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600">
              {activeContent.name}
            </h2>
            <div className="mt-4">{activeContent.content}</div>
          </motion.section>
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-4 right-4 bg-primaryColor text-white p-3 rounded-full shadow-lg hover:bg-primaryColor/90 transition-all z-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(DigiMarketingOverview);
