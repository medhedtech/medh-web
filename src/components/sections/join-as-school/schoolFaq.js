"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, HelpCircle, AlertCircle, ExternalLink, BookOpen, Clock, Building, Coins, Users, Mail } from "lucide-react";
import DOMPurify from "dompurify";

export default function SchoolFaq() {
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
            <p className="text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-12 h-12 mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0 rounded-xl bg-[#379392]/20 flex items-center justify-center transform transition-transform duration-300"
              >
                <Mail className="w-6 h-6 text-[#379392]" />
              </motion.div>
              <span>
                Have more questions? Contact our support team at{" "}
                <a 
                  href="mailto:care@medh.co" 
                  className="font-medium text-[#379392] hover:text-[#2d7978] dark:text-[#379392] dark:hover:text-[#2d7978] underline inline-flex items-center group transition-colors duration-200"
                >
                  care@medh.co
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-block transition-transform ml-1"
                  >
                    →
                  </motion.span>
                </a>
              </span>
            </p>
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
