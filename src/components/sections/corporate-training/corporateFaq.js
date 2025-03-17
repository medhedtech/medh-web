"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, Lightbulb, Brain, Award, Zap, Sparkles } from "lucide-react";
import DOMPurify from "dompurify";

function CourseAiFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
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

  // Custom emoji and icon mapping for different FAQ categories
  const getIconForQuestion = (question) => {
    if (question.includes("designed for")) return <Brain className="w-6 h-6 text-violet-500" />;
    if (question.includes("Data Science")) return <Zap className="w-6 h-6 text-blue-500" />;
    if (question.includes("Artificial Intelligence")) return <Sparkles className="w-6 h-6 text-amber-500" />;
    if (question.includes("programming language")) return <Lightbulb className="w-6 h-6 text-green-500" />;
    if (question.includes("MEDH")) return <Award className="w-6 h-6 text-pink-500" />;
    return <Lightbulb className="w-6 h-6 text-indigo-500" />;
  };

  const faqs = [
    {
      category: "courses",
      question: "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
      answer: "Our courses are designed to cover a wide range of topics, from technical skills such as AI, Data Science, Cybersecurity, and Cloud Computing to soft skills like Leadership, Communication and Personality Development Courses. The learning objectives are tailored to equip participants with practical, industry-relevant skills and knowledge.",
    },
    {
      category: "courses",
      question: "What are the delivery methods for MEDH's Corporate Training Courses?",
      answer: "Our courses are typically delivered through a flexible 6-week program with classes held twice a week. We offer both online and in-person training options, with interactive sessions, hands-on workshops, and comprehensive learning materials.",
    },
    {
      category: "pricing",
      question: "What are the pricing and payment options for MEDH's Corporate Training Courses?",
      answer: "We offer customized pricing based on the specific needs of your organization. Our pricing models include per-participant rates, bulk enrollment discounts, and tailored corporate packages. We provide flexible payment options including corporate invoicing, bulk payment discounts, and installment plans.",
    },
    {
      category: "certification",
      question: "Are MEDH's Corporate Training Courses certified or accredited?",
      answer: "Yes, our courses are designed with industry standards in mind. Upon completion, participants receive a recognized certification that validates their newly acquired skills. Our certifications are aligned with industry benchmarks and can enhance professional credentials.",
    },
    {
      category: "courses",
      question: "Can MEDH tailor the training courses to specific business needs?",
      answer: "Absolutely! We specialize in creating customized training programs that address your organization's unique skill gaps and strategic objectives. Our team works closely with you to develop a tailored curriculum that aligns with your specific business requirements.",
    },
    {
      category: "support",
      question: "What are the qualifications and industry experience of MEDH's instructors?",
      answer: "Our instructors are seasoned IT professionals with extensive industry experience and a proven track record of providing high-quality training. They bring real-world insights and practical knowledge to the training sessions, ensuring participants gain actionable skills directly applicable to their work.",
    },
    {
      category: "support",
      question: "What post-training support and resources does MEDH provide?",
      answer: "We offer comprehensive post-training support including access to learning materials, follow-up mentorship sessions, career guidance, and a professional network. Participants also receive ongoing access to our learning platform and resources for continued skill development.",
    },
    {
      category: "courses",
      question: "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
      answer: "Our courses stand out through our industry-aligned curriculum, experienced instructors, personalized learning approach, and comprehensive support. We focus on practical, hands-on learning that directly translates to workplace performance, setting us apart from traditional training providers.",
    },
    {
      category: "enrollment",
      question: "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
      answer: "Our enrollment process is straightforward. After an initial consultation to understand your needs, we provide a detailed proposal. Once agreed, we help you schedule the training, set up participant accounts, and provide pre-course materials. The entire process from initial contact to course commencement typically takes 2-4 weeks.",
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

  return (
    <div className="w-full px-4 py-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl will-change-auto">
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
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500 dark:from-violet-400 dark:to-blue-300 inline-block mb-4">
              Explore FAQs
            </h2>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover everything you need to know about our amazing AI and Data Science course!
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
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative overflow-hidden rounded-xl transform-gpu transition-all duration-300
                ${openIndex === index ? 'shadow-lg' : 'shadow-md'} 
                ${hoveredIndex === index && openIndex !== index ? 'scale-[1.01]' : 'scale-100'}
                bg-white dark:bg-gray-800 border-0
              `}
              style={{ 
                willChange: hoveredIndex === index ? "transform, box-shadow" : "auto",
                translateZ: 0
              }}
              layout="position"
              layoutDependency={openIndex}
              layoutId={`faq-${index}`}
            >
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10"
                style={{
                  background: `radial-gradient(circle, 
                    ${index % 3 === 0 ? '#8b5cf6' : index % 3 === 1 ? '#3b82f6' : '#ec4899'} 0%, 
                    transparent 70%)`,
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
              
              <div
                className={`
                  flex justify-between items-center p-5 cursor-pointer
                  ${openIndex === index ? 'bg-opacity-5' : 'hover:bg-opacity-5'} 
                  rounded-t-xl relative z-10
                `}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-700">
                    {getIconForQuestion(faq.question)}
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
                    willChange: "transform"
                  }}
                >
                  {openIndex === index ? (
                    <ChevronDown className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  )}
                </motion.div>
              </div>
              
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
                      style={{ transformOrigin: "top center" }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(faq.answer),
                      }}
                    ></motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transform-gpu"
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
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Still have questions? We're here to help! 
          </p>
          <a 
            href="mailto:care@medh.co" 
            className="inline-flex items-center px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600 transition-all duration-300 transform-gpu hover:scale-105"
            style={{ 
              willChange: "transform",
              backfaceVisibility: "hidden"
            }}
          >
            <span className="mr-2">Contact Support</span>
            <span className="text-xl">✨</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CourseAiFaq;
