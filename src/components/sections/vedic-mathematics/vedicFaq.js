"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, Calculator, Clock, Users, Award, BookOpen, Brain, Sparkles, Infinity, School } from "lucide-react";
import DOMPurify from "dompurify";

function VedicFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
  // Theme colors - centralized for consistency
  const themeColors = {
    primary: {
      light: '#f59e0b', // Amber 500
      medium: '#d97706', // Amber 600
      dark: '#b45309', // Amber 700
    },
    secondary: {
      light: '#10b981', // Emerald 500
      medium: '#059669', // Emerald 600
      dark: '#047857', // Emerald 700
    },
    accent: {
      light: '#3b82f6', // Blue 500
      medium: '#2563eb', // Blue 600
      dark: '#1d4ed8', // Blue 700
    },
    neutral: {
      light: '#f3f4f6', // Gray 100
      medium: '#9ca3af', // Gray 400
      dark: '#4b5563', // Gray 600
    }
  };

  // Enhanced heading gradients for different themes
  const titleGradients = {
    light: {
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      underlineGradient: "from-amber-500 to-amber-700"
    },
    dark: {
      gradient: "from-amber-400 via-amber-500 to-amber-600",
      underlineGradient: "from-amber-400 to-amber-600"
    },
  };
  
  // Optimize animations based on device capability
  useEffect(() => {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && containerRef.current) {
            containerRef.current.dataset.visible = 'true';
            lazyLoadObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      if (containerRef.current) {
        lazyLoadObserver.observe(containerRef.current);
      }
      
      return () => {
        if (containerRef.current) {
          lazyLoadObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get color for category based on question content
  const getCategoryColor = (question) => {
    if (question.includes("What is") || question.includes("Vedic Math")) 
      return themeColors.primary.light;
    if (question.includes("duration") || question.includes("long")) 
      return themeColors.secondary.light;
    if (question.includes("Who can") || question.includes("suitable")) 
      return themeColors.accent.light;
    if (question.includes("certificate") || question.includes("course materials")) 
      return '#ec4899'; // Pink 500
    if (question.includes("support") || question.includes("interact"))
      return '#8b5cf6'; // Violet 500
    if (question.includes("everyday") || question.includes("academic"))
      return '#059669'; // Emerald 600
    return themeColors.primary.medium; // Default
  };

  // Custom icon mapping for different FAQ categories
  const getIconForQuestion = () => {
    return <BookOpen className="w-6 h-6 text-medhgreen" />;
  };

  const faqs = [
    {
      question: "What is Vedic Math?",
      answer:
        "Vedic Math is an ancient Indian system of mathematics, also known as 'Veda Ganita.' It's based on a collection of sutras (aphorisms) and sub-sutras (corollaries) that provide efficient and quick methods for arithmetic and algebraic calculations. Vedic Math emphasizes mental math techniques to perform calculations with ease and speed.",
    },
    {
      question: "Who can take the Vedic Maths Course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "How long does the course usually last?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Can Vedic Math be used in everyday life?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question:
        "Will Vedic Math classes complement a students academic performance?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Is Vedic Math course different from Math tuitions?",
      answer: `It is an (after-school) math-learning program. Unlike home-based tuition that primarily focuses on the school syllabus and test preparation, Vedic Math is a skill development program aimed at enhancing a child's ability to perform calculations. This proficiency not only benefits their performance in school mathematics but also in math Olympiads. \nImportantly, Vedic Mathematics should not be seen as a replacement for traditional math but rather as a valuable complement to it. While some of the techniques may be intriguing and advantageous for certain calculations, a thorough grasp of the fundamental concepts of regular mathematics remains essential for a comprehensive understanding of the subject.`,
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "How long does the course usually last?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question:
        "Will I have access to course materials after completing the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Can I interact with other students during the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Will I have access to support during the course?",
      answer:
        "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    },
    {
      question:
        "Is there any technical support available if I encounter issues during the course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "Is the course delivered entirely online?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: "Is financial assistance available for the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
  ];

  // Animation variants - optimized for performance
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
      ['#f59e0b', '#d97706'], // Amber to Amber
      ['#10b981', '#059669'], // Emerald to Emerald
      ['#3b82f6', '#2563eb'], // Blue to Blue
      ['#8b5cf6', '#7c3aed'], // Violet to Violet
    ];
    return palettes[index % palettes.length];
  };

  // Function to get theme-adaptive title gradients
  const getThemeAdaptiveTitle = () => {
    // For now, we'll create different class variants and use CSS to handle them
    return {
      title: `bg-gradient-to-r ${titleGradients.light.gradient} dark:${titleGradients.dark.gradient} bg-clip-text text-transparent`,
      underline: `bg-gradient-to-r ${titleGradients.light.underlineGradient} dark:${titleGradients.dark.underlineGradient}`
    };
  };

  const titleClasses = getThemeAdaptiveTitle();

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20 rounded-xl will-change-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100, 
          damping: 20
        }}
        className="max-w-5xl mx-auto"
        style={{ 
          willChange: "transform, opacity",
          backfaceVisibility: "hidden"
        }}
        ref={containerRef}
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            style={{ 
              willChange: "transform, opacity",
              transformOrigin: "center" 
            }}
          >
            <h2 className={`text-4xl font-bold inline-block mb-4 ${titleClasses.title}`}>
              Explore FAQs
            </h2>
            <div className={`w-16 h-1 mx-auto rounded-full ${titleClasses.underline}`}></div>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            Discover everything you need to know about our Vedic Mathematics course!
          </p>
        </div>

        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            willChange: "transform",
            perspective: 1000
          }}
        >
          {faqs.map((faq, index) => {
            const [color1, color2] = getGradientColors(index);
            const categoryColor = getCategoryColor(faq.question);
            
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  relative overflow-hidden rounded-xl transform-gpu transition-all duration-300
                  ${openIndex === index ? 'shadow-lg' : 'shadow-md'} 
                  ${hoveredIndex === index && openIndex !== index ? 'scale-[1.01]' : 'scale-100'}
                  bg-white dark:bg-gray-800/90 border-0
                `}
                style={{ 
                  willChange: hoveredIndex === index ? "transform, box-shadow" : "auto",
                  translateZ: 0,
                  boxShadow: openIndex === index ? `0 4px 20px -2px ${categoryColor}25` : ''
                }}
                layout="position"
                layoutDependency={openIndex}
                layoutId={`faq-${index}`}
              >
                {/* Background gradient effect */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10"
                  style={{
                    background: `radial-gradient(circle, ${categoryColor} 0%, transparent 70%)`,
                    willChange: openIndex === index ? "transform" : "auto",
                    backfaceVisibility: "hidden"
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: openIndex === index ? 5 : 1 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                />
                
                {/* Question header */}
                <div
                  className={`
                    flex justify-between items-center p-5 cursor-pointer
                    ${openIndex === index ? 'bg-opacity-5' : 'hover:bg-opacity-5'} 
                    rounded-t-xl relative z-10
                  `}
                  onClick={() => toggleFAQ(index)}
                  style={{
                    borderLeft: openIndex === index ? `3px solid ${categoryColor}` : ''
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-700"
                    >
                      {getIconForQuestion()}
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ 
                      duration: 0.2,
                      type: "spring",
                      stiffness: 500
                    }}
                    style={{ 
                      transformOrigin: "center",
                      willChange: "transform",
                      color: categoryColor
                    }}
                  >
                    {openIndex === index ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </motion.div>
                </div>
                
                {/* Answer content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="px-5 pb-5 pt-1 relative z-10"
                      style={{ 
                        willChange: "height, opacity, transform",
                        transformOrigin: "top",
                        overflow: "hidden"
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.1,
                          ease: "easeOut"
                        }}
                        className="text-gray-600 dark:text-gray-300 prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                        style={{ 
                          transformOrigin: "top center",
                          paddingLeft: '20px',
                          borderLeft: `1px solid ${categoryColor}40`,
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {faq.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="mt-12 text-center bg-white dark:bg-gray-800/90 p-6 rounded-xl shadow-md transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          style={{ 
            willChange: "transform, opacity",
            backfaceVisibility: "hidden"
          }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Still have questions about Vedic Mathematics? We're here to help! 
          </p>
          <a 
            href="https://mail.google.com/mail/u/0/?to=care@medh.co&fs=1&tf=cm" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform-gpu hover:scale-105 bg-gradient-to-r ${titleGradients.light.gradient} dark:${titleGradients.dark.gradient} text-white hover:shadow-lg`}
          >
            <span className="mr-2">Contact Support</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default VedicFaq;
