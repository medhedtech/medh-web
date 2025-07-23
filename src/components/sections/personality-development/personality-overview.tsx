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

// Data constants
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

// Feature icons mapping
const featureIcons = {
  "Age-Appropriate Content": <Lightbulb className="w-8 h-8 text-primaryColor" />, 
  "Interactive Learning": <Book className="w-8 h-8 text-primaryColor" />, 
  "Expert Instructors": <User className="w-8 h-8 text-primaryColor" />, 
  "Enhanced Confidence": <Heart className="w-8 h-8 text-primaryColor" />, 
  "Improved Communication Skills": <Brain className="w-8 h-8 text-primaryColor" />, 
  "Leadership Development": <Briefcase className="w-8 h-8 text-primaryColor" />
};

// Personality features data
const personalityFeatures = [
  {
    title: "Age-Appropriate Content",
    data: [
      { label: "What it means", content: "Tailored for every life stage, from preschool to professionals." },
      { label: "How it helps", content: "Ensures relevant and effective training for all ages." }
    ]
  },
  {
    title: "Interactive Learning",
    data: [
      { label: "Format", content: "Engaging online sessions, hands-on activities, role-plays, and practical assessments." },
      { label: "Benefit", content: "Makes learning enjoyable and effective." }
    ]
  },
  {
    title: "Expert Instructors",
    data: [
      { label: "Who", content: "Experienced educators deliver multimedia-rich content." },
      { label: "Why", content: "Keeps learners motivated and maximizes value." }
    ]
  },
  {
    title: "Enhanced Confidence",
    data: [
      { label: "Focus", content: "Build self-assurance to tackle life's challenges." },
      { label: "Method", content: "Proven techniques eliminate self-doubt and foster authentic confidence." }
    ]
  },
  {
    title: "Improved Communication Skills",
    data: [
      { label: "Skills", content: "Articulate thoughts clearly, develop active listening, public speaking, and interpersonal communication." }
    ]
  },
  {
    title: "Leadership Development",
    data: [
      { label: "Goal", content: "Cultivate leadership qualities, discover your style, and learn to inspire and motivate others." }
    ]
  }
];

// Tab configuration
const TABS = [
  { id: 0, label: "Overview" },
  { id: 1, label: "Benefits" },
  { id: 2, label: "Career Prospects" },
];

// Component definitions
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

const Section = memo(({ title, data }) => {
  const icon = featureIcons[title] || <Lightbulb className="w-8 h-8 text-primaryColor" />;
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 md:mt-8"
    >
      <div className="group relative flex flex-col h-[320px] md:h-[340px] lg:h-[360px] xl:h-[380px] w-full max-w-full mx-auto rounded-lg md:rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] cursor-pointer transform-gpu will-change-transform">
        {/* Header Section */}
        <div className="relative h-[110px] md:h-[130px] flex flex-col justify-center items-center bg-gradient-to-br from-primaryColor/10 to-transparent dark:from-primaryColor/20 dark:to-transparent/0 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-2 md:mb-3 bg-white dark:bg-gray-900 p-2 md:p-3 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
            {icon}
          </div>
          <h2 className="text-base md:text-lg lg:text-xl font-bold tracking-wide text-primaryColor dark:text-gray-50 text-center px-2">
            {title}
          </h2>
        </div>
        {/* Content Section */}
        <div className="flex flex-col flex-grow p-3 md:p-4 lg:p-4 space-y-2 md:space-y-2.5 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {data.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="py-1.5 md:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md border-l-2 border-transparent hover:border-primaryColor dark:hover:border-primaryColor"
              >
                <div className="flex flex-col">
                  <strong className="text-xs md:text-sm font-bold tracking-wide text-primaryColor dark:text-blue-400 mb-1">
                    {item.label}:
                  </strong>
                  <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
});

Section.displayName = "Section";

// Tab content definitions
const OVERVIEW_CONTENT = (
  <>
    {/* Hero Section */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center mb-10 md:mb-14 w-full"
    >
      <h1 className="text-[clamp(1.5rem,4vw+1rem,2.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600 mb-3 text-center">
        Welcome to Medh's Transformative Personality Development Course
      </h1>
      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
        Our course builds essential life skills and character traits for all—students, professionals, and homemakers—boosting confidence, inclusivity, and interpersonal abilities.
      </p>
    </motion.div>
    {/* Why Choose Section */}
    <div className="mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-primaryColor mb-4 text-center">Why Choose Medh's Personality Development Course?</h2>
      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-5 font-medium text-center max-w-2xl mx-auto">
        Practical insights and techniques to enhance confidence, communication, and leadership capabilities for personal and professional success.<br />
        Tailored for all age groups: preschoolers, school students, college students, professionals, and homemakers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 w-full">
        {personalityFeatures.map((feature, idx) => (
          <Section key={feature.title} title={feature.title} data={feature.data} />
        ))}
      </div>
      <div className="text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl max-w-2xl mx-auto mt-10">
        <span className="text-gray-800 dark:text-gray-100 font-semibold">Join us to experience a holistic approach to personal development, empowering individuals across age groups with essential life skills for success and fulfillment.</span>
      </div>
    </div>
  </>
);

const TAB_CONTENT = [
  OVERVIEW_CONTENT,
  // Placeholder for Benefits and Career Prospects
  <div className="text-center py-20 text-gray-400">Benefits content coming soon...</div>,
  <div className="text-center py-20 text-gray-400">Career Prospects content coming soon...</div>,
];

// Main component
const PersonalityOverview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20 pointer-events-none" />
      
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
      
      <div className="relative w-full px-0 py-8 md:py-16">
        {/* Tab Bar */}
        <div className="flex justify-center mb-8">
          <nav className="inline-flex rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryColor/50
                  ${activeTab === tab.id
                    ? 'bg-primaryColor text-white dark:bg-primaryColor dark:text-white shadow'
                    : 'bg-transparent text-primaryColor dark:text-primaryColor hover:bg-primaryColor/10 dark:hover:bg-primaryColor/20'}
                `}
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                role="tab"
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Tab Content */}
        <div id={`tab-panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}
          className="transition-all duration-300">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default PersonalityOverview;
