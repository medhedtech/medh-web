"use client";
import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Code, Database, Shield, Smartphone, Cloud, Globe, BarChart, Briefcase } from "lucide-react";
import { buildAdvancedComponent, corporatePatterns, mobilePatterns } from "@/utils/designSystem";

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
    <section className={`relative ${mobilePatterns.mobileSection()} overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements - Mobile optimized */}
      <div className="absolute top-10 sm:top-20 left-0 w-16 h-16 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-20 h-20 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className={`relative z-10 ${mobilePatterns.mobileContainer('lg')}`}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'mobile' })}
        >
          {/* Header Section - Mobile optimized */}
          <div className="text-center mb-8 md:mb-10">
            <div className="max-w-4xl mx-auto">
              {/* Section Badge */}
              <div className={corporatePatterns.sectionBadge('blue')}>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-xs sm:text-sm">Diverse Expertise</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4 leading-tight">
                Skilled 
                <span className="block text-blue-600 dark:text-blue-400 mt-1">
                  Professionals
                </span>
              </h2>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-4 md:mb-6">
                  Access talent across 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> key technology domains</span> with 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> proven industry experience</span>
                </p>
                
                {/* Technology Highlights - Mobile friendly */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                  <div className={corporatePatterns.valueHighlight('blue')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">Technical Expertise</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('emerald')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="font-medium">Business Skills</span>
                  </div>
                  <div className={corporatePatterns.valueHighlight('violet')}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full mr-2"></div>
                    <span className="font-medium">Industry Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto mb-8 md:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 md:mb-8"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 md:mb-3 text-center">
                Core Technology Areas
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                Our professionals excel in high-demand technology sectors
              </p>
            </motion.div>

            {/* Skills Grid - Enhanced mobile layout */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {skillCategories.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group-hover:border-blue-300 dark:group-hover:border-blue-600 min-h-[100px] sm:min-h-[120px]">
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 h-full justify-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <div className="text-white">
                          {skill.icon}
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                        {skill.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

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

          {/* Additional Value Proposition - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6">
                Why Choose Our Talent Pool?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Certified Professionals</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Industry-recognized certifications and validated skills</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Real Experience</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Hands-on project experience across industries</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Continuous Learning</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Up-to-date with latest technologies and trends</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

SkillsSection.displayName = "SkillsSection";

export default SkillsSection;
