"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, ChevronDown, ArrowUp, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";

interface IFeature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface ITab {
  id: number;
  name: string;
  content: React.ReactElement;
}

interface IData {
  tabs: ITab[];
}

interface IAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  contentClassName?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const data: IData = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <ul className="space-y-4 mb-6">
            {[
              {
                title: "Customized Training Courses",
                description:
                  "Acknowledging the unique characteristics of each company, our seasoned trainers collaborate closely to tailor training courses that effectively address your IT and other training requirements. From AI, Data Science & Analytics, Cybersecurity, Cloud computing to Digital Marketing, Personality Development, our dynamic training courses are meticulously crafted to align with your business objectives.",
              },
              {
                title: "Expert Instructors",
                description:
                  "Our trainers are seasoned IT professionals with extensive industry experience. They bring real-world insights and practical knowledge to the training sessions, ensuring that your employees receive top-notch instruction and guidance.",
              },
              {
                title: "Flexible Learning Options",
                description:
                  "We recognize that every company operates within its own scheduling constraints. Hence, we offer flexible learning options, including on-site training, virtual classrooms, and self-paced e-learning modules. This allows your employees to conveniently access our training courses, balancing learning with their regular work responsibilities.",
              },
              {
                title: "Results-Driven Approach",
                description:
                  "Our training courses adopt a results-driven methodology, emphasizing practical applications and real-world scenarios. This ensures that participants not only acquire new skills but also develop the ability to apply them effectively in their professional roles.",
              },
              {
                title: "Ongoing Support",
                description:
                  "Beyond the completion of the training course, we provide continued support to ensure the successful implementation of acquired skills within your organization. Our trainers are available to address any queries or challenges that may arise during the application phase.",
              },
            ].map((item, index) => (
              <li key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-gray-700 dark:text-gray-300 italic text-center">
            Reach out to us today to discuss your training needs and let us
            design a customized training plan that aligns with your goals and
            aspirations. Together, let&#39;s embark on a journey of growth and
            success through our Corporate Training Solutions.
          </p>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-8 text-center text-lg"
          >
            Discover the transformative power of strategic corporate training that goes beyond skill development.
          </motion.p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "Enhanced Productivity",
                description:
                  "Empower your workforce with cutting-edge skills and knowledge that directly translate to improved efficiency, innovation, and overall organizational performance.",
                icon: "🚀",
                color: "bg-blue-100"
              },
              {
                title: "Competitive Market Advantage",
                description:
                  "Stay ahead of industry trends and technological advancements. Our training ensures your team possesses the latest expertise to outperform competitors and capture market opportunities.",
                icon: "🎯",
                color: "bg-green-100"
              },
              {
                title: "Talent Retention & Attraction",
                description:
                  "Demonstrate your commitment to employee growth and development. Create a culture of continuous learning that attracts top talent and significantly reduces turnover costs.",
                icon: "💎",
                color: "bg-purple-100"
              },
              {
                title: "Innovation & Adaptability",
                description:
                  "Cultivate a forward-thinking mindset within your organization. Our training programs foster creativity, problem-solving abilities, and the agility to navigate rapidly changing business landscapes.",
                icon: "💡",
                color: "bg-orange-100"
              },
              {
                title: "Risk Mitigation & Compliance",
                description:
                  "Ensure your team is well-versed in industry regulations, best practices, and security protocols. Minimize operational risks while maintaining compliance with evolving standards.",
                icon: "🛡️",
                color: "bg-red-100"
              },
              {
                title: "Cross-Functional Collaboration",
                description:
                  "Break down organizational silos through comprehensive training that promotes holistic understanding. Encourage knowledge sharing, interdepartmental communication, and a unified approach to achieving organizational objectives.",
                icon: "🤝",
                color: "bg-yellow-100"
              },
            ].map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${feature.color} rounded-full mr-4`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ul>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-700 dark:text-gray-300 italic text-center mt-6 text-sm"
          >
            Invest in MEDH's Corporate Training Programs and witness a transformative journey of organizational excellence.
          </motion.p>
        </>
      ),
    },
  ],
};

const Accordion: React.FC<IAccordionProps> = memo(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const toggleAccordion = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 mb-3">
      <button
        onClick={toggleAccordion}
        className={`w-full px-4 md:px-6 py-3 md:py-4 text-left flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-white pr-4">
          {title}
        </span>
        <ChevronDown 
          className={`w-4 h-4 md:w-5 md:h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-600 ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Accordion.displayName = "Accordion";

const CorporateOverview: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    let timeoutId: NodeJS.Timeout;
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

  // Animation variants are defined at module level

  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, []);

  const handleTabClick = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  if (isLoading) {
    return (
      <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
        
        <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Tab navigation skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-1 shadow-sm w-fit mx-auto">
              <div className="flex space-x-1">
                {[1, 2].map((i) => (
                  <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-6 md:p-8 shadow-sm">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Container for All Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-600 shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50 max-w-7xl mx-auto overflow-hidden">
          
          {/* Enhanced Header */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-600">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Corporate Training Excellence
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform your organization with our comprehensive training solutions designed to elevate performance, 
                enhance skills, and drive sustainable growth across all levels of your business.
              </p>
            </motion.div>
          </div>

          {/* Tab Navigation - Mobile Optimized */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-6 md:px-8 py-4 md:py-6 border-b border-slate-200 dark:border-slate-600"
          >
            <div className="flex justify-center">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-1 max-w-fit mx-auto">
                <div className="flex space-x-1">
                  {data.tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-all duration-200 text-sm md:text-base ${
                        activeTab === tab.id
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Content - Mobile Optimized */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 1 && (
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    {[
                      {
                        title: "Customized Training Solutions",
                        description: "Our expert trainers collaborate closely with your team to develop tailored programs that address your specific IT and professional development needs. From cutting-edge technologies to essential soft skills, we ensure every course aligns perfectly with your organizational objectives."
                      },
                      {
                        title: "Industry-Leading Instructors",
                        description: "Learn from seasoned professionals who bring decades of real-world experience to every session. Our instructors combine theoretical knowledge with practical insights, ensuring your team gains actionable skills they can apply immediately."
                      },
                      {
                        title: "Flexible Learning Pathways",
                        description: "Choose from a variety of learning formats designed to suit your team's schedule and preferences. Whether it's intensive on-site workshops, interactive virtual classrooms, or self-paced e-learning modules, we adapt to your organizational rhythm."
                      },
                      {
                        title: "Results-Driven Methodology",
                        description: "Our training programs focus on measurable outcomes and practical applications. Through real-world scenarios and hands-on exercises, participants develop skills they can immediately implement to drive business results."
                      },
                      {
                        title: "Continuous Support & Mentorship",
                        description: "Your learning journey doesn't end with course completion. We provide ongoing support, mentorship opportunities, and resources to ensure successful skill implementation and long-term organizational growth."
                      }
                    ].map((item, index) => (
                      <Accordion 
                        key={index}
                        title={item.title}
                        defaultOpen={index === 0}
                      >
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    {[
                      {
                        title: "Strategic Talent Acquisition",
                        description: "Position your organization as an employer of choice by demonstrating a strong commitment to professional development. Our comprehensive training programs help attract and retain top talent in today's competitive market."
                      },
                      {
                        title: "Accelerated Skill Development",
                        description: "Fast-track your team's growth with targeted training programs that rapidly enhance their capabilities. Our structured approach ensures quick mastery of new skills and technologies."
                      },
                      {
                        title: "Peak Performance Culture",
                        description: "Foster a high-performance environment where continuous learning and improvement become part of your organizational DNA. Watch as enhanced skills translate into superior outcomes and innovation."
                      },
                      {
                        title: "Elevated Employee Engagement",
                        description: "Create a motivated and committed workforce through personalized development opportunities. Our training programs help employees see clear career progression paths within your organization."
                      },
                      {
                        title: "Digital Transformation Ready",
                        description: "Prepare your team for the digital future with comprehensive training in emerging technologies and methodologies. Stay competitive by keeping your workforce at the forefront of technological advancement."
                      }
                    ].map((benefit, index) => (
                      <Accordion 
                        key={index}
                        title={benefit.title}
                        defaultOpen={index === 0}
                      >
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {benefit.description}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Call to Action - Mobile Optimized */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-50 dark:bg-slate-700/50 p-6 md:p-8 text-center border-t border-slate-200 dark:border-slate-600"
          >
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-6">
              Ready to transform your organization's potential into performance?
            </p>
            <button
              onClick={() => router.push('/contact-us')}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Start Your Journey
              <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </button>
          </motion.div>
        
        </div>
      </div>

      {/* Scroll to top button - Mobile Optimized */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(CorporateOverview); 