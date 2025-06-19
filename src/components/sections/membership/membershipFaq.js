"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, HelpCircle, AlertCircle, CreditCard, Users, Calendar, Award, Download, BookOpen, Settings, Clock, Gift, Mail } from "lucide-react";
import DOMPurify from "dompurify";

export default function MembershipFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  // Theme colors - consistent with project theme
  const themeColors = {
    primary: {
      light: '#379392', // Primary brand color
      medium: '#2d7978', // Darker shade
      dark: '#236665', // Darkest shade
    },
    secondary: {
      light: '#F6B335', // Secondary brand color
      medium: '#e5a42e', // Darker shade
      dark: '#d49627', // Darkest shade
    }
  };

  // Animation variants with reduced motion support
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30, 
        mass: 1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      height: "auto",
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.2 }
      }
    }
  };

  // Function to get gradient background colors based on index
  const getGradientColors = (index) => {
    const palettes = [
      ['#379392', '#2d7978'], // Primary to Primary Dark
      ['#F6B335', '#e5a42e'], // Secondary to Secondary Dark
      ['#4B5563', '#374151'], // Gray to Gray Dark
      ['#3B82F6', '#2563EB'], // Blue to Blue Dark
      ['#8B5CF6', '#7C3AED'], // Purple to Purple Dark
    ];
    return palettes[index % palettes.length];
  };

  const faqs = [
    {
      question: "What's the difference between Silver and Gold Memberships?",
      answer:
        "Silver Membership gives you unlimited access to all courses within one category of your choice, while Gold Membership provides access to all courses across three categories of your choice. Gold also includes additional benefits like exclusive masterclasses and a personal learning advisor.",
    },
    {
      question: "Can I change my selected category/categories after subscribing?",
      answer:
        "Yes. Silver members can change their selected category once every 30 days. Gold members can modify their three chosen categories once every 30 days. Changes take effect immediately without affecting your current progress.",
    },
    {
      question: "Is there a minimum commitment period for memberships?",
      answer:
        "No, there is no minimum commitment period. Both memberships operate on a month-to-month basis, and you can cancel anytime. Your access continues until the end of your current billing cycle.",
    },
    {
      question: "Will I lose my progress if I cancel my membership?",
      answer:
        "Your progress and completion records are saved indefinitely in our system. If you resubscribe later, you'll regain access to all your previous progress. However, you'll lose access to the course content at the end of your billing cycle after cancellation.",
    },
    {
      question: "What happens to my certificates if I cancel my membership?",
      answer:
        "Any certificates you've earned during your membership remain valid permanently. You'll retain access to download your certificates even after cancellation through your Medh profile.",
    },
    {
      question: "Do memberships include Live Interactive Certification Courses?",
      answer:
        "No, memberships cover only Blended Self-paced courses. However, Silver members receive a min of 7.50% discount and Gold members receive a 15% discount on all Live Interactive Certification Courses.",
    },
    {
      question: "How many courses can I take simultaneously?",
      answer:
        "There is no limit. With either membership, you can enroll in and progress through as many eligible courses as you wish simultaneously within your selected category/categories.",
    },
    {
      question: "Can I download course materials for offline access?",
      answer:
        "Yes, both memberships allow you to download learning materials, worksheets, and resources for personal use. Video content remains accessible only through streaming while your membership is active.",
    },
    {
      question: "Are new courses added to the membership program?",
      answer:
        "Yes, we regularly add new courses to our catalog. As a member, you automatically gain access to any new courses added to your selected category/categories at no additional cost.",
    },
    {
      question: "How does the billing cycle work?",
      answer:
        "Your membership fee is charged on the same date each month. For example, if you subscribe on the 15th, you'll be billed on the 15th of each subsequent month until you cancel.",
    },
    {
      question: "Can I upgrade from Silver to Gold membership?",
      answer:
        "Yes, you can upgrade from Silver to Gold at any time. When upgrading, we'll prorate the remaining days in your current billing cycle, so you only pay the difference for the upgrade.",
    },
    {
      question: "Is there a family or group membership option?",
      answer:
        "Currently, memberships are individual-based. However, we offer special corporate and educational institution packages for multiple users. Please email our membership team at membership@medh.co for custom group solutions.",
    },
    {
      question: "Can I try before I subscribe?",
      answer:
        "Yes, we offer a 7-day free trial for both membership tiers. During the trial, you'll have full access to all features of your chosen membership. You can cancel anytime during the trial period without being charged.",
    },
    {
      question: "How do category-specific memberships work with interdisciplinary courses?",
      answer:
        "Some courses may appear in multiple categories due to their interdisciplinary nature. As a member, you'll have access to these courses if any of their assigned categories match your selected membership categories.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === ""
    ? faqs
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Function to determine appropriate icon for a FAQ based on content
  const getIconForQuestion = (question) => {
    const color = themeColors.primary.light;
    const q = question.toLowerCase();
    
    if (q.includes("billing") || q.includes("payment") || q.includes("upgrade") || q.includes("cost")) 
      return <CreditCard className="w-5 h-5" style={{ color }} />;
    if (q.includes("cancel") || q.includes("commitment") || q.includes("trial")) 
      return <AlertCircle className="w-5 h-5" style={{ color }} />;
    if (q.includes("certificate") || q.includes("award")) 
      return <Award className="w-5 h-5" style={{ color }} />;
    if (q.includes("download") || q.includes("offline")) 
      return <Download className="w-5 h-5" style={{ color }} />;
    if (q.includes("course") || q.includes("material") || q.includes("learning")) 
      return <BookOpen className="w-5 h-5" style={{ color }} />;
    if (q.includes("change") || q.includes("category") || q.includes("selected")) 
      return <Settings className="w-5 h-5" style={{ color }} />;
    if (q.includes("time") || q.includes("duration") || q.includes("cycle")) 
      return <Clock className="w-5 h-5" style={{ color }} />;
    if (q.includes("family") || q.includes("group") || q.includes("multiple")) 
      return <Users className="w-5 h-5" style={{ color }} />;
    if (q.includes("trial") || q.includes("free")) 
      return <Gift className="w-5 h-5" style={{ color }} />;
    
    return <HelpCircle className="w-5 h-5" style={{ color }} />;
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
          {/* Header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
          >
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#379392] to-[#2d7978] rounded-sm mr-3"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#379392] to-[#F6B335] dark:from-[#379392] dark:to-[#F6B335]">
                  Frequently Asked Questions
        </h2>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  Everything you need to know about MEDH's Membership Program
                </p>
              </div>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#379392] dark:focus:ring-[#379392] focus:border-transparent text-sm transition-all duration-200"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search FAQs"
              />
            </div>
          </motion.div>

          {/* FAQs list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const [startColor, endColor] = getGradientColors(index);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="overflow-hidden"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className={`
                        border dark:border-gray-700/50 rounded-xl overflow-hidden
                        transition-all duration-200 backdrop-blur-sm
                        ${hoveredIndex === index ? 'shadow-lg' : 'shadow-md'}
                        ${openIndex === index ? 'ring-2 ring-[#379392]/20' : ''}
                      `}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <button
                        className={`w-full flex items-center justify-between p-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#379392] focus:ring-opacity-50 ${
                          openIndex === index 
                            ? "bg-gradient-to-r from-[#379392]/10 to-[#379392]/5 dark:from-[#379392]/20 dark:to-[#379392]/10" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                onClick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-content-${index}`}
                      >
                        <div className="flex items-center mr-2">
                          <div className={`mr-3 flex-shrink-0 p-2 rounded-lg transition-colors duration-300 ${
                            openIndex === index 
                              ? 'bg-[#379392]/20 text-[#379392]' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                          }`}>
                            {getIconForQuestion(faq.question)}
                          </div>
                          <h3 className={`text-base font-medium pr-8 ${
                            openIndex === index 
                              ? "text-[#379392] dark:text-[#379392]" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                        <motion.div 
                          animate={{ 
                            rotate: openIndex === index ? 180 : 0,
                            backgroundColor: openIndex === index ? 'rgba(55, 147, 146, 0.2)' : 'transparent',
                            color: openIndex === index ? '#379392' : '#9CA3AF'
                          }}
                          transition={{ duration: 0.3 }}
                          className={`flex-shrink-0 p-1.5 rounded-full`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            id={`faq-content-${index}`}
                            className="overflow-hidden"
                          >
                            <div 
                              className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t dark:border-gray-700/50"
                              style={{ 
                                borderLeft: `3px solid ${startColor}`,
                                paddingLeft: '1.25rem'
                              }}
                            >
                              <div 
                                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                  __html: DOMPurify.sanitize(faq.answer.replace(/\n/g, '<br/>'))
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-center backdrop-blur-sm"
              >
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No matching FAQs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We couldn't find any FAQs matching "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#379392] hover:text-[#2d7978] dark:text-[#379392] dark:hover:text-[#2d7978] font-medium transition-colors duration-200"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Footer contact info card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 bg-gradient-to-r from-[#379392]/10 via-white to-[#379392]/10 dark:from-[#379392]/20 dark:via-gray-800/50 dark:to-[#379392]/20 rounded-xl border border-[#379392]/20 dark:border-[#379392]/30 backdrop-blur-sm"
          >
            <div className="text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-12 h-12 mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0 rounded-xl bg-[#379392]/20 flex items-center justify-center transform transition-transform duration-300"
              >
                <Mail className="w-6 h-6 text-[#379392]" />
              </motion.div>
              <span>
                Have more questions about Medh Membership? Contact our team at{" "}
                <a 
                  href="mailto:membership@medh.co" 
                  className="font-medium text-[#379392] hover:text-[#2d7978] dark:text-[#379392] dark:hover:text-[#2d7978] underline inline-flex items-center group transition-colors duration-200"
                >
                  membership@medh.co
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-block transition-transform ml-1"
                  >
                    →
                  </motion.span>
                </a>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(#379392 0.5px, transparent 0.5px);
          background-size: 16px 16px;
        }
      `}</style>
    </section>
  );
}
