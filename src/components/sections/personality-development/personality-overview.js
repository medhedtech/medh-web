"use client";

import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  User, 
  ArrowUp, 
  Heart, 
  Brain, 
  Lightbulb, 
  Briefcase, 
  Search, 
  BookOpen as Book,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

// Create a reusable ListItem component for better UI
const ListItem = memo(({ feature, index }) => (
  <motion.li 
    key={index}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="mb-3 md:mb-4 p-2 md:p-3 border-l-4 border-primaryColor/50 hover:border-primaryColor bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all mx-auto text-center"
  >
    <strong className="text-[0.95rem] md:text-[1rem] font-bold tracking-wide text-primaryColor dark:text-gray50 block mb-1">
      {feature.title}
    </strong>
    <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
      {feature.description}
    </p>
  </motion.li>
));

ListItem.displayName = "ListItem";

// Create a new StatCard component for visual statistics
const StatCard = memo(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-5 flex flex-col items-center text-center mx-auto"
  >
    <motion.div 
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
      className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-1 md:mb-2"
    >
      {stat.value}
    </motion.div>
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{stat.label}</h3>
    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
  </motion.div>
));

StatCard.displayName = "StatCard";

// Create a reusable accordion component
const Accordion = memo(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mx-auto max-w-3xl">
      <button
        className={`w-full flex justify-between items-center p-3 md:p-4 text-center transition-all duration-300 ${
          isOpen 
            ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white dark:from-primaryColor dark:to-blue-500 font-semibold shadow-md" 
            : "bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-800/70 text-gray-800 dark:text-gray-200 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        } ${titleClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[16px] md:text-[18px] flex items-center">
          <span className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${
            isOpen 
              ? "bg-white animate-pulse" 
              : "bg-primaryColor/60 dark:bg-primaryColor/80"
          }`}></span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-center rounded-full ${
            isOpen 
              ? "bg-white/20 dark:bg-white/20" 
              : "bg-primaryColor/10 dark:bg-primaryColor/20"
          } w-6 h-6 md:w-7 md:h-7`}
        >
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${
            isOpen ? "text-white" : "text-primaryColor dark:text-primaryColor"
          }`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0.5 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`p-3 md:p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border-t border-gray-200 dark:border-gray-700 text-center ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Accordion.displayName = "Accordion";

const personalityStats = [
  { label: "Career Growth", value: "80%", description: "Professionals see career advancement" },
  { label: "Leadership Skills", value: "95%", description: "Report improved leadership abilities" },
  { label: "Communication", value: "92%", description: "Enhance their communication skills" },
  { label: "Self-confidence", value: "88%", description: "Develop better self-esteem and confidence" }
];

const ageGroups = [
  { name: "School Students", benefit: "Building foundational social skills & confidence" },
  { name: "College Students", benefit: "Developing career readiness & leadership abilities" },
  { name: "Professionals", benefit: "Enhancing workplace communication & management skills" },
  { name: "Homemakers", benefit: "Rediscovering purpose & building self-confidence" }
];

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6 text-center">
            Why Choose Medh's Personality Development Course?
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed text-center mx-auto max-w-3xl"
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
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed text-center mx-auto max-w-3xl"
          >
            <span className="text-gray-800 dark:text-gray-50 md:text-[1.1rem] text-[16px] font-bold tracking-wide">
              Tailored for diverse range of Age Groups:
            </span>{" "}
            From preschoolers, school students, college students, professionals,
            and homemakers, providing unique and engaging content designed to
            enhance their confidence, communication, and leadership skills.
          </motion.p>
          
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6 text-center">
            Key Features:
          </h1>
          
          <div className="space-y-2 md:space-y-4 max-w-3xl mx-auto">
            <Accordion title="Age-Appropriate Content">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Our course content is tailored for different age groups from preschool to entry-level professionals, ensuring everyone gets the most relevant and effective training for their life stage.
              </p>
            </Accordion>
            
            <Accordion title="Interactive Learning">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Learning happens through engaging online sessions, hands-on activities, role-plays, and practical assessments that make the development process enjoyable and effective.
              </p>
            </Accordion>
            
            <Accordion title="Expert Instructors">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Our experienced educators provide engaging, multimedia-rich content that keeps learners motivated while delivering maximum value in their personality development journey.
              </p>
            </Accordion>
            
            <Accordion title="Enhanced Confidence">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Build a strong sense of self-assurance to tackle life's challenges with poise and certainty. Our proven techniques help eliminate self-doubt and foster authentic confidence.
              </p>
            </Accordion>
            
            <Accordion title="Improved Communication Skills">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Learn to articulate your thoughts clearly and effectively, fostering better relationships both personally and professionally. Develop active listening, public speaking, and interpersonal communication.
              </p>
            </Accordion>
            
            <Accordion title="Leadership Development">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Cultivate essential leadership qualities that will help you excel in diverse roles and situations. Discover your leadership style and learn how to inspire and motivate others.
              </p>
            </Accordion>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 dark:text-gray-300 mt-8 mb-6 md:text-[16px] text-[15px] leading-relaxed bg-primaryColor/5 dark:bg-primaryColor/10 p-4 rounded-lg border-l-4 border-primaryColor text-center max-w-3xl mx-auto"
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
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6 text-center">
            Benefits of Personality Development Courses
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 md:text-[16px] text-[15px] mb-6 leading-relaxed text-center mx-auto max-w-3xl"
          >
            Personality Development for Personal and Professional Empowerment offers transformative advantages for individuals at every stage of life.
          </motion.p>

          {/* Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-10 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 text-center">
              Impact Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 justify-center">
              {personalityStats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>

          <div className="space-y-2 md:space-y-4 mt-6 max-w-3xl mx-auto">
            <Accordion title="Personal Growth & Confidence">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Our courses foster self-awareness and emotional intelligence, helping you build authentic confidence that radiates in every interaction. Discover your unique strengths and learn to leverage them effectively.
              </p>
            </Accordion>
            
            <Accordion title="Enhanced Communication Abilities">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Master both verbal and non-verbal communication skills that will help you articulate your thoughts clearly and connect meaningfully with others. Improve your listening skills, body language, and presentation abilities.
              </p>
            </Accordion>
            
            <Accordion title="Professional Advancement">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Develop essential workplace skills like leadership, teamwork, problem-solving, and conflict resolution that make you an invaluable asset to any organization. Our graduates report significant career advancement after completing our courses.
              </p>
            </Accordion>
            
            <Accordion title="Social Intelligence">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Learn to navigate complex social situations with ease and build meaningful relationships in both personal and professional settings. Develop empathy, adaptability, and cultural sensitivity.
              </p>
            </Accordion>
            
            <Accordion title="Stress Management & Resilience">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Acquire effective strategies to manage stress, overcome challenges, and bounce back from setbacks with renewed strength and perspective. Build mental toughness and emotional resilience for life's challenges.
              </p>
            </Accordion>
          </div>

          {/* Age Groups Section */}
          <div className="mt-8 text-center max-w-4xl mx-auto">
            <h2 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6 text-center">
              Benefits for Different Age Groups
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 justify-center">
              {ageGroups.map((group, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all text-center"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-primaryColor/10 dark:bg-primaryColor/20 rounded-full p-2 mr-3">
                      <User className="w-5 h-5 text-primaryColor dark:text-primaryColor" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{group.name}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{group.benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-700 dark:text-gray-300 md:text-[16px] text-[15px] my-6 leading-relaxed p-4 bg-primaryColor/5 dark:bg-primaryColor/10 rounded-lg text-center max-w-3xl mx-auto"
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
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6 text-center">
            Career Opportunities with Personality Development Skills
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 mb-6 md:text-[16px] text-[15px] leading-relaxed text-center mx-auto max-w-3xl"
          >
            The career prospects of a Personality Development Course are vast
            and impactful, offering individuals the opportunity to enhance their
            personal and professional lives. By developing essential life skills
            and strengthening interpersonal abilities, individuals can unlock
            various career opportunities and personal growth.
          </motion.p>

          <div className="space-y-2 md:space-y-4 max-w-3xl mx-auto">
            <Accordion title="Enhanced Professional Success">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                The application of personality development skills can significantly contribute to professional success. Individuals equipped with improved communication, leadership, and problem-solving skills are better positioned to thrive in their careers and effectively navigate workplace challenges.
              </p>
            </Accordion>
            
            <Accordion title="Mental Health and Well-being">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Personality development not only impacts professional success but also plays a pivotal role in enhancing mental health, decision-making abilities, self-confidence, and overall well-being. These attributes are invaluable in maintaining a healthy work-life balance and addressing personal development.
              </p>
            </Accordion>
            
            <Accordion title="Career Opportunities">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                The comprehensive development offered by personality development courses prepares individuals for diverse career paths. From corporate consultancy to educational roles, professionals in this field can serve as career coaches, executive coaches, organizational development consultants, facilitators, counselors, trainers of soft skills, and spoken English tutors.
              </p>
            </Accordion>
            
            <Accordion title="Personal and Professional Growth">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                The holistic approach of such courses ensures that individuals can excel in both personal and professional realms. By honing their skills and acquiring a growth mindset, learners are empowered to progress in their careers and pursue new opportunities.
              </p>
            </Accordion>
            
            <Accordion title="Adaptability and Lifelong Learning">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Personality development courses instill a growth mindset, emphasizing the value of continuous learning and adaptability. Individuals are encouraged to develop new skills, expand their perspectives, and remain open to personal and professional advancement.
              </p>
            </Accordion>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-gray-700 dark:text-gray-300 mt-8 mb-6 md:text-[16px] text-[15px] leading-relaxed p-4 bg-gradient-to-r from-primaryColor/10 to-blue-500/10 dark:from-primaryColor/20 dark:to-blue-500/20 rounded-lg border border-gray-200 dark:border-gray-700 text-center max-w-3xl mx-auto"
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
            className="mt-8 md:mt-10 text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl max-w-3xl mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3">
              Ready to Transform Your Life?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Join our Personality Development Course today and unlock your full potential. Develop essential skills that will benefit you personally and professionally.
            </p>
            <Link href="/enrollment/personality-development">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
              >
                Enroll Now
              </motion.button>
            </Link>
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

  const tabIcons = {
    1: <BookOpen className="w-5 h-5" />,
    2: <Heart className="w-5 h-5" />,
    3: <Briefcase className="w-5 h-5" />
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
              className="w-10 h-10 md:w-12 md:h-12 border-4 border-primaryColor border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative container mx-auto px-3 md:px-4 py-8 md:py-16 text-center">
        {/* Hero section with enhanced animations */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-10 md:mb-16 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[20px] md:text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-4 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600"
          >
            Welcome to Medh&#39;s Transformative Personality Development Course
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center md:text-[16px] text-[14px] leading-6 md:leading-7 md:w-[80%] text-gray-600 dark:text-gray-300 mx-auto"
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
          className="flex flex-wrap justify-center gap-2 md:gap-3 px-2 md:px-4" 
          role="tablist"
          aria-label="Personality Development course tabs"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 md:px-8 py-2 md:py-3 transition-all duration-300 rounded-xl flex items-center gap-2 text-sm md:text-base ${
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
              {tabIcons[tab.id]}
              {tab.name}
              {activeTab === tab.id && (
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
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
            className="bg-white/90 backdrop-blur-md mx-auto mt-6 md:mt-8 dark:bg-gray-800/90 px-4 py-6 md:px-8 md:py-10 border border-gray-200 dark:border-gray-700 text-gray-700 rounded-2xl shadow-xl max-w-4xl"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeContent.content}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalityOverview;
