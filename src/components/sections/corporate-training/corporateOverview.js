"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info } from "lucide-react";
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

const CorporateOverview = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`py-16 relative transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-10"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            Corporate Training
          </span>
          
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Gain a Competitive Edge with <span className="text-primary-500 dark:text-primary-400">Medh</span>'s Corporate Training
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meticulously designed to align with your company's vision and mission. Our SMART (Specific, Measurable, Achievable, Relevant, and Time-bound) approach ensures that the training is catering to your unique organizational goals.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8 space-x-4"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-white text-primary-500 border border-primary-500 hover:bg-primary-500/10"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <CheckCircle className="mr-2" size={16} />
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Rendering */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 relative overflow-hidden"
        >
          
          <h2 className="text-3xl font-bold text-primary-500 dark:text-primary-400 mb-6 text-center">
            {activeContent.name}
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeContent.content}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CorporateOverview;
