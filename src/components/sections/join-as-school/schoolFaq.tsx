"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  Building, 
  Coins, 
  Users, 
  Mail,
  Clock,
  Star,
  MessageCircle,
  Award
} from "lucide-react";
import DOMPurify from "dompurify";

interface IFAQ {
  question: string;
  answer: string;
  category?: string;
}

interface IThemeColors {
  primary: {
    light: string;
    medium: string;
    dark: string;
  };
  secondary: {
    light: string;
    medium: string;
    dark: string;
  };
}

const SchoolFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Theme colors - consistent with design system
  const themeColors: IThemeColors = {
    primary: {
      light: '#3bac63', // Medh signature green
      medium: '#2d7978',
      dark: '#236665',
    },
    secondary: {
      light: '#F6B335',
      medium: '#e5a42e',
      dark: '#d49627',
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
  const getGradientColors = (index: number): [string, string] => {
    const palettes: [string, string][] = [
      ['#3bac63', '#2d7978'], // Medh green to teal
      ['#F6B335', '#e5a42e'], // Secondary to Secondary Dark
      ['#4B5563', '#374151'], // Gray to Gray Dark
      ['#3B82F6', '#2563EB'], // Blue to Blue Dark
      ['#8B5CF6', '#7C3AED'], // Purple to Purple Dark
    ];
    return palettes[index % palettes.length];
  };

  const faqs: IFAQ[] = [
    {
      question: "What is the process for schools/institutes to partner with Medh?",
      answer: "To partner with Medh, visit our Collaboration Page, fill out the partnership inquiry form, and our team will get in touch to discuss the details and tailor a collaboration plan that fits your institution's needs.",
      category: "partnership"
    },
    {
      question: "What are the key benefits of partnering with Medh?",
      answer: "Partnering with Medh offers numerous benefits including enhanced curriculum, diversified skill sets, access to specialized expertise, integration of advanced technology, cost-effective solutions, scalability, increased student engagement, data-driven insights, teacher empowerment, and better preparation for future careers.",
      category: "benefits"
    },
    {
      question: "How does Medh enhance the existing curriculum?",
      answer: "MEDH enriches the existing curriculum by integrating cutting-edge technologies and innovative teaching methods, making learning more engaging, interactive, and effective for students.",
      category: "curriculum"
    },
    {
      question: "What kind of skill development programs does Medh offer?",
      answer: "MEDH offers a diverse range of skill development programs that prepare students for a rapidly evolving job market, equipping them with a broader range of competencies tailored to specific skills and industries.",
      category: "programs"
    },
    {
      question: "How does Medh ensure the quality of its courses?",
      answer: "Our subject matter experts design and deliver specialized courses, ensuring that students receive high-quality education tailored to specific skills and industries. We also provide regular updates based on the latest educational research and feedback from students and educators.",
      category: "quality"
    },
    {
      question: "How does Medh integrate technology into teaching methods?",
      answer: "Medh collaborates with institutions to integrate state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students' digital literacy and technological proficiency.",
      category: "technology"
    },
    {
      question: "Is partnering with Medh cost-effective?",
      answer: "Yes, collaborating with Medh provides cost-effective alternatives compared to developing in-house skill development courses, offering a broader range of skill development opportunities without straining budgets.",
      category: "cost"
    },
    {
      question: "Can Medh's solutions accommodate a large number of students?",
      answer: "Yes, Medh's solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education. Additionally, these courses can be tailored to suit various academic schedules.",
      category: "scalability"
    },
    {
      question: "How does Medh increase student engagement and motivation?",
      answer: "Medh uses gamified learning, interactive quizzes, and real-time progress tracking to make the learning process more enjoyable and encourage active participation and motivation among students.",
      category: "engagement"
    },
    {
      question: "What kind of data-driven insights does Medh provide to educators?",
      answer: "We provide comprehensive data analytics and insights to educators, enabling them to track students' progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
      category: "analytics"
    },
    {
      question: "How does Medh empower teachers?",
      answer: "Skill development collaboration with Medh empowers teachers by providing them with training and resources to implement modern teaching methodologies, boosting their confidence and teaching abilities, ultimately benefiting the students.",
      category: "teachers"
    },
    {
      question: "How does Medh prepare students for future careers?",
      answer: "Medh prepares students for future careers by aligning the curriculum with industry demands, ensuring that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
      category: "careers"
    },
    {
      question: "What makes Medh's approach to education innovative?",
      answer: "Medh's approach to education promotes independence, enhances creativity, encourages teamwork, develops social skills, improves communication skills, and prepares students to think on their feet and take calculated risks.",
      category: "innovation"
    },
    {
      question: "How can we get started with Medh?",
      answer: "To get started with Medh, visit our Collaboration Page or contact our support team at support@medh.co. We look forward to collaborating with you to bring innovative and effective education solutions to your institution.",
      category: "getting-started"
    },
  ];

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === ""
    ? faqs
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Function to determine appropriate icon for a FAQ based on content
  const getIconForQuestion = (question: string): React.ReactElement => {
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
    if (q.includes("communication") || q.includes("contact")) 
      return <MessageCircle className="w-5 h-5" style={{ color }} />;
    
    return <HelpCircle className="w-5 h-5" style={{ color }} />;
  };

  if (!isVisible) {
    return (
      <section className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 p-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg md:rounded-xl border border-white/50 dark:border-slate-600/50 p-6 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30">
            {/* Header with animated gradient */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                  FAQ Section
                </span>
                <div className="ml-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3bac63] to-[#F6B335] bg-clip-text text-transparent">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
                    Everything you need to know about partnering with Medh
                  </p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3bac63] dark:focus:ring-[#3bac63] focus:border-transparent text-sm transition-all duration-200"
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
                          border border-slate-200/50 dark:border-slate-600/50 rounded-xl overflow-hidden
                          transition-all duration-200 backdrop-blur-sm bg-white/70 dark:bg-slate-800/70
                          ${hoveredIndex === index ? 'shadow-lg scale-[1.01]' : 'shadow-md'}
                          ${openIndex === index ? 'ring-2 ring-[#3bac63]/20' : ''}
                        `}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <button
                          className={`w-full flex items-center justify-between p-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#3bac63] focus:ring-opacity-50 transition-all duration-300 ${
                            openIndex === index 
                              ? "bg-gradient-to-r from-[#3bac63]/10 to-[#3bac63]/5 dark:from-[#3bac63]/20 dark:to-[#3bac63]/10" 
                              : "hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
                          }`}
                          onClick={() => toggleFAQ(index)}
                          aria-expanded={openIndex === index}
                          aria-controls={`faq-content-${index}`}
                        >
                          <div className="flex items-center mr-2">
                            <motion.div 
                              animate={{
                                scale: openIndex === index ? 1.1 : 1,
                                backgroundColor: openIndex === index ? 'rgba(59, 172, 99, 0.2)' : 'rgba(148, 163, 184, 0.1)'
                              }}
                              transition={{ duration: 0.3 }}
                              className="mr-3 flex-shrink-0 p-2 rounded-lg"
                            >
                              {getIconForQuestion(faq.question)}
                            </motion.div>
                            <h3 className={`text-base sm:text-lg font-medium pr-8 transition-colors duration-300 ${
                              openIndex === index 
                                ? "text-[#3bac63] dark:text-[#3bac63]" 
                                : "text-slate-800 dark:text-slate-200"
                            }`}>
                              {faq.question}
                            </h3>
                          </div>
                          <motion.div 
                            animate={{ 
                              rotate: openIndex === index ? 180 : 0,
                              backgroundColor: openIndex === index ? 'rgba(59, 172, 99, 0.2)' : 'transparent',
                              color: openIndex === index ? '#3bac63' : '#94a3b8'
                            }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 p-1.5 rounded-full"
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
                                className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-600/50"
                                style={{ 
                                  borderLeft: `3px solid ${startColor}`,
                                  paddingLeft: '1.25rem'
                                }}
                              >
                                <div 
                                  className="text-slate-600 dark:text-slate-300 leading-relaxed"
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
                  className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-center backdrop-blur-sm"
                >
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    No matching FAQs found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    We couldn't find any FAQs matching "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#3bac63] hover:text-[#2d7978] dark:text-[#3bac63] dark:hover:text-[#2d7978] font-medium transition-colors duration-200"
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
              className="mt-8 p-6 bg-gradient-to-r from-[#3bac63]/10 via-white/50 to-[#3bac63]/10 dark:from-[#3bac63]/20 dark:via-slate-800/50 dark:to-[#3bac63]/20 rounded-xl border border-[#3bac63]/20 dark:border-[#3bac63]/30 backdrop-blur-sm"
            >
              <div className="text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  className="w-12 h-12 mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0 rounded-xl bg-[#3bac63]/20 flex items-center justify-center transform transition-transform duration-300"
                >
                  <Mail className="w-6 h-6 text-[#3bac63]" />
                </motion.div>
                <span>
                  Have more questions? Contact our support team at{" "}
                  <a 
                    href="mailto:care@medh.co" 
                    className="font-medium text-[#3bac63] hover:text-[#2d7978] dark:text-[#3bac63] dark:hover:text-[#2d7978] underline inline-flex items-center group transition-colors duration-200"
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SchoolFaq);
