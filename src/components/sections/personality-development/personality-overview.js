"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, User, ArrowUp, Heart, Brain, Lightbulb, Briefcase, Search, BookOpen as Book } from "lucide-react";

// Create a reusable ListItem component for better UI
const ListItem = memo(({ feature, index }) => (
  <motion.li 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="mb-4 p-4 border-l-4 border-primaryColor/50 hover:border-primaryColor bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all"
  >
    <strong className="text-[1rem] font-bold tracking-wide text-primaryColor dark:text-gray-50 block mb-1">
      {feature.title}:
    </strong>
    <p className="text-gray-700 dark:text-gray-300 text-[14px] md:text-[15px]">
      {feature.description}
    </p>
  </motion.li>
));

ListItem.displayName = "ListItem";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed"
          >
            Introducing{" "}
            <span className="text-gray-800 dark:text-gray-50 md:text-[1.1rem] text-[16px] font-bold tracking-wide">
              Medh&#39;s Personality Development Courses{" "}
            </span>{" "}
            that offers practical insights and techniques to enhance confidence,
            communication, and leadership capabilities for personal and
            professional success.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed"
          >
            <span className="text-gray-800 dark:text-gray-50 md:text-[1.1rem] text-[16px] font-bold tracking-wide">
              Tailored for diverse range of Age Groups:
            </span>{" "}
            From preschoolers, school students, college students, professionals,
            and homemakers, providing unique and engaging content designed to
            enhance their confidence, communication, and leadership skills.
          </motion.p>

          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[1.4rem] font-bold mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primaryColor to-blue-600"
          >
            Key Features:
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ul className="list-none space-y-4">
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
                <ListItem key={index} feature={feature} index={index} />
              ))}
            </ul>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 dark:text-gray-300 mt-8 mb-6 md:text-[16px] text-[15px] leading-relaxed bg-primaryColor/5 dark:bg-primaryColor/10 p-4 rounded-lg border-l-4 border-primaryColor"
          >
            Join us to experience a holistic approach to personal development,
            empowering individuals across age groups with essential life skills
            for success and fulfillment.
          </motion.p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      icon: <Heart className="w-5 h-5" />,
      content: (
        <>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 md:text-[16px] text-[15px] mb-6 leading-relaxed font-medium"
          >
            Personality Development for Personal and Professional Empowerment
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-r from-primaryColor/20 to-blue-500/20 dark:from-primaryColor/30 dark:to-blue-500/30 p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Key Benefits</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primaryColor/10 p-2 text-primaryColor dark:text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-100">Enhance Professional Success:</strong>{" "}
                    <span className="text-gray-700 dark:text-gray-300">Develop essential communication, leadership, and problem-solving skills to excel in your career.</span>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primaryColor/10 p-2 text-primaryColor dark:text-blue-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-100">Cultivate Mental Health and Well-being:</strong>{" "}
                    <span className="text-gray-700 dark:text-gray-300">Strengthen self-confidence, decision-making, and work-life balance for holistic growth.</span>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primaryColor/10 p-2 text-primaryColor dark:text-blue-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-100">Diverse Career Opportunities:</strong>{" "}
                    <span className="text-gray-700 dark:text-gray-300">Explore roles as a career coach, organizational consultant, soft skills trainer, and more.</span>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primaryColor/10 p-2 text-primaryColor dark:text-blue-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-100">Achieve Personal and Professional Growth:</strong>{" "}
                    <span className="text-gray-700 dark:text-gray-300">Acquire a growth mindset to progress in your career and pursue new possibilities.</span>
                  </div>
                </motion.li>

                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primaryColor/10 p-2 text-primaryColor dark:text-blue-400">
                    <Book className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-100">Embrace Adaptability and Lifelong Learning:</strong>{" "}
                    <span className="text-gray-700 dark:text-gray-300">Embark on a journey of continuous skill development and perspective expansion.</span>
                  </div>
                </motion.li>
              </ul>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed"
          >
            Each course is tailored to meet the specific developmental needs and
            learning styles of all participants, ensuring a comprehensive and
            enriching learning experience.
          </motion.p>

          {/* Age Groups Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">For Preschoolers and School-Age Children</h3>
              </div>
              <ul className="space-y-2 pl-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Developing strong interpersonal skills and confidence from an early age</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Building a solid foundation for personal growth and self-discovery</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">For College Students and Young Professionals</h3>
              </div>
              <ul className="space-y-2 pl-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Honing critical soft skills like communication, leadership, and problem-solving</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Empowering career-readiness and unlocking new opportunities</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">For Mid-Career Professionals</h3>
              </div>
              <ul className="space-y-2 pl-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Refining personal brand and presence for greater impact</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Reinvigorating passion and drive through transformative self-development</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">For Homemakers</h3>
              </div>
              <ul className="space-y-2 pl-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Rediscovering purpose and drive through transformative self-development</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 text-primaryColor">•</div>
                  <span>Exploring personal interests and passions</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-700 dark:text-gray-300 md:text-[16px] text-[15px] my-6 leading-relaxed p-4 bg-primaryColor/5 dark:bg-primaryColor/10 rounded-lg"
          >
            Our experienced instructors and engaging multimedia content ensure
            an enriching learning experience. Our comprehensive course aims to
            equip learners with the essential skills needed to navigate life
            successfully, fostering personal growth, resilience, and a
            positive self-image.
          </motion.p>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      icon: <Briefcase className="w-5 h-5" />,
      content: (
        <>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed"
          >
            The career prospects of a Personality Development Course are vast
            and impactful, offering individuals the opportunity to enhance their
            personal and professional lives. By developing essential life skills
            and strengthening interpersonal abilities, individuals can unlock
            various career opportunities and personal growth.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ul className="list-none space-y-4">
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
                  title: "Adaptability and Lifelong Learning",
                  description:
                    "Personality development courses instill a growth mindset, emphasizing the value of continuous learning and adaptability. Individuals are encouraged to develop new skills, expand their perspectives, and remain open to personal and professional advancement.",
                },
              ].map((feature, index) => (
                <ListItem key={index} feature={feature} index={index} />
              ))}
            </ul>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-gray-700 dark:text-gray-300 mt-8 mb-6 md:text-[16px] text-[15px] leading-relaxed p-4 bg-gradient-to-r from-primaryColor/10 to-blue-500/10 dark:from-primaryColor/20 dark:to-blue-500/20 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            In summary, the career prospects of a Personality Development Course
            are multifaceted, offering a pathway to professional success,
            personal fulfillment, and continuous growth. These courses provide
            individuals with the tools and mindset necessary to thrive in
            today&#39;s dynamic and interconnected world.
          </motion.p>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-8 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3">
              Ready to Transform Your Life?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our Personality Development Course today and unlock your full potential. Develop essential skills that will benefit you personally and professionally.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enroll Now
            </motion.button>
          </motion.div>
        </>
      ),
    },
  ],
};

const PersonalityOverview = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    // Scroll to content section when tab changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Handle scroll to top visibility with debouncing for performance
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    // Debounced scroll handler for better performance
    let timeoutId;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]">
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20" />
      
      {/* Loading overlay with animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-primaryColor border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero section with enhanced animations */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[24px] text-center leading-8 md:text-4xl font-bold md:mb-4 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600"
          >
            Welcome to Medh&#39;s Transformative Personality Development Course
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center md:text-[16px] text-[15px] leading-6 md:leading-7 md:w-[80%] text-gray-600 dark:text-gray-300"
          >
            Our course is designed to foster crucial life skills and character
            traits, offering inclusivity for individuals at every stage of life.
            Whether you&#39;re a student, professional, or homemaker, this
            program empowers you with essential life skills, confidence, and
            interpersonal abilities.
          </motion.p>
        </motion.div>

        {/* Enhanced Tabs with better interactions */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex md:mx-0 mx-4 space-x-3 flex-wrap justify-center" 
          role="tablist"
          aria-label="Personality Development course tabs"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 md:px-8 py-3 transition-all duration-300 rounded-xl flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white font-semibold shadow-lg"
                  : "bg-white text-primaryColor border border-primaryColor/50 hover:bg-primaryColor/10 dark:bg-gray-800 dark:text-white dark:border-primaryColor/30"
              }`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              {tab.name}
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 animate-pulse" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Content Rendering with glass morphism effect */}
        <AnimatePresence mode="wait">
          <motion.section
            ref={contentRef}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-md mx-4 md:mx-auto mt-8 dark:bg-gray-800/90 px-6 py-8 md:px-8 md:py-10 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeContent.content}
          </motion.section>
        </AnimatePresence>

        {/* Enhanced Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-primaryColor to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalityOverview;
