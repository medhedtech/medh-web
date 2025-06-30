"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, PieChart, Clock, Users, Award, BookOpen, Mail, Lightbulb, Database, DollarSign, HelpCircle, BarChart, Laptop, Briefcase, PenTool, Headphones } from "lucide-react";
import DOMPurify from "dompurify";

function DigiMarketingFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  
  // Theme colors - centralized for consistency
  const themeColors = {
    primary: {
      light: '#3b82f6', // Blue 500 - Digital primary
      medium: '#2563eb', // Blue 600
      dark: '#1d4ed8', // Blue 700
    },
    secondary: {
      light: '#8b5cf6', // Violet 500 - Analytics accent
      medium: '#7c3aed', // Violet 600
      dark: '#6d28d9', // Violet 700
    },
    accent: {
      light: '#ec4899', // Pink 500 - Marketing accent
      medium: '#db2777', // Pink 600
      dark: '#be185d', // Pink 700
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
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      underlineGradient: "from-blue-500 to-blue-700"
    },
    dark: {
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      underlineGradient: "from-blue-400 to-blue-600"
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
    if (question.includes("What is Digital Marketing") || question.includes("meant by Data Analytics")) 
      return themeColors.primary.light;
    if (question.includes("duration") || question.includes("long is") || question.includes("how long")) 
      return themeColors.secondary.light;
    if (question.includes("suitable") || question.includes("beginners") || question.includes("Who can")) 
      return themeColors.accent.light;
    if (question.includes("career") || question.includes("certificate") || question.includes("job")) 
      return '#f59e0b'; // Amber 500
    if (question.includes("enroll") || question.includes("payment") || question.includes("financial"))
      return '#10b981'; // Emerald 500
    if (question.includes("interact") || question.includes("combine") || question.includes("support") || question.includes("technical"))
      return '#0ea5e9'; // Sky 500
    if (question.includes("online") || question.includes("delivered"))
      return '#64748b'; // Slate 500
    return themeColors.primary.medium; // Default
  };

  // Custom icon mapping for different FAQ categories
  const getIconForQuestion = () => {
    return (
      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-700">
        <BookOpen className="w-6 h-6 text-medhgreen" />
      </div>
    );
  };

  const faqs = [
    {
      question: "What is Digital Marketing?",
      answer:
        "Digital marketing encompasses the use of various online channels and platforms to promote products, services, or brands to a targeted audience. It involves leveraging digital technologies and strategies to connect with potential customers, build brand awareness, drive website traffic, and generate leads or sales. Key components of digital marketing include search engine optimization (SEO), social media marketing (SMM), content marketing, email marketing, and online advertising. The goal of digital marketing is to engage and convert prospects into customers, ultimately contributing to the growth and success of businesses in the digital realm.",
    },
    {
      question: "What is meant by Data Analytics?",
      answer:
        "Data analytics refers to the process of examining large sets of data to uncover valuable insights, trends, and patterns that can be used to inform decision-making and drive strategic actions. It involves the use of various tools, techniques, and statistical methods to analyze data, identify correlations, and extract meaningful information. Data analytics plays a crucial role in understanding customer behavior, optimizing business processes, predicting future trends, and improving overall performance. By harnessing the power of data analytics, organizations can make informed decisions, enhance operational efficiency, and gain a competitive edge in their respective industries.",
    },
    {
      question:
        "Why combine Digital Marketing and Data Analytics in one course?",
      answer:
        "Combining Digital Marketing and Data Analytics in one course offers a holistic approach to understanding and leveraging the symbiotic relationship between the two disciplines. Digital marketing relies on data-driven insights to optimize strategies, target the right audience, and maximize campaign performance. By integrating data analytics into the curriculum, learners gain a comprehensive skill set that is highly relevant in today's digital landscape. This combination equips individuals with the proficiency to create data-informed marketing strategies, enhance customer engagement, and drive impactful business outcomes.",
    },
    {
      question:
        "Why Digital Marketing with Data Analytics Online course, and what will I learn from it?",
      answer:
        "The Digital Marketing with Data Analytics Online course is a comprehensive program designed to provide learners with the essential skills and knowledge required to excel in the digital marketing industry. Throughout the course, participants will delve into various facets of digital marketing, including Search Engine Optimization (SEO), Social Media Marketing (SMM), Email Marketing, Content Marketing, and more. Additionally, the course will equip learners with expertise in leveraging data analytics tools to analyze and optimize marketing campaigns for enhanced performance and results.",
    },
    {
      question:
        "Is this course suitable for beginners with no prior experience in digital marketing or data analytics?",
      answer:
        "Yes, absolutely! The course is tailored to accommodate learners of all levels, including beginners with no prior experience in digital marketing or data analytics. The curriculum begins with foundational concepts and gradually progresses to more advanced topics, ensuring that all participants can effectively engage and acquire valuable skills irrespective of their background.",
    },
    {
      question: "What are the prerequisites for enrolling in the course?",
      answer:
        "There are no strict prerequisites for enrolling in the course. However, having a basic understanding of marketing concepts and a willingness to learn will be beneficial. Familiarity with general computer usage and internet navigation will also facilitate a smoother learning experience.",
    },
    {
      question:
        "What career opportunities are available after completing this course?",
      answer:
        "The course prepares you for various roles, including: Digital Marketing Specialist, Data Marketing Analyst, SEO Analyst/Manager, Social Media Manager, Digital Marketing Manager, Web Analytics Specialist, PPC (Pay-Per-Click) Specialist, Market Research Analyst, Digital Marketing Consultant, Brand Manager, Digital Marketing Strategist, Customer Insights Analyst, etc.",
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:
        "The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 4 to 12 months (16-48 weeks). This encompasses a weekly commitment of 4-6 hours only, providing the flexibility to align the course pace with your other commitments and schedules.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "Yes, upon successful completion of the Digital Marketing with Data Analytics Online course, you will receive a certificate of completion jointly issued by MEDH and STEM. This esteemed certificate will bolster your resume for job opportunities and can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms.",
    },
    {
      question:
        "Will I have access to course materials after completing the course?",
      answer:
        "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    },
    {
      question:
        "How do I enroll in the course, and what are the payment options?",
      answer:
        "To enroll in the course, simply visit our website and find the Digital Marketing with Data Analytics Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods.",
    },
    {
      question: "Can I interact with other students during the course?",
      answer:
        "Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
    },
    {
      question: "Will I have access to support during the course?",
      answer:
        "Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course.",
    },
    {
      question:
        "Is there any technical support available if I encounter issues during the course?",
      answer:
        "Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues.",
    },
    {
      question: "Is the course delivered entirely online?",
      answer:
        "Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments.",
    },
    {
      question: "Is financial assistance available for the course?",
      answer:
        "Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option. Note: If you have any other questions or concerns not covered in the FAQs, please feel free to contact our support team care@medh.co, and we'll be happy to assist you!",
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
      ['#3b82f6', '#2563eb'], // Blue to Blue
      ['#8b5cf6', '#7c3aed'], // Violet to Violet
      ['#ec4899', '#db2777'], // Pink to Pink
      ['#f59e0b', '#d97706'], // Amber to Amber
      ['#10b981', '#059669'], // Emerald to Emerald
      ['#0ea5e9', '#0284c7'], // Sky to Sky
    ];
    
    return palettes[index % palettes.length];
  };

  return (
    <section className="w-full py-12 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-4">
            Explore FAQs
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mb-6"></div>
          <p className="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about MEDH&#39;s Digital Marketing
            with Data Analytics Course. Learn about course structure,
            prerequisites, career prospects, and more.
          </p>
        </div>

        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-4"
          style={{ 
            willChange: 'opacity, transform', 
            transformStyle: 'preserve-3d'
          }}
        >
          {faqs.map((faq, index) => {
            const [startColor, endColor] = getGradientColors(index);
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05, 
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              >
                <div 
                  className={`
                    rounded-lg shadow-sm bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700
                    transition-all duration-200 ease-in-out
                    ${hoveredIndex === index ? 'shadow-md translate-y-[-2px]' : 'shadow-sm'}
                  `}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 rounded-lg"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-content-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      {getIconForQuestion()}
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`flex-shrink-0 ml-2 transition-transform duration-300 transform ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        key={`content-${index}`}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        id={`faq-content-${index}`}
                        className="overflow-hidden"
                      >
                        <div 
                          className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300" 
                          style={{ 
                            borderLeft: `3px solid ${getCategoryColor(faq.question)}`,
                            marginLeft: '2rem',
                            paddingLeft: '1.5rem'
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(faq.answer.replace(/\n/g, '<br/>'))
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Support Section (animated, matching Vedic Maths) */}
      <motion.div 
        className="mt-12 text-center bg-white dark:bg-gray-800/90 p-6 rounded-xl shadow-md transform-gpu w-full max-w-5xl mx-auto"
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
          Still have questions about Digital Marketing with Data Analytics? We're here to help!
        </p>
        <a
          href="https://mail.google.com/mail/u/0/?to=care@medh.co&fs=1&tf=cm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform-gpu hover:scale-105 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:shadow-lg"
        >
          <span className="mr-2">Contact Support</span>
        </a>
      </motion.div>
    </section>
  );
}

export default DigiMarketingFaq;
