"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Lightbulb, GraduationCap, ArrowUp, ChevronRight, ChevronDown } from "lucide-react";

// Reusable Accordion component for better content organization
const Accordion = memo(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl mb-3 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <button
        className={`w-full flex justify-between items-center p-3 md:p-4 text-left transition-all duration-300 ${
          isOpen 
            ? "bg-gradient-to-r from-primary-500 to-blue-500 text-white dark:from-primary-500 dark:to-blue-500 font-semibold shadow-md" 
            : "bg-white dark:from-gray-800/90 dark:to-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        } ${titleClassName || ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[16px] md:text-[18px] flex items-center">
          <span className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${
            isOpen 
              ? "bg-white animate-pulse" 
              : "bg-blue-500 dark:bg-blue-500"
          }`}></span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-center rounded-full ${
            isOpen 
              ? "bg-white/20 dark:bg-white/20" 
              : "bg-blue-500/10 dark:bg-blue-500/20"
          } w-6 h-6 md:w-7 md:h-7`}
        >
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${
            isOpen ? "text-white" : "text-blue-500 dark:text-blue-500"
          }`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0.5 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`p-3 md:p-4 bg-white dark:from-gray-800 dark:to-gray-850 border-t border-gray-100 dark:border-gray-700 ${contentClassName || ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
            Why Digital Marketing with Data Analytics?
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mb-6">
            Combining the essential disciplines of Digital Marketing with Data
            Analytics, this course is instrumental in driving business success
            in today&#39;s digital age. Here are several compelling reasons that
            underscore the exceptional value of this course:
          </p>
          
          <div className="space-y-2 md:space-y-4">
            <Accordion title="Data Empowerment">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                In the data-driven landscape, data analytics enables digital marketers to extract valuable insights from vast data pools, facilitating informed decision-making and campaign optimization for maximum ROI.
              </p>
            </Accordion>
            
            <Accordion title="Competitive Edge">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Staying current with evolving digital marketing trends is crucial. Data analytics equips marketers to identify emerging trends, consumer behavior patterns, and market opportunities, providing a competitive advantage in the fast-paced digital arena.
              </p>
            </Accordion>
            
            <Accordion title="Personalized Marketing">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                By segmenting audiences based on preferences, behaviors, and demographics, data analytics facilitates the delivery of personalized and targeted marketing messages, enhancing campaign effectiveness and customer experiences.
              </p>
            </Accordion>
            
            <Accordion title="Performance Measurement">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Data analytics enables precise measurement of campaign impact, tracking key performance indicators (KPIs), identifying success metrics, and optimizing resource allocation for enhanced marketing strategies.
              </p>
            </Accordion>
            
            <Accordion title="Customer Journey Insight">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Marketers gain insights into the entire customer journey, from initial contact to conversion and beyond, allowing for the creation of seamless and engaging customer experiences.
              </p>
            </Accordion>
            
            <Accordion title="Career Opportunities">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Professionals skilled in digital marketing and data analytics are highly sought after. This course offers diverse career prospects in marketing, advertising, market research, and business analytics.
              </p>
            </Accordion>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mt-6">
            Equipping marketers with a comprehensive skill set, this course
            empowers individuals to thrive in the digital landscape, make
            data-driven decisions, and deliver impactful results for businesses
            and organizations. It serves as a transformative learning journey,
            setting individuals on a path of continuous success in the digital
            age.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
            Course Benefits
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mb-6">
            The Digital Marketing with Data Analytics Course offers numerous
            benefits that are essential for businesses and professionals in the
            digital landscape. By integrating digital marketing and data
            analytics, this course provides a comprehensive skill set that
            empowers individuals to thrive in the modern business environment.
          </p>
          
          <div className="space-y-2 md:space-y-4">
            <Accordion title="Holistic Skill Set">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Equips learners with a comprehensive skill set that combines the principles of digital marketing with data analytics, creating a powerful synergy that enhances marketing effectiveness.
              </p>
            </Accordion>
            
            <Accordion title="Data-Driven Decision Making">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Enables learners to make informed decisions based on data insights rather than relying on guesswork, leading to more effective campaigns and strategies with measurable outcomes.
              </p>
            </Accordion>
            
            <Accordion title="Enhanced Marketing Strategies">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Equips learners with the ability to design and execute sophisticated marketing strategies tailored to specific target audiences, increasing conversion rates and customer engagement.
              </p>
            </Accordion>
            
            <Accordion title="Improved Audience Targeting">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Allows for precise targeting, ensuring that marketing efforts reach the right people at the right time, maximizing campaign efficiency and minimizing wasted resources.
              </p>
            </Accordion>
            
            <Accordion title="Business Growth and ROI">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Data-driven marketing strategies have the potential to significantly impact business growth by optimizing marketing spend, improving conversion rates, and enhancing customer retention.
              </p>
            </Accordion>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mt-6">
            Medh courses offer a comprehensive skill set that empowers learners
            to make data-driven marketing decisions, optimize campaigns, and
            achieve better results. Whether you are looking to enhance career
            prospects or contribute to the success and growth of businesses
            leveraging digital marketing in the data-centric world, our courses
            are your pathway to continuous learning and success in the digital
            age.
          </p>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
            Career Opportunities
          </h1>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mb-6">
            Upon completing the Digital Marketing with Data Analytics Course,
            learners gain access to a wide array of dynamic and fulfilling
            career opportunities. Here are some potential career paths that
            individuals can pursue:
          </p>
          
          <div className="space-y-2 md:space-y-4">
            <Accordion title="Digital Marketing Specialist">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                As a digital marketing specialist, you will orchestrate and execute digital marketing campaigns across diverse channels, encompassing social media, email, search engines, and content marketing. You'll use data analytics to optimize campaign performance.
              </p>
            </Accordion>
            
            <Accordion title="Data Marketing Analyst">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                In this role, you will analyze marketing data to extract valuable insights and refine marketing strategies for enhanced performance and return on investment. You'll identify trends, patterns, and opportunities to drive business growth.
              </p>
            </Accordion>
            
            <Accordion title="SEO Analyst/Manager">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                As an SEO analyst or manager, your focus will be on optimizing websites and content to elevate organic search visibility and drive targeted traffic. You'll use data analytics to track performance and make data-driven improvements.
              </p>
            </Accordion>
            
            <Accordion title="Social Media Manager">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Social media managers develop and implement social media strategies, manage social media accounts, and engage with the audience to cultivate brand presence and foster engagement. You'll use analytics to measure impact and refine strategies.
              </p>
            </Accordion>
            
            <Accordion title="Digital Marketing Manager">
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Digital marketing managers supervise and synchronize all digital marketing endeavors within an organization, devising and implementing marketing plans to attain business objectives. You'll use data analytics to make strategic decisions.
              </p>
            </Accordion>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px] mt-6">
            The fusion of digital marketing and data analytics skills make
            learners indispensable to organizations striving to excel in the
            digital age. As the digital landscape continues to evolve, the
            demand for professionals proficient in these domains is anticipated
            to experience significant growth.
          </p>
        </>
      ),
    },
  ],
};

const DigiMarketingOverview = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = React.useRef(null);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    // Scroll to the top of the content when changing tabs
    setTimeout(() => {
      if (contentRef.current) {
        const yOffset = -100; // Offset to account for sticky header
        const element = contentRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // Handle scroll to top visibility with improved debounce
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    // Debounced scroll handler for better performance
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  const tabIcons = {
    1: <LineChart className="w-5 h-5" />,
    2: <Lightbulb className="w-5 h-5" />,
    3: <GraduationCap className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Render content with enhanced visual effects
  const renderTabContent = () => {
    return (
      <>
        {activeContent.content}
        
        {/* Enhanced Call to action at the bottom of each tab */}
        {activeTab === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-lg dark:border-blue-500/20 dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-lg md:text-xl font-semibold text-blue-500 dark:text-blue-400 mb-3">Start Your Digital Marketing Career Today</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-4">
              Don't miss this opportunity to transform your career and become a sought-after digital marketing professional with data analytics expertise.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
            >
              <span>Enroll Now</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </>
    );
  };

  // Enhanced loading state with branded colors
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Digital Marketing...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-[50vh] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 lg:py-20 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-12 md:mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full p-1 pl-2 pr-4 mb-6">
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured Course
            </span>
          </div>
          
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 text-gray-900 dark:text-white">
            Your Path to Achieving Success in the <span className="text-blue-500">Digital Age</span>
          </h1>
          <div className="h-1 w-24 bg-blue-500 rounded-full mb-4"></div>
          <p className="text-center md:text-[18px] text-[14px] leading-6 md:leading-7 md:w-[90%] text-gray-600 dark:text-gray-300">
            Gain expertise in using data analytics to improve digital marketing strategies. The Digital Marketing with Data Science course brings together two essential components of modern marketing—digital marketing and data analytics—allowing businesses to make informed, data-driven decisions and implement highly effective, targeted marketing campaigns.
          </p>
        </motion.div>

        {/* Enhanced tabs with better visual feedback */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8" 
          role="tablist"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 md:px-6 py-3 transition-all duration-300 rounded-lg flex items-center gap-2 font-medium ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md"
              }`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tabIcons[tab.id]}
              {tab.name}
              {activeTab === tab.id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-2 h-2 bg-white rounded-full ml-1 animate-pulse"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced content section with better transitions */}
        <AnimatePresence mode="wait">
          <motion.section
            ref={contentRef}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white mx-2 md:mx-auto mt-6 md:mt-8 dark:bg-gray-800/90 px-4 py-6 md:px-8 md:py-10 border border-gray-100 dark:border-gray-700 text-gray-700 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {renderTabContent()}
          </motion.section>
        </AnimatePresence>

        {/* Enhanced Call to action with better visuals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-6 md:p-8 bg-white dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Master Digital Marketing?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Join thousands of students who have transformed their careers through our comprehensive Digital Marketing with Data Science course.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
          >
            Enroll Today
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>

        {/* Slogan */}
        <div className="text-center mt-10">
          <p className="mumkinMedh text-2xl text-blue-500 font-medium italic">
            Medh Hai Toh Mumkin Hai!
          </p>
        </div>

        {/* Enhanced Scroll to Top Button with better animations */}
        <AnimatePresence/>
      </div>
    </section>
  );
};

export default memo(DigiMarketingOverview);
