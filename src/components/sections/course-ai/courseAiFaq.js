"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, Lightbulb, Brain, Award, Zap, Sparkles, BookOpen } from "lucide-react";
import DOMPurify from "dompurify";

function CourseAiFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const faqContentRefs = useRef([]);
  
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

  const faqs = [
    {
      question: "Who is this AI and Data Science course designed for?",
      answer: `
        <p>This course is designed for individuals interested in Artificial Intelligence and Data Science. It is suitable for:</p>
        <ul>
          <li><strong>Beginners</strong>: No prior AI or programming experience needed.</li>
          <li><strong>Professionals</strong>: Enhance your skills and knowledge in AI and Data Science.</li>
        </ul>
      `,
    },
    {
      question: "What is Data Science?",
      answer: `<p>Data science is a cross-disciplinary field focused on extracting useful knowledge from data. It combines:</p>
          <ul>
            <li><strong>Statistics and Machine Learning: </strong> To analyze and interpret data.</li>
            <li><strong>Computational Techniques: </strong> For handling large-scale data.</li>
            <li><strong>Application Areas: </strong> Biology, healthcare, business, finance, and internet data.</li>
          </ul>
        `,
    },
    {
      question: "What is Artificial Intelligence (AI)?",
      answer: `<p>AI involves building intelligent systems that can perform complex tasks without explicit programming. Key areas include:</p>
          <ul>
            <li>- Machine Translation</li>
            <li>- Computer Vision</li>
            <li>- Game Playing</li>
            <li>- Self-Driving Vehicles, etc.</li>
          </ul>
        `,
    },
    {
      question: "Why combine AI and Data Science in one course?",
      answer: `<p>Combining AI and Data Science provides a comprehensive skill set that:</p>
        <ul>
            <li><strong>Integrates Analysis and AI Model Building: </strong> For deriving valuable insights.</li>
            <li><strong>Interdisciplinary Approach: </strong> Enhances understanding of real-world data problems.</li>
            <li><strong>Meets Industry Demand: </strong> Prepares students for roles requiring both AI and Data Science expertise.</li>
          </ul>`,
    },
    {
      question: "What programming language is used in the course?",
      answer: `<p>The course primarily uses Python for implementing AI and Data Science concepts. Python is widely used in the industry due to its extensive libraries and ease of use, making it an ideal language for AI and Data Science applications.</p>`,
    },
    {
      question: "Are there any prerequisites for enrolling in this course?",
      answer: `<p>While there are no strict prerequisites, having a basic understanding of programming concepts and familiarity with mathematics (algebra, calculus, and probability) will be beneficial. Basic programming knowledge, preferably in Python, is recommended but not mandatory.</p>`,
    },
    {
      question: "How is the course structured?",
      answer: `<p>The course spans 16 to 48 weeks, with 3-4 hours of content per week. It includes:</p> 
          <ul>
            <li>- Online Classes and Video Lectures</li>
            <li>- Hands-on Exercises and Quizzes</li>
            <li>- <strong>Capstone Project: </strong> In the final week.</li>
          </ul>`,
    },
    {
      question: "Are there any real-world projects included in the course?",
      answer: `<p>Yes, the course includes:</p>
          <ul>
            <li>- Capstone Project(s)</li>
            <li>- <strong>Practical Experience: </strong> Apply knowledge to hands-on AI and Data Science projects.</li>
          </ul>`,
    },
    {
      question: "What makes MEDH's AI and Data Science course unique?",
      answer: `<p>MEDH's AI and Data Science course stands out for its:</p>
          <ul>
            <li><strong>Comprehensive Curriculum: </strong> Covering both AI and Data Science in-depth.</li>
            <li><strong>Expert Instructors: </strong> With extensive industry experience.</li>
            <li><strong>Hands-on Projects: </strong> Ensuring practical experience.</li>
            <li><strong>Flexible Learning: </strong> Access course materials anytime, anywhere.</li>
            <li><strong>Career Support: </strong> Assisting you beyond course completion.</li>
          </ul>`,
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
  
  // Improved content variants for smoother animations
  const contentVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: { 
        height: { 
          duration: 0.3,
          ease: [0.33, 1, 0.68, 1] // Custom easing for height
        },
        opacity: { 
          duration: 0.15 
        }
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        height: { 
          duration: 0.4,
          ease: [0.33, 1, 0.68, 1]
        },
        opacity: { 
          duration: 0.25,
          delay: 0.1
        }
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
              layout
              layoutRoot
              ref={el => faqContentRefs.current[index] = el}
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
                    <BookOpen className="w-6 h-6 text-medhgreen" />
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
                    stiffness: 500,
                    damping: 25
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
              
              <AnimatePresence initial={false} mode="sync">
                {openIndex === index && (
                  <motion.div
                    key={`content-${index}`}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-5 pb-5 pt-1 relative z-10"
                    style={{ 
                      willChange: "height, opacity",
                      transformOrigin: "top",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      className="text-gray-600 dark:text-gray-300 prose prose-sm sm:prose-base max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(faq.answer),
                      }}
                    ></div>
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
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CourseAiFaq;
