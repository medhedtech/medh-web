"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, Lightbulb, Brain, Award, Zap, Sparkles, MessageCircle } from "lucide-react";
import DOMPurify from "dompurify";

// FAQ Data - Sanitize HTML content in answers
const faqs = [
  {
    category: "courses",
    question: "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
    answer: "<span class='block'>Our courses are designed to cover a wide range of topics, from technical skills such as AI, Data Science, Cybersecurity, and Cloud Computing to soft skills like Leadership, Communication and Personality Development Courses. The learning objectives are tailored to equip participants with practical, industry-relevant skills and knowledge.</span>",
  },
  {
    category: "courses",
    question: "What are the delivery methods for MEDH's Corporate Training Courses?",
    answer: "<span class='block'>Our courses are typically delivered through a flexible 6-week program with classes held twice a week. We offer both online and in-person training options, with interactive sessions, hands-on workshops, and comprehensive learning materials.</span>",
  },
  {
    category: "pricing",
    question: "What are the pricing and payment options for MEDH's Corporate Training Courses?",
    answer: "<span class='block'>We offer customized pricing based on the specific needs of your organization. Our pricing models include per-participant rates, bulk enrollment discounts, and tailored corporate packages. We provide flexible payment options including corporate invoicing, bulk payment discounts, and installment plans.</span>",
  },
  {
    category: "certification",
    question: "Are MEDH's Corporate Training Courses certified or accredited?",
    answer: "<span class='block'>Yes, our courses are designed with industry standards in mind. Upon completion, participants receive a recognized certification that validates their newly acquired skills. Our certifications are aligned with industry benchmarks and can enhance professional credentials.</span>",
  },
  {
    category: "courses",
    question: "Can MEDH tailor the training courses to specific business needs?",
    answer: "<span class='block'>Absolutely! We specialize in creating customized training programs that address your organization's unique skill gaps and strategic objectives. Our team works closely with you to develop a tailored curriculum that aligns with your specific business requirements.</span>",
  },
  {
    category: "support",
    question: "What are the qualifications and industry experience of MEDH's instructors?",
    answer: "<span class='block'>Our instructors are seasoned IT professionals with extensive industry experience and a proven track record of providing high-quality training. They bring real-world insights and practical knowledge to the training sessions, ensuring participants gain actionable skills directly applicable to their work.</span>",
  },
  {
    category: "support",
    question: "What post-training support and resources does MEDH provide?",
    answer: "<span class='block'>We offer comprehensive post-training support including access to learning materials, follow-up mentorship sessions, career guidance, and a professional network. Participants also receive ongoing access to our learning platform and resources for continued skill development.</span>",
  },
  {
    category: "courses",
    question: "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
    answer: "<span class='block'>Our courses stand out through our industry-aligned curriculum, experienced instructors, personalized learning approach, and comprehensive support. We focus on practical, hands-on learning that directly translates to workplace performance, setting us apart from traditional training providers.</span>",
  },
  {
    category: "enrollment",
    question: "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
    answer: "<span class='block'>Our enrollment process is straightforward. After an initial consultation to understand your needs, we provide a detailed proposal. Once agreed, we help you schedule the training, set up participant accounts, and provide pre-course materials. The entire process from initial contact to course commencement typically takes 2-4 weeks.</span>",
  },
];

// Categories configuration
const categories = [
  { id: "all", label: "All", count: faqs.length },
  { id: "courses", label: "Courses", count: faqs.filter(f => f.category === "courses").length },
  { id: "pricing", label: "Pricing", count: faqs.filter(f => f.category === "pricing").length },
  { id: "certification", label: "Certification", count: faqs.filter(f => f.category === "certification").length },
  { id: "support", label: "Support", count: faqs.filter(f => f.category === "support").length },
  { id: "enrollment", label: "Enrollment", count: faqs.filter(f => f.category === "enrollment").length }
];

function CourseAiFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
  // Optimize animations based on device capability
  useEffect(() => {
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

  // Enhanced icon mapping with more modern icons
  const getIconForQuestion = (question, category) => {
    const iconClasses = "w-5 h-5";
    switch(category) {
      case "courses":
        return <Brain className={`${iconClasses} text-violet-500`} />;
      case "pricing":
        return <Zap className={`${iconClasses} text-amber-500`} />;
      case "certification":
        return <Award className={`${iconClasses} text-emerald-500`} />;
      case "support":
        return <MessageCircle className={`${iconClasses} text-blue-500`} />;
      case "enrollment":
        return <Sparkles className={`${iconClasses} text-rose-500`} />;
      default:
        return <Lightbulb className={`${iconClasses} text-indigo-500`} />;
    }
  };

  // Filter FAQs based on active category
  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30
      }
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:py-12 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
        ref={containerRef}
      >
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#379392] to-[#379392]/80 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Everything you need to know about our corporate training programs
            </div>
          </motion.div>
        </div>

        {/* Category Filter Tabs - Horizontal scrollable on mobile */}
        <div className="mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex space-x-2 sm:space-x-3 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center sm:gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  flex items-center space-x-2 whitespace-nowrap
                  ${activeCategory === category.id
                    ? 'bg-[#379392] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
                `}
              >
                <span>{category.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <motion.div 
          className="space-y-3 sm:space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`
                group relative overflow-hidden rounded-xl transition-all duration-300
                ${openIndex === index ? 'shadow-lg' : 'shadow-sm hover:shadow-md'} 
                bg-white dark:bg-gray-800/50 backdrop-blur-sm
              `}
              layout
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex-shrink-0 mt-1">
                  {getIconForQuestion(faq.question, faq.category)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base sm:text-lg pr-8">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#379392]"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>

              {/* Answer Content */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-gray-600 dark:text-gray-300">
                      <div className="pl-9">
                        <div 
                          className="text-base leading-relaxed space-y-4"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(faq.answer, {
                              ALLOWED_TAGS: ['span'],
                              ALLOWED_ATTR: ['class']
                            })
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Support Section */}
        <motion.div 
          className="mt-10 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-[#379392]/10 via-white to-[#379392]/10 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 sm:p-8 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="text-gray-700 dark:text-gray-300 mb-4 text-base sm:text-lg">
              Still have questions? Our team is here to help!
            </div>
            <a 
              href="mailto:care@medh.co" 
              className="inline-flex items-center px-6 py-3 font-medium text-sm sm:text-base rounded-full bg-[#379392] text-white hover:bg-[#379392]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile-optimized styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .prose {
            font-size: 0.9375rem;
            line-height: 1.6;
          }
        }
      `}</style>
    </div>
  );
}

export default CourseAiFaq;
