"use client";
import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Code, Database, Shield, Smartphone, Cloud, Globe, BarChart, Briefcase, Target, Users, Palette, TrendingUp, DollarSign, Brain, Cpu, Search, Settings } from "lucide-react";
import { buildAdvancedComponent, corporatePatterns, mobilePatterns } from "@/utils/designSystem";
import { SkillsSectionMobile } from "./SkillsSectionMobile";

// TypeScript interfaces
interface ISkillCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface ITalentSection {
  title: string;
  description: string;
  skills: ISkillCategory[];
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

  // Technical Talent Categories
  const technicalTalent: ISkillCategory[] = [
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Artificial Intelligence (AI)",
      description: "Machine Learning Experts, AI Engineers, and NLP Specialists trained in cutting-edge technologies",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Data Science & Analytics",
      description: "Data Scientists, Analysts, and Visualization Experts with hands-on project experience",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Cloud Computing",
      description: "AWS, Azure, and Google Cloud Specialists with practical deployment knowledge",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Mobile App Development",
      description: "iOS, Android, and Cross-platform developers with real-world application portfolios",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Big Data",
      description: "Hadoop, Spark, and NoSQL specialists capable of handling enterprise-scale data challenges",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Web Development",
      description: "Full-stack developers proficient in modern frameworks and responsive design",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Cyber Security",
      description: "Security Analysts and Engineers trained in threat detection and prevention",
      color: "from-red-500 to-pink-600"
    }
  ];

  // Non-Technical Talent Categories
  const nonTechnicalTalent: ISkillCategory[] = [
    {
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Digital Marketing",
      description: "SEO Specialists, Content Marketers, and Social Media Managers with data-driven approaches",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Business Management",
      description: "Project Managers, Business Analysts, and Agile practitioners with industry certifications",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "UX/UI Design",
      description: "User Experience Specialists and Interface Designers with strong portfolios",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Financial Analysis",
      description: "Financial Modelers, Risk Analysts, and Data-driven Decision Makers",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const talentSections: ITalentSection[] = [
    {
      title: "Technical Talent",
      description: "",
      skills: technicalTalent
    },
    {
      title: "Non-Technical Talent",
      description: "",
      skills: nonTechnicalTalent
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
                    <span>Talent Solutions</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                    Diversified Talent Pool for <span className="text-blue-600 dark:text-blue-400">Modern Business Needs</span>
                  </h2>
                  
                  <div className="w-full mx-auto mb-8">
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Access both technical and non-technical professionals trained through MEDH's 
                      <span className="font-semibold text-slate-800 dark:text-slate-200"> industry-aligned courses</span> and 
                      <span className="font-semibold text-slate-800 dark:text-slate-200"> expert mentorship programs</span>
                    </p>
                  </div>

                  {/* Talent Categories */}
                  <div className="space-y-12">
                    {talentSections.map((section, sectionIndex) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: sectionIndex * 0.3 }}
                        className="w-full"
                      >
                        {/* Section Title */}
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {section.title}
                          </h3>
                        </div>

                        {/* Skills Grid */}
                        {section.title === "Technical Talent" ? (
                          <div className="space-y-6">
                            {/* First 4 cards in a row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                              {section.skills.slice(0, 4).map((skill, skillIndex) => (
                                <motion.div
                                  key={skill.title}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                  transition={{ duration: 0.5, delay: (sectionIndex * 0.3) + (skillIndex * 0.1) }}
                                  className="h-full"
                                >
                                  <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-slate-200 dark:border-slate-600 shadow-sm h-full min-h-[200px] flex flex-col">
                                    <div className="flex flex-col items-center text-center mb-4">
                                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md mb-3`}>
                                        <div className="text-white">
                                          {skill.icon}
                                        </div>
                                      </div>
                                      <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                        {skill.title}
                                      </h4>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center flex-1">
                                      {skill.description}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* Last 3 cards centered */}
                            <div className="flex justify-center">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                                {section.skills.slice(4).map((skill, skillIndex) => (
                                  <motion.div
                                    key={skill.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: (sectionIndex * 0.3) + ((skillIndex + 4) * 0.1) }}
                                    className="h-full"
                                  >
                                    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-slate-200 dark:border-slate-600 shadow-sm h-full min-h-[200px] flex flex-col">
                                      <div className="flex flex-col items-center text-center mb-4">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md mb-3`}>
                                          <div className="text-white">
                                            {skill.icon}
                                          </div>
                                        </div>
                                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                          {skill.title}
                                        </h4>
                                      </div>
                                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center flex-1">
                                        {skill.description}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {section.skills.map((skill, skillIndex) => (
                              <motion.div
                                key={skill.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: (sectionIndex * 0.3) + (skillIndex * 0.1) }}
                                className="h-full"
                              >
                                <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-slate-200 dark:border-slate-600 shadow-sm h-full min-h-[200px] flex flex-col">
                                  <div className="flex flex-col items-center text-center mb-4">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${skill.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md mb-3`}>
                                      <div className="text-white">
                                        {skill.icon}
                                      </div>
                                    </div>
                                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                      {skill.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center flex-1">
                                    {skill.description}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
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
