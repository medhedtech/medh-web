"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  ChevronDown, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Send, 
  Users,
  Search,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import DOMPurify from "dompurify";

const faqs = [
  {
    question: "What is Medh's work culture like?",
    answer:
      "At Medh, we foster a collaborative, inclusive, and innovative work culture. We believe in supporting each other, encouraging creativity, and celebrating successes together.",
  },
  {
    question: "What career development opportunities does Medh offer?",
    answer:
      "Medh is committed to your professional growth. We offer access to training sessions, workshops, and mentorship programs to help you advance in your career.",
  },
  {
    question: "What benefits can I expect as a Medh employee?",
    answer:
      "As a Medh employee, you can expect competitive compensation, flexible work arrangements, comprehensive health and wellness programs, and a supportive work environment.",
  },
  {
    question: "How can I apply for a job at Medh?",
    answer:
      'To apply, visit our Careers Page and click on the "Apply Now" button next to the job listing that interests you. Follow the instructions to submit your resume and cover letter.',
  },
  {
    question: "What is the recruitment process at Medh?",
    answer:
      "Our recruitment process typically involves an initial application review, followed by a phone/video interview, an assessment or task related to the role, and a final interview. We strive to make the process smooth and efficient for all candidates.",
  },
];

export default function CareerFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  // Theme colors for careers section
  const themeColors = {
    primary: {
      light: '#8b5cf6', // Violet 500 - Career primary
      medium: '#7c3aed', // Violet 600
      dark: '#6d28d9', // Violet 700
    },
    secondary: {
      light: '#ec4899', // Pink 500
      medium: '#db2777', // Pink 600
      dark: '#be185d', // Pink 700
    }
  };

  // Animation variants
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
      ['#8b5cf6', '#7c3aed'], // Violet to Violet
      ['#ec4899', '#db2777'], // Pink to Pink
      ['#3b82f6', '#2563eb'], // Blue to Blue
      ['#f59e0b', '#d97706'], // Amber to Amber
      ['#10b981', '#059669'], // Emerald to Emerald
    ];
    return palettes[index % palettes.length];
  };

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
    
    if (q.includes("culture")) 
      return <Users className="w-5 h-5" style={{ color }} />;
    if (q.includes("career") || q.includes("development")) 
      return <GraduationCap className="w-5 h-5" style={{ color }} />;
    if (q.includes("benefits")) 
      return <Heart className="w-5 h-5" style={{ color }} />;
    if (q.includes("apply")) 
      return <Send className="w-5 h-5" style={{ color }} />;
    
    return <Briefcase className="w-5 h-5" style={{ color }} />;
  };

  return (
    <section className="w-full py-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
          {/* Header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
          >
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-1.5 h-10 bg-gradient-to-b from-violet-400 to-violet-600 rounded-sm mr-3"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400">
                  Career Opportunities FAQ
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                  Everything you need to know about joining the Medh team
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent text-sm"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search career FAQs"
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
                        border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden
                        transition-all duration-200
                        ${hoveredIndex === index ? 'shadow-md' : 'shadow-sm'}
                      `}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <button
                        className={`w-full flex items-center justify-between p-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 ${
                          openIndex === index 
                            ? "bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-content-${index}`}
                      >
                        <div className="flex items-center mr-2">
                          <div className="mr-3 flex-shrink-0">
                            {getIconForQuestion(faq.question)}
                          </div>
                          <h3 className={`text-base font-medium pr-8 ${
                            openIndex === index 
                              ? "text-violet-700 dark:text-violet-400" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                        <div className={`flex-shrink-0 p-1 rounded-full transition-all duration-300 transform ${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        } ${
                          openIndex === index 
                            ? "bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-400" 
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
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
                              className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
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
                className="p-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center"
              >
                <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No matching FAQs found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We couldn't find any FAQs matching "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
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
            className="mt-8 p-5 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 rounded-lg border border-violet-100/70 dark:border-violet-800/50"
          >
            <p className="text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <HelpCircle className="w-6 h-6 mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 text-violet-500 dark:text-violet-400" />
              <span>
                Ready to start your journey with us? Visit our{" "}
                <a 
                  href="/careers" 
                  className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline inline-flex items-center"
                >
                  Careers Page
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
                {" "}to explore current opportunities.
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
