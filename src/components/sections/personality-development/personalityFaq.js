"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import DOMPurify from "dompurify";

function PersonalityFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
  // Theme colors - centralized for consistency
  const themeColors = {
    primary: {
      light: '#9333ea', // Purple 600
      medium: '#7e22ce', // Purple 700
      dark: '#6b21a8', // Purple 800
    },
    secondary: {
      light: '#ec4899', // Pink 500
      medium: '#db2777', // Pink 600
      dark: '#be185d', // Pink 700
    },
    accent: {
      light: '#8b5cf6', // Violet 500
      medium: '#7c3aed', // Violet 600
      dark: '#6d28d9', // Violet 700
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
      gradient: "from-purple-600 via-fuchsia-500 to-pink-500",
      underlineGradient: "from-purple-600 to-pink-500"
    },
    dark: {
      gradient: "from-purple-400 via-fuchsia-300 to-pink-300",
      underlineGradient: "from-purple-400 to-pink-300"
    },
    system: {
      gradient: "from-indigo-600 via-violet-500 to-purple-500",
      underlineGradient: "from-indigo-500 to-purple-500"
    },
    modern: {
      gradient: "from-blue-600 via-indigo-500 to-violet-500",
      underlineGradient: "from-blue-500 to-violet-500"
    },
    classic: {
      gradient: "from-amber-500 via-orange-500 to-pink-500",
      underlineGradient: "from-amber-500 to-pink-500"
    },
    nature: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      underlineGradient: "from-emerald-500 to-cyan-500"
    },
    elegant: {
      gradient: "from-slate-700 via-slate-600 to-slate-500",
      underlineGradient: "from-slate-600 to-slate-500"
    }
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
    if (question.includes("What is the Personality") || question.includes("topics")) 
      return themeColors.primary.light;
    if (question.includes("duration") || question.includes("long is"))
      return themeColors.secondary.light;
    if (question.includes("suitable") || question.includes("homemakers") || question.includes("housewives")) 
      return themeColors.accent.light;
    if (question.includes("career") || question.includes("certificate")) 
      return '#f59e0b'; // Amber 500
    if (question.includes("enroll") || question.includes("payment"))
      return '#10b981'; // Emerald 500
    if (question.includes("interact") || question.includes("questions") || question.includes("support"))
      return '#3b82f6'; // Blue 500
    return themeColors.primary.medium; // Default
  };

  // Custom icon mapping for different FAQ categories - using BookOpen for all with medh green color
  const getIconForQuestion = (question) => {
    return (
      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-700">
        <BookOpen className="w-6 h-6 text-medhgreen" />
      </div>
    );
  };

  const faqs = [
    {
      question: "What is the Personality Development Course?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "What is the duration of the Personality Development Course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question:
        "Is the Personality Development Course suitable for all age groups?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "What are the key topics covered in the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: "Will the course help in career advancement?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Is this Personality Development Course from Medh is suitable for homemakers / housewives?",
      answer:"Certainly! Our Personality Development Course is well-suited for homemakers and housewives, equipping them with essential life skills, confidence, and interpersonal abilities. It fosters personal growth, enhances communication and leadership skills, and provides valuable tools for managing stress, time, and relationships. Our program aims to boost confidence, improve family life, and empower women in their roles as homemakers, offering practical guidance and support to help them effectively manage their responsibilities and find fulfillment in their daily lives."
    },
    {
      question: "Are there any prerequisites for enrolling in the course?",  
      answer:"There are no specific prerequisites for enrolling in the course. It is open to individuals from all backgrounds and professions. The only requirement is the willingness to learn and grow personally and professionally."
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:"The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 3 to 9 months (12-36 weeks). This encompasses a weekly commitment of 2-3 hours only, providing the flexibility to align the course pace with your other commitments and schedules."
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:"Yes, upon successful completion of the AI with Data Analytics course, you will receive a certificate of completion issued by MEDH. This esteemed certificate can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms."
    },
    {
      question:"Will I have access to course materials after completing the course?",
      answer:"Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed."
    },
    {
      question:"How do I enroll in the course, and what are the payment options?",
      answer:"To enroll in the course, simply visit our website and find the Personality Development Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods."
    },
    {
      question:"Can I interact with other students during the course?",
      answer:"Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience."
    },
    {
      question:"What if I have questions or need additional support during the course?",
      answer:"Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course."
    },
    {
      question:"Is there any technical support available if I encounter issues during the course?",
      answer:"Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues."
    },
    {
      question:"Is the course delivered entirely online?",
      answer:"Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments."
    },
    {
      question:"Is financial assistance available for the course?",
      answer:"Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option."
    }
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
      ['#9333ea', '#7c3aed'], // Purple to Violet
      ['#ec4899', '#d946ef'], // Pink to Fuchsia
      ['#8b5cf6', '#6366f1'], // Violet to Indigo
      ['#c026d3', '#9333ea'], // Fuchsia to Purple
    ];
    return palettes[index % palettes.length];
  };

  // Function to get theme-adaptive title gradients
  const getThemeAdaptiveTitle = () => {
    // We can enhance this further to detect the actual theme being used
    // For now, we'll create different class variants and use CSS to handle them
    return {
      title: `bg-gradient-to-r ${titleGradients.light.gradient} dark:${titleGradients.dark.gradient} bg-clip-text text-transparent`,
      underline: `bg-gradient-to-r ${titleGradients.light.underlineGradient} dark:${titleGradients.dark.underlineGradient}`
    };
  };

  const titleClasses = getThemeAdaptiveTitle();

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 rounded-xl will-change-auto">
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
            <h2 className={`text-4xl font-bold inline-block mb-4 text-black dark:text-white`}>
              Explore FAQs
            </h2>
            <div className={`w-16 h-1 mx-auto rounded-full ${titleClasses.underline}`}></div>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mt-4">
            Discover everything you need to know about our transformative Personality Development course!
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
                    {getIconForQuestion(faq.question)}
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
                          borderLeft: `1px solid ${categoryColor}40`
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
            Still have questions? We're here to help! 
          </p>
          <a 
            href="https://mail.google.com/mail/?view=cm&to=care@medh.co"
            target="_blank"
            rel="noopener noreferrer"
            className={
              `inline-flex items-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform-gpu hover:scale-105 
              bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 
              dark:from-emerald-400 dark:via-green-600 dark:to-lime-500 
              text-white hover:shadow-lg`
            }
          >
            <span>Contact Support</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PersonalityFaq;
