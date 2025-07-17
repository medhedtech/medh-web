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
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getEnhancedSemanticColor } from '@/utils/designSystem';

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

const TABS = [
  { id: 0, label: "Overview" },
  { id: 1, label: "Career Features" },
  { id: 2, label: "Benefits" },
];

const featureIcons = {
  "Age-Appropriate Content": <Lightbulb className="w-8 h-8 text-primaryColor" />, 
  "Interactive Learning": <Book className="w-8 h-8 text-primaryColor" />, 
  "Expert Instructors": <User className="w-8 h-8 text-primaryColor" />, 
  "Enhanced Confidence": <Heart className="w-8 h-8 text-primaryColor" />, 
  "Improved Communication Skills": <Brain className="w-8 h-8 text-primaryColor" />, 
  "Leadership Development": <Briefcase className="w-8 h-8 text-primaryColor" />
};

// Update personalityFeatureCards to use Icon as a component, not JSX
const personalityFeatureCards = [
  {
    title: "Age-Appropriate Content",
    description: "Tailored for every life stage, from preschool to professionals. Ensures relevant and effective training for all ages.",
    Icon: Lightbulb,
  },
  {
    title: "Interactive Learning",
    description: "Engaging online sessions, hands-on activities, role-plays, and practical assessments. Makes learning enjoyable and effective.",
    Icon: Book,
  },
  {
    title: "Expert Instructors",
    description: "Experienced educators deliver multimedia-rich content. Keeps learners motivated and maximizes value.",
    Icon: User,
  },
  {
    title: "Enhanced Confidence",
    description: "Build self-assurance to tackle life's challenges. Proven techniques eliminate self-doubt and foster authentic confidence.",
    Icon: Heart,
  },
  {
    title: "Improved Communication Skills",
    description: "Articulate thoughts clearly, develop active listening, public speaking, and interpersonal communication.",
    Icon: Brain,
  },
  {
    title: "Leadership Development",
    description: "Cultivate leadership qualities, discover your style, and learn to inspire and motivate others.",
    Icon: Briefcase,
  },
];

// Accent color palette (copied from digital marketing)
const accentColors = [
  { border: 'border-blue-500', bg: 'from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80', icon: 'text-blue-500' },
  { border: 'border-emerald-500', bg: 'from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80', icon: 'text-emerald-500' },
  { border: 'border-amber-500', bg: 'from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80', icon: 'text-amber-500' },
  { border: 'border-violet-500', bg: 'from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80', icon: 'text-violet-500' },
  { border: 'border-pink-500', bg: 'from-pink-50/80 to-white/90 dark:from-pink-900/40 dark:to-gray-900/80', icon: 'text-pink-500' },
  { border: 'border-indigo-500', bg: 'from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80', icon: 'text-indigo-500' }
];

const whyChooseIntro = (
  <div className="mb-10">
    <h2 className="text-[clamp(1.5rem,4vw+1rem,2.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600 mb-4 text-center">
      Why Choose Medh's Personality Development Course?
    </h2>
    <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-5 font-medium text-center max-w-2xl mx-auto">
    Practical techniques to build confidence, communication, and leadership in preschoolers, students, professionals, and homemakers.
    </p>
          </div>
);

