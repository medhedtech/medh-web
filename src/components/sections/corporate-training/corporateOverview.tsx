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

interface IAnimationVariants {
  hidden: {
    opacity: number;
    y: number;
  };
  visible: {
    opacity: number;
    y: number;
  };
}

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
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={toggleAccordion}
        className={`w-full px-4 md:px-5 py-3 md:py-4 text-left flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg font-semibold text-gray-800 dark:text-white pr-4">
          {title}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
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
            <div className={`p-3 md:p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border-t border-gray-200 dark:border-gray-700 ${contentClassName}`}>
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

  const fadeInUp: IAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
            <div className="flex justify-center space-x-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Corporate Training Excellence
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your organization with our comprehensive training solutions designed to elevate performance, 
            enhance skills, and drive sustainable growth across all levels of your business.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              {data.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-indigo-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg dark:bg-gray-800/95 px-6 py-8 md:px-10 md:py-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            {activeTab === 1 && (
              <div className="space-y-4 md:space-y-6">
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
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </Accordion>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 md:space-y-6">
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
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </Accordion>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Ready to transform your organization's potential into performance?
          </p>
          <button
            onClick={() => router.push('/contact-us')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-indigo-500 hover:from-primary-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transform hover:scale-105"
          >
            Start Your Journey
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(CorporateOverview); 