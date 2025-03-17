"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, ChevronDown, ArrowUp, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";

const data = {
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
                title: "Cutting-Edge Curriculum",
                description:
                  "Our training curriculum is regularly updated to reflect the latest trends and advancements in the IT industry. By enrolling in our courses, your employees will be equipped with the most relevant and up-to-date skills, empowering them to contribute meaningfully to your company's success.",
              },
              {
                title: "Hands-On Practical Experience",
                description:
                  "We firmly believe that experiential learning is one of the most effective ways to grasp complex IT concepts. Our training includes hands-on practical exercises and projects, enabling your employees to apply their newfound knowledge in a controlled environment.",
              },
            ].map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                  <CheckCircle className="text-primary-500 dark:text-primary-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.li>
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
          <ul className="space-y-4 mb-6">
            {[
              {
                title: "Attracting Top Talent",
                description:
                  "Organizations offering comprehensive training and development opportunities become magnets for highly skilled professionals. A robust learning culture reduces recruitment efforts and attracts top-tier candidates who value growth.",
                impact: "Talent Magnetism"
              },
              {
                title: "Improved Employee Skills",
                description:
                  "Targeted training programs systematically enhance employee knowledge and capabilities. By investing in skill development, organizations witness a significant boost in workplace productivity, efficiency, and overall performance.",
                impact: "Skill Amplification"
              },
              {
                title: "Enhanced Performance",
                description:
                  "As employees acquire new skills and knowledge, their confidence and capability soar. This translates into superior job performance, innovative problem-solving, and the consistent delivery of high-quality outputs.",
                impact: "Performance Elevation"
              },
              {
                title: "Increased Engagement",
                description:
                  "Personalized training programs demonstrate a genuine commitment to employee growth. This approach elevates job satisfaction, fosters a sense of value, and leads to higher retention rates and a more motivated workforce.",
                impact: "Engagement Boost"
              },
              {
                title: "Technological Advances",
                description:
                  "Continuous training ensures your workforce remains at the cutting edge of technological trends. This proactive approach bolsters organizational competitiveness and enables effective utilization of emerging tools and technologies.",
                impact: "Tech Readiness"
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
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 rounded-full mr-4">
                    <CheckCircle className="text-primary-500 dark:text-primary-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <span className="text-xs text-primary-500 dark:text-primary-400 font-medium">
                      {feature.impact}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 3,
      name: "What You'll Gain",
      content: (
        <>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 dark:text-gray-300 mb-8 text-center text-lg"
          >
            Unlock unprecedented organizational growth through strategic, comprehensive training programs.
          </motion.p>
          <ul className="space-y-4 mb-6">
            {[
              {
                title: "Increased Productivity",
                description:
                  "Equip your team with cutting-edge tools and strategic methodologies. Our training transforms employees into efficiency experts, enabling them to optimize workflows, reduce redundancies, and significantly enhance overall organizational output.",
                icon: "🚀",
                color: "bg-blue-100"
              },
              {
                title: "Elevated Performance",
                description:
                  "Transform your workforce into high-performance professionals ready to tackle complex challenges. Our tailored programs instill advanced skills, critical thinking, and adaptive strategies that elevate individual and collective organizational capabilities.",
                icon: "📈",
                color: "bg-green-100"
              },
              {
                title: "Talent Retention & Development",
                description:
                  "Create a dynamic learning ecosystem that attracts, nurtures, and retains top talent. By demonstrating a genuine commitment to continuous professional development, you position your organization as an employer of choice in a competitive market.",
                icon: "🌟",
                color: "bg-purple-100"
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

// Create a reusable accordion component
const Accordion = memo(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3 overflow-hidden">
      <button
        className={`w-full flex justify-between items-center p-3 md:p-4 text-left transition-all duration-300 ${
          isOpen 
            ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white dark:from-primaryColor dark:to-blue-500 font-semibold shadow-md" 
            : "bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-800/70 text-gray-800 dark:text-gray-200 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        } ${titleClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[16px] md:text-[18px] flex items-center">
          <span className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${
            isOpen 
              ? "bg-white animate-pulse" 
              : "bg-primaryColor/60 dark:bg-primaryColor/80"
          }`}></span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-center rounded-full ${
            isOpen 
              ? "bg-white/20 dark:bg-white/20" 
              : "bg-primaryColor/10 dark:bg-primaryColor/20"
          } w-6 h-6 md:w-7 md:h-7`}
        >
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${
            isOpen ? "text-white" : "text-primaryColor dark:text-primaryColor"
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

const CorporateOverview = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    
    let timeoutId;
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[60vh] py-16 md:py-24">
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20" />
      
      {/* Loading overlay with animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 md:w-14 md:h-14 border-4 border-primaryColor border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-6 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
          >
            Transform Your Workforce
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600 leading-tight"
          >
            Elevate Your Team with <span className="text-primary-500 dark:text-primary-400">Medh</span>'s Corporate Training
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            Unlock your organization's full potential with our meticulously crafted training programs. We align cutting-edge technology with your company's vision to deliver transformative learning experiences.
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 px-2 md:px-6 mb-12"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-xl flex items-center gap-3 text-base md:text-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white font-semibold shadow-lg transform -translate-y-0.5"
                  : "bg-white text-primaryColor border-2 border-primaryColor/30 hover:bg-primaryColor/10 dark:bg-gray-800 dark:text-white dark:border-primaryColor/30"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
              {tab.name}
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Rendering */}
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
                    title: "State-of-the-Art Curriculum",
                    description: "Stay ahead of the curve with our continuously updated course content that reflects the latest industry trends and technological advancements. Our curriculum is designed to future-proof your workforce and drive innovation."
                  },
                  {
                    title: "Immersive Learning Experience",
                    description: "Engage in hands-on practical exercises, real-world case studies, and interactive projects that reinforce learning and boost retention. Our experiential learning approach ensures lasting skill development and confident application."
                  }
                ].map((item, index) => (
                  <Accordion 
                    key={index}
                    title={item.title}
                    defaultOpen={index === 0}
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
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
                ].map((item, index) => (
                  <Accordion 
                    key={index}
                    title={item.title}
                    defaultOpen={index === 0}
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </Accordion>
                ))}
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    title: "Maximized Productivity",
                    description: "Empower your team with advanced tools and methodologies that streamline workflows and boost efficiency. Our training transforms employees into productivity champions who drive organizational success."
                  },
                  {
                    title: "Excellence in Execution",
                    description: "Develop a workforce capable of handling complex challenges with confidence and precision. Our comprehensive training builds both technical expertise and critical thinking abilities."
                  },
                  {
                    title: "Sustainable Talent Development",
                    description: "Build a robust talent pipeline through systematic skill development and knowledge enhancement. Create an environment where continuous learning fuels career growth and innovation."
                  },
                  {
                    title: "Seamless Team Collaboration",
                    description: "Break down departmental barriers and foster a culture of collaboration through shared learning experiences. Enable cross-functional teams to work together more effectively towards common goals."
                  }
                ].map((item, index) => (
                  <Accordion 
                    key={index}
                    title={item.title}
                    defaultOpen={index === 0}
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </Accordion>
                ))}

                {/* Enhanced Call to Action */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-12 text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-8 md:p-12 rounded-2xl"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-primaryColor dark:text-gray-200 mb-4">
                    Ready to Revolutionize Your Workforce?
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    Join forces with Medh to create a future-ready workforce that drives innovation and excellence. Let's build your team's success story together.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-medium text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    onClick={() => router.push('/contact')}
                  >
                    Start Your Transformation Journey
                  </motion.button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-primaryColor to-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-6 w-6 md:h-7 md:w-7" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(CorporateOverview);