const OVERVIEW_CONTENT = (
  <>
    {/* Hero Section */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center mb-0 w-full"
    >
      
    </motion.div>
    {/* Why Choose Section - removed heading/intro here, now above tabs */}
    <div className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
        {personalityFeatureCards.map((feature, idx) => {
          const accent = accentColors[idx % accentColors.length];
          const Icon = feature.Icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
              className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
            >
              <div className="flex items-center mb-2">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -8 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mr-2"
                >
                  <Icon className={`w-6 h-6 ${accent.icon}`} />
                </motion.div>
                <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
      {/* Remove any CTA section from the Overview tab content here if present. The static CTA is already rendered below the tabs. */}
          </div>
  </>
);

const CAREER_FEATURES = [
  {
    title: "Corporate Readiness",
    description: "Master workplace etiquette, time management, and professional communication to excel in interviews and on the job.",
    Icon: Briefcase,
  },
  {
    title: "Leadership & Teamwork",
    description: "Develop leadership qualities, learn to collaborate, and manage teams effectively in any professional setting.",
    Icon: User,
  },
  {
    title: "Effective Communication",
    description: "Sharpen your public speaking, presentation, and negotiation skills for career advancement.",
    Icon: Brain,
  },
  {
    title: "Emotional Intelligence",
    description: "Build resilience, empathy, and self-awareness to thrive in dynamic work environments.",
    Icon: Heart,
  },
  {
    title: "Personal Branding",
    description: "Craft a strong personal brand and online presence to stand out in the job market.",
    Icon: Lightbulb,
  },
  {
    title: "Career Growth Mindset",
    description: "Adopt a growth mindset, set goals, and pursue continuous learning for long-term success.",
    Icon: ArrowUp,
  },
];

const BENEFITS = [
  {
    title: "Boosted Confidence",
    description: "Overcome self-doubt and approach challenges with a positive, empowered mindset.",
    Icon: Heart,
  },
  {
    title: "Stronger Relationships",
    description: "Build meaningful connections in personal and professional life through improved social skills.",
    Icon: User,
  },
  {
    title: "Better Decision Making",
    description: "Enhance critical thinking and problem-solving abilities for everyday success.",
    Icon: Lightbulb,
  },
  {
    title: "Stress Management",
    description: "Learn techniques to manage stress, maintain balance, and improve overall well-being.",
    Icon: Brain,
  },
  {
    title: "Career Advancement",
    description: "Unlock new opportunities and promotions by demonstrating professionalism and leadership.",
    Icon: Briefcase,
  },
  {
    title: "Lifelong Success",
    description: "Gain skills that support personal growth and achievement at every stage of life.",
    Icon: ArrowUp,
  },
];

const CAREER_FEATURES_CONTENT = (
  <div className="mb-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
      {CAREER_FEATURES.map((feature, idx) => {
        const accent = accentColors[idx % accentColors.length];
        const Icon = feature.Icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const BENEFITS_CONTENT = (
  <div className="mb-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
      {BENEFITS.map((feature, idx) => {
        const accent = accentColors[idx % accentColors.length];
        const Icon = feature.Icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const TAB_CONTENT = [
  OVERVIEW_CONTENT,
  CAREER_FEATURES_CONTENT,
  BENEFITS_CONTENT,
];

// Industry data for Personality Development
const personalityIndustryData = [
  {
    name: 'Professional Services',
    value: 24,
    color: getEnhancedSemanticColor('courses', 'light'),
    description: '• Interpersonal & client‑relationship skills\n• Leadership coaching & executive presence',
    keyApps: [
      'Interpersonal & client‑relationship skills',
      'Leadership coaching & executive presence',
    ],
    class: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Banking Services',
    value: 22,
    color: getEnhancedSemanticColor('pricing', 'light'),
    description: '• Customer‑facing communication\n• Negotiation & change‑leadership training',
    keyApps: [
      'Customer‑facing communication',
      'Negotiation & change‑leadership training',
    ],
    class: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Healthcare',
    value: 20,
    color: getEnhancedSemanticColor('certification', 'light'),
    description: '• Patient‑empathy & bedside manner\n• Team‑collaboration workshops',
    keyApps: [
      'Patient‑empathy & bedside manner',
      'Team‑collaboration workshops',
    ],
    class: 'text-amber-600 dark:text-amber-400',
  },
  {
    name: 'Manufacturing',
    value: 18,
    color: getEnhancedSemanticColor('support', 'light'),
    description: '• Supervisory leadership & safety communication\n• Cross‑functional team coaching',
    keyApps: [
      'Supervisory leadership & safety communication',
      'Cross‑functional team coaching',
    ],
    class: 'text-violet-600 dark:text-violet-400',
  },
  {
    name: 'Retail & Wholesale',
    value: 16,
    color: getEnhancedSemanticColor('enrollment', 'light'),
    description: '• Sales‑personality & upselling techniques\n• Conflict‑resolution & service‑excellence training',
    keyApps: [
      'Sales‑personality & upselling techniques',
      'Conflict‑resolution & service‑excellence training',
    ],
    class: 'text-pink-600 dark:text-pink-400',
  },
];

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
        {/* Why Choose Section - now above tabs */}
        {whyChooseIntro}
        {/* Tab Bar */}
        <div className="flex justify-center mb-0">
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
          className="transition-all duration-300 mt-8"
        >
          {TAB_CONTENT[activeTab]}
        </div>
        {/* Industry Table & Doughnut Chart Section */}
        <div className="mb-12 w-full pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primaryColor mb-4 text-center">Top Industries Investing in Personality Development</h2>
          <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center mb-6">
            {/* Left side: Industry Table */}
            <div className="flex-1 w-full md:w-[480px] lg:w-[560px] xl:w-[640px] md:pl-16 md:pr-6">
              <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs md:text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">Industry</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">% of Spend</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">Key Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {personalityIndustryData.map((row, idx) => (
                    <tr key={row.name} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                      <td className={`py-2 px-3 font-medium ${row.class}`}>{row.name}</td>
                      <td className="py-2 px-3 font-bold">{row.value}%</td>
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-300 text-sm">
                        {row.keyApps.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Right side: Doughnut Chart */}
            <div className="block md:hidden w-full" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personalityIndustryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    label={false}
                  >
                    {personalityIndustryData.map((entry, idx) => (
                      <Cell key={`cell-m-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Mobile legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 mb-16">
                {personalityIndustryData.map((entry, idx) => (
                  <div key={`legend-m-${idx}`} className="flex items-center text-xs">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                    <span className="font-medium mr-1">{entry.name}</span>
                    <span className="text-gray-500">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block w-1/2 h-64 flex justify-center my-6 md:my-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personalityIndustryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {personalityIndustryData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Short note below the chart */}
          <div className="flex items-center justify-center mt-20 md:mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md px-3 py-1 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2 md:whitespace-nowrap mt-0">
              <svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3 text-blue-500 dark:text-blue-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg>
              <span>Each segment shows the share of Personality Development spend by industry.</span>
            </div>
          </div>
        </div>
        {/* Static CTA Section: Always visible below industry chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl w-full mt-14"
        >
          <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3 text-center">
            Ready to Transform Your Life?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Join our Personality Development Course today and unlock your full potential. Develop essential skills that will benefit you personally and professionally.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/enrollment/personality-development', '_blank')}
            className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base cursor-pointer"
          >
            Enroll Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalityOverview;
