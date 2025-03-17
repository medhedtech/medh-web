"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, HelpCircle, AlertCircle, ExternalLink, BookOpen, Clock, Building, Coins, Users } from "lucide-react";
import DOMPurify from "dompurify";

export default function SchoolFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  // Theme colors - consistent with courseFaq
  const themeColors = {
    primary: {
      light: '#10b981', // Emerald 500
      medium: '#059669', // Emerald 600
      dark: '#047857', // Emerald 700
    },
    secondary: {
      light: '#3b82f6', // Blue 500
      medium: '#2563eb', // Blue 600
      dark: '#1d4ed8', // Blue 700
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
      ['#10b981', '#059669'], // Emerald to Emerald
      ['#3b82f6', '#2563eb'], // Blue to Blue
      ['#8b5cf6', '#7c3aed'], // Violet to Violet
      ['#f59e0b', '#d97706'], // Amber to Amber
      ['#ec4899', '#db2777'], // Pink to Pink
    ];
    return palettes[index % palettes.length];
  };

  const faqs = [
    {
      question:
        "What is the process for schools/institutes to partner with Medh?",
      answer:
        "To partner with Medh, visit our Collaboration Page, fill out the partnership inquiry form, and our team will get in touch to discuss the details and tailor a collaboration plan that fits your institution's needs.",
    },
    {
      question: "What are the key benefits of partnering with Medh?",
      answer:
        "Partnering with Medh offers numerous benefits including enhanced curriculum, diversified skill sets, access to specialized expertise, integration of advanced technology, cost-effective solutions, scalability, increased student engagement, data-driven insights, teacher empowerment, and better preparation for future careers.",
    },
    {
      question: "How does Medh enhance the existing curriculum?",
      answer:
        "MEDH enriches the existing curriculum by integrating cutting-edge technologies and innovative teaching methods, making learning more engaging, interactive, and effective for students.",
    },
    {
      question: "What kind of skill development programs does Medh offer?",
      answer:
        "MEDH offers a diverse range of skill development programs that prepare students for a rapidly evolving job market, equipping them with a broader range of competencies tailored to specific skills and industries.",
    },
    {
      question: "How does Medh ensure the quality of its courses?",
      answer:
        "Our subject matter experts design and deliver specialized courses, ensuring that students receive high-quality education tailored to specific skills and industries. We also provide regular updates based on the latest educational research and feedback from students and educators.",
    },
    {
      question: "How does Medh integrate technology into teaching methods?",
      answer:
        "Medh collaborates with institutions to integrate state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students' digital literacy and technological proficiency.",
    },
    {
      question: "Is partnering with Medh cost-effective?",
      answer:
        "Yes, collaborating with Medh provides cost-effective alternatives compared to developing in-house skill development courses, offering a broader range of skill development opportunities without straining budgets.",
    },
    {
      question: "Can Medh's solutions accommodate a large number of students?",
      answer:
        "Yes, Medh's solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education. Additionally, these courses can be tailored to suit various academic schedules.",
    },
    {
      question: "How does Medh increase student engagement and motivation?",
      answer:
        "Medh uses gamified learning, interactive quizzes, and real-time progress tracking to make the learning process more enjoyable and encourage active participation and motivation among students.",
    },
    {
      question:
        "What kind of data-driven insights does Medh provide to educators?",
      answer:
        "We provide comprehensive data analytics and insights to educators, enabling them to track students' progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
    },
    {
      question: "How does Medh empower teachers?",
      answer:
        "Skill development collaboration with Medh empowers teachers by providing them with training and resources to implement modern teaching methodologies, boosting their confidence and teaching abilities, ultimately benefiting the students.",
    },
    {
      question: "How does Medh prepare students for future careers?",
      answer:
        "Medh prepares students for future careers by aligning the curriculum with industry demands, ensuring that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
    },
    {
      question: "What makes Medh's approach to education innovative?",
      answer:
        "Medh's approach to education promotes independence, enhances creativity, encourages teamwork, develops social skills, improves communication skills, and prepares students to think on their feet and take calculated risks.",
    },
    {
      question: "How can we get started with Medh?",
      answer:
        "To get started with Medh, visit our Collaboration Page or contact our support team at support@medh.co. We look forward to collaborating with you to bring innovative and effective education solutions to your institution.",
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
    
    if (q.includes("process") || q.includes("partner")) 
      return <Building className="w-5 h-5" style={{ color }} />;
    if (q.includes("cost") || q.includes("budget") || q.includes("payment")) 
      return <Coins className="w-5 h-5" style={{ color }} />;
    if (q.includes("students") || q.includes("teachers")) 
      return <Users className="w-5 h-5" style={{ color }} />;
    if (q.includes("time") || q.includes("duration")) 
      return <Clock className="w-5 h-5" style={{ color }} />;
    
    return <HelpCircle className="w-5 h-5" style={{ color }} />;
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
              <div className="w-1.5 h-10 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-sm mr-3"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                  Everything you need to know about partnering with Medh
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm"
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
                        border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden
                        transition-all duration-200
                        ${hoveredIndex === index ? 'shadow-md' : 'shadow-sm'}
                      `}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <button
                        className={`w-full flex items-center justify-between p-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${
                          openIndex === index 
                            ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10" 
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
                              ? "text-emerald-700 dark:text-emerald-400" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                        <div className={`flex-shrink-0 p-1 rounded-full transition-all duration-300 transform ${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        } ${
                          openIndex === index 
                            ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400" 
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
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
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
            className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-100/70 dark:border-blue-800/50"
          >
            <p className="text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <HelpCircle className="w-6 h-6 mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 text-blue-500 dark:text-blue-400" />
              <span>
                Have more questions? Contact our support team at{" "}
                <a 
                  href="mailto:care@medh.co" 
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline inline-flex items-center"
                >
                  care@medh.co
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
