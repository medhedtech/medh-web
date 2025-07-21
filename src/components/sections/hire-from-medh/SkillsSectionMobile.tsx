"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Target, Brain, BarChart, Cloud, Smartphone, Database, Globe, Shield, Search, Settings, Palette, DollarSign } from "lucide-react";
import { buildAdvancedComponent, corporatePatterns } from "@/utils/designSystem";

// TypeScript interfaces
interface ISkillCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface ISkillsSectionMobileProps {
  className?: string;
}

/**
 * Mobile-optimized Skills Section for Talent Solutions
 * - Vertical scrollable sections
 * - Large touch targets
 * - Minimal glassmorphism (reduced blur)
 * - Accessible and responsive
 */
export const SkillsSectionMobile: React.FC<ISkillsSectionMobileProps> = memo(({ className = "" }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Technical Talent Categories
  const technicalTalent: ISkillCategory[] = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Artificial Intelligence (AI)",
      description: "Machine Learning Experts, AI Engineers, and NLP Specialists",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Data Science & Analytics",
      description: "Data Scientists, Analysts, and Visualization Experts",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Computing",
      description: "AWS, Azure, and Google Cloud Specialists",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile App Development",
      description: "iOS, Android, and Cross-platform developers",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Big Data",
      description: "Hadoop, Spark, and NoSQL specialists",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Web Development",
      description: "Full-stack developers with modern frameworks",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Cyber Security",
      description: "Security Analysts and Engineers",
      color: "from-red-500 to-pink-600"
    }
  ];

  // Non-Technical Talent Categories
  const nonTechnicalTalent: ISkillCategory[] = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Digital Marketing",
      description: "SEO Specialists and Content Marketers",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Business Management",
      description: "Project Managers and Business Analysts",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "UX/UI Design",
      description: "User Experience and Interface Designers",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Financial Analysis",
      description: "Financial Modelers and Risk Analysts",
      color: "from-green-500 to-emerald-600"
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
  };

  const renderSkillSection = (title: string, skills: ISkillCategory[], delay: number) => (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7, delay }}
      className="mb-8"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
        {title}
      </h3>
      
      {title === "Technical Talent" ? (
        <div className="space-y-3">
          {/* First 4 cards */}
          {skills.slice(0, 4).map((skill, idx) => (
            <motion.div
              key={skill.title}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: delay + (idx * 0.07) }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[120px] flex flex-col items-center text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center shadow-md mb-3`}>
                  <span className="text-white">{skill.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Last 3 cards centered */}
          <div className="flex justify-center px-4">
            <div className="w-full max-w-sm space-y-3">
              {skills.slice(4).map((skill, idx) => (
                <motion.div
                  key={skill.title}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: delay + ((idx + 4) * 0.07) }}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[120px] flex flex-col items-center text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center shadow-md mb-3`}>
                      <span className="text-white">{skill.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                        {skill.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.title}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: delay + (idx * 0.07) }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[120px] flex flex-col items-center text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center shadow-md mb-3`}>
                  <span className="text-white">{skill.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                    {skill.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <section
      className={`relative bg-white dark:bg-slate-950 pt-4 pb-4 px-1 w-full overflow-x-hidden ${className}`}
      aria-label="Talent Solutions Mobile"
    >
      {/* Glassmorphism card wrapper */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.7 }}
        className={
          buildAdvancedComponent.glassCard({ variant: "primary", hover: false }) +
          " px-2 py-4 rounded-xl shadow-lg border border-white/60 dark:border-slate-700/60 backdrop-blur-sm"
        }
      >
        {/* Section Badge */}
        <div className="flex items-center justify-center mb-2">
          <div className={corporatePatterns.sectionBadge("blue") + " px-3 py-1 text-xs"}>
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
            <span>Talent Solutions</span>
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-1 leading-tight">
          Diversified Talent Pool for <span className="text-blue-600 dark:text-blue-400">Modern Business Needs</span>
        </h2>
        
        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6 leading-relaxed max-w-sm mx-auto">
          Access both technical and non-technical professionals trained through MEDH's
          <span className="font-semibold text-slate-800 dark:text-slate-200"> industry-aligned courses</span> and
          <span className="font-semibold text-slate-800 dark:text-slate-200"> expert mentorship programs</span>
        </p>

        {/* Technical Talent Section */}
        {renderSkillSection("Technical Talent", technicalTalent, 0.2)}

        {/* Non-Technical Talent Section */}
        {renderSkillSection("Non-Technical Talent", nonTechnicalTalent, 0.4)}
      </motion.div>
    </section>
  );
});

SkillsSectionMobile.displayName = "SkillsSectionMobile";

export default SkillsSectionMobile; 