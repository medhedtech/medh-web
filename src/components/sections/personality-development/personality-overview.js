"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, Briefcase, ArrowUp } from "lucide-react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Introducing{" "}
            <span className="text-lightGrey14 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Medh&#39;s Personality Development Courses{" "}
            </span>{" "}
            that offers practical insights and techniques to enhance confidence,
            communication, and leadership capabilities for personal and
            professional success.
          </p>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            <span className="text-lightGrey14 dark:text-gray50 md:text-[1rem] text-[15px] font-bold tracking-wide ">
              Tailored for diverse range of Age Groups:
            </span>{" "}
            From preschoolers, school students, college students, professionals,
            and homemakers, providing unique and engaging content designed to
            enhance their confidence, communication, and leadership skills.
          </p>
          <h2 className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50 ">
            Key Features:
          </h2>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
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
                  "Build a strong sense of self-assurance to tackle life's challenges.",
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
                description:
                  "Develop empathy and resilience for better well-being.",
              },
              {
                title: "Adaptability and Resilience",
                description:
                  "Acquire skills to thrive in dynamic environments.",
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
            Join us to experience a holistic approach to personal development,
            empowering individuals across age groups with essential life skills
            for success and fulfillment.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <p className="text-lightGrey14 md:text-[15px] text-[14px] dark:text-gray300 mb-4">
            Personality Development for Personal and Professional Empowerment,
          </p>
          <ul className="list-disc pl-4 dark:text-gray300">
            <li>
              <strong>Enhance Professional Success:</strong> Develop essential
              communication, leadership, and problem-solving skills to excel in
              your career.
            </li>
            <li>
              <strong>Cultivate Mental Health and Well-being:</strong>{" "}
              Strengthen self-confidence, decision-making, and work-life balance
              for holistic growth.
            </li>
            <li>
              <strong>Diverse Career Opportunities:</strong> Explore roles as a
              career coach, organizational consultant, soft skills trainer, and
              more.
            </li>
            <li>
              <strong>Achieve Personal and Professional Growth:</strong> Acquire
              a growth mindset to progress in your career and pursue new
              possibilities.
            </li>
            <li>
              <strong>Embrace Adaptability and Lifelong Learning:</strong>{" "}
              Embark on a journey of continuous skill development and
              perspective expansion.
            </li>
          </ul>
          <p className="text-lightGrey14 mt-4 md:text-[15px] text-[14px] dark:text-gray300">
            Each course is tailored to meet the specific developmental needs and
            learning styles of all participants, ensuring a comprehensive and
            enriching learning experience.
          </p>
          <div className="mt-4">
            <p className="text-lightGrey14 md:text-[15px] text-[14px] dark:text-gray300">
              <strong>For Preschoolers and School-Age Children:</strong>
            </p>
            <ul className="list-disc pl-4 dark:text-gray300">
              <li>
                Developing strong interpersonal skills and confidence from an
                early age
              </li>
              <li>
                Building a solid foundation for personal growth and
                self-discovery
              </li>
            </ul>
            <p className="text-lightGrey14 mt-4 md:text-[15px] text-[14px] dark:text-gray300">
              <strong>For College Students and Young Professionals:</strong>
            </p>
            <ul className="list-disc pl-4 dark:text-gray300">
              <li>
                Honing critical soft skills like communication, leadership, and
                problem-solving
              </li>
              <li>
                Empowering career-readiness and unlocking new opportunities
              </li>
            </ul>
            <p className="text-lightGrey14 mt-4 md:text-[15px] text-[14px] dark:text-gray300">
              <strong>For Mid-Career Professionals:</strong>
            </p>
            <ul className="list-disc pl-4 dark:text-gray300">
              <li>Refining personal brand and presence for greater impact</li>
              <li>
                Reinvigorating passion and drive through transformative
                self-development
              </li>
            </ul>
            <p className="text-lightGrey14 mt-4 md:text-[15px] text-[14px] dark:text-gray300">
              <strong>For Homemakers:</strong>
            </p>
            <ul className="list-disc pl-4 dark:text-gray300">
              <li>
                Rediscovering purpose and drive through transformative
                self-development
              </li>
              <li>Exploring personal interests and passions.</li>
            </ul>
            <p className="text-lightGrey14 md:text-[15px] text-[14px] dark:text-gray300 my-4">
              Our experienced instructors and engaging multimedia content ensure
              an enriching learning experience. Our comprehensive course aims to
              equip learners with the essential skills needed to navigate life
              successfully, fostering personal growth, resilience, and a
              positive self-image.
            </p>
          </div>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            The career prospects of a Personality Development Course are vast
            and impactful, offering individuals the opportunity to enhance their
            personal and professional lives. By developing essential life skills
            and strengthening interpersonal abilities, individuals can unlock
            various career opportunities and personal growth.
          </p>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Enhanced Professional Success",
                description:
                  "The application of personality development skills can significantly contribute to professional success. Individuals equipped with improved communication, leadership, and problem-solving skills are better positioned to thrive in their careers and effectively navigate workplace challenges.",
              },
              {
                title: "Mental Health and Well-being",
                description:
                  "Personality development not only impacts professional success but also plays a pivotal role in enhancing mental health, decision-making abilities, self-confidence, and overall well-being. These attributes are invaluable in maintaining a healthy work-life balance and addressing personal development.",
              },
              {
                title: "Career Opportunities",
                description:
                  "The comprehensive development offered by personality development courses prepares individuals for diverse career paths. From corporate consultancy to educational roles, professionals in this field can serve as career coaches, executive coaches, organizational development consultants, facilitators, counselors, trainers of soft skills, and spoken English tutors.",
              },
              {
                title: "Personal and Professional Growth",
                description:
                  "The holistic approach of such courses ensures that individuals can excel in both personal and professional realms. By honing their skills and acquiring a growth mindset, learners are empowered to progress in their careers and pursue new opportunities.",
              },
              {
                title: "Adaptability and Lifelong Learning:",
                description:
                  "Personality development courses instill a growth mindset, emphasizing the value of continuous learning and adaptability. Individuals are encouraged to develop new skills, expand their perspectives, and remain open to personal and professional advancement.",
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
            In summary, the career prospects of a Personality Development Course
            are multifaceted, offering a pathway to professional success,
            personal fulfillment, and continuous growth. These courses provide
            individuals with the tools and mindset necessary to thrive in
            today&#39;s dynamic and interconnected world.
          </p>
        </>
      ),
    },
  ],
};

const PersonalityOverview = () => {
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
    1: <BookOpen className="w-5 h-5" />,
    2: <Brain className="w-5 h-5" />,
    3: <Briefcase className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10" />
      
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
            Welcome to Medh&#39;s Transformative Personality Development Course
          </h1>
          <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
            Our course is designed to foster crucial life skills and character traits, offering inclusivity for individuals at every stage of life.
            Whether you&#39;re a student, professional, or homemaker, this program empowers you with essential life skills, confidence, and interpersonal abilities.
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

export default memo(PersonalityOverview);
