"use client";
import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Code, Database, Shield, Smartphone, Cloud, Globe, BarChart, Briefcase, Target } from "lucide-react";
import { buildAdvancedComponent, corporatePatterns, mobilePatterns } from "@/utils/designSystem";
import { SkillsSectionMobile } from "./SkillsSectionMobile";

// TypeScript interfaces
interface ISkillCategory {
  icon: React.ReactNode;
  title: string;
  color: string;
}

interface ISkillsSectionProps {
  className?: string;
}

const SkillsSection: React.FC<ISkillsSectionProps> = memo(({ className = "" }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Enhanced skills with icons and categories - Mobile optimized
  const skillCategories: ISkillCategory[] = [
    {
      icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Artificial Intelligence (AI)",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Data Science & Analytics", 
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Cloud Computing",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Mobile App Development",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Big Data",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Web Development",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Cyber Security",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Digital Marketing",
      color: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <>
      {/* Mobile view: show only on <640px */}
      <div className="sm:hidden">
        <SkillsSectionMobile className={className} />
      </div>
      {/* Desktop/tablet view: hide on <640px */}
      <div className="hidden sm:block">
        <section className="relative bg-white dark:bg-slate-950 pt-[12px] pb-[12px] overflow-hidden w-full">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-emerald-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-emerald-950/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100/20 dark:bg-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-100/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
            {/* Enhanced Header Section */}
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/60 dark:border-slate-600/60 pt-[20px] pb-0 px-6 sm:px-7 md:px-8 lg:px-10 xl:px-12 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300"
            >
              <div className="text-center mb-12">
                <div className="w-full mx-auto">
                  {/* Section Badge */}
                  <div className={corporatePatterns.sectionBadge('blue')}>
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>Core Competencies</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight whitespace-nowrap">
                    Skills & Expertise <span className="text-blue-600 dark:text-blue-400">We Offer</span>
                  </h2>
                  
                  <div className="w-full mx-auto mb-8">
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Our talent pool spans diverse technical and business domains with 
                      <span className="font-semibold text-slate-800 dark:text-slate-200"> proven expertise</span> and 
                      <span className="font-semibold text-slate-800 dark:text-slate-200"> industry experience</span>
                    </p>
                  </div>

                  {/* Core Technology Areas Block - moved inside glassCard */}
                  <div className="mb-6 md:mb-8">
                    {/* Skills Grid - 4 columns, 2 rows layout */}
                    <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {skillCategories.map((skill, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
                            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 md:space-y-4 h-full justify-center">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md`}>
                                <div className="text-white">
                                  {skill.icon}
                                </div>
                              </div>
                              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight text-center">
                                {skill.title}
                              </h4>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {/* Additional Skills Note - Mobile optimized */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                      className="mt-6 md:mt-8"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200/50 dark:border-blue-700/50">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-medium text-center">
                            <span className="font-bold">...and many more</span> specialized skills across emerging technologies
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  {/* End Core Technology Areas Block */}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
});

SkillsSection.displayName = "SkillsSection";

export default SkillsSection;
