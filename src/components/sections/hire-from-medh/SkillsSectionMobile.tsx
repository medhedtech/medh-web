"use client";
import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Shield, Smartphone, Cloud, Globe, BarChart, Briefcase, Target } from "lucide-react";
import { buildAdvancedComponent, corporatePatterns } from "@/utils/designSystem";

// TypeScript interfaces
interface ISkillCategory {
  icon: React.ReactNode;
  title: string;
  color: string;
}

interface ISkillsSectionMobileProps {
  className?: string;
}

/**
 * Mobile-optimized Skills Section for Core Competencies
 * - Horizontal scrollable cards (carousel style)
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

  // Skill data (same as desktop for consistency)
  const skillCategories: ISkillCategory[] = [
    {
      icon: <Code className="w-6 h-6" />, title: "Artificial Intelligence (AI)", color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <BarChart className="w-6 h-6" />, title: "Data Science & Analytics", color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Cloud className="w-6 h-6" />, title: "Cloud Computing", color: "from-sky-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-6 h-6" />, title: "Mobile App Development", color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Database className="w-6 h-6" />, title: "Big Data", color: "from-orange-500 to-red-600"
    },
    {
      icon: <Globe className="w-6 h-6" />, title: "Web Development", color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-6 h-6" />, title: "Cyber Security", color: "from-red-500 to-pink-600"
    },
    {
      icon: <Briefcase className="w-6 h-6" />, title: "Digital Marketing", color: "from-purple-500 to-indigo-600"
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      className={`relative bg-white dark:bg-slate-950 pt-4 pb-4 px-1 w-full overflow-x-hidden ${className}`}
      aria-label="Core Competencies Mobile"
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
            <span>Core Competencies</span>
          </div>
        </div>
        {/* Heading */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-1 leading-tight whitespace-nowrap">
          Skills & Expertise <span className="text-blue-600 dark:text-blue-400">We Offer</span>
        </h2>
        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-3 leading-relaxed max-w-xs mx-auto">
          Our talent pool spans diverse technical and business domains with
          <span className="font-semibold text-slate-800 dark:text-slate-200"> proven expertise</span> and
          <span className="font-semibold text-slate-800 dark:text-slate-200"> industry experience</span>
        </p>
        {/* Skills List - 2 column, 4 row grid for mobile, desktop-style cards */}
        <div
          className="grid grid-cols-2 grid-rows-4 gap-3 pb-2"
          role="list"
          aria-label="Skill categories"
        >
          {skillCategories.map((skill, idx) => (
            <motion.div
              key={skill.title}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
            >
              <div
                className={
                  "bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[100px] flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                }
                tabIndex={0}
                role="listitem"
                aria-label={skill.title}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${skill.color} rounded-lg flex items-center justify-center shadow-md mb-2`}>
                  <span className="text-white">{skill.icon}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 text-center leading-tight">
                  {skill.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {/* ...and many more */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-4"
        >
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg px-3 py-2 border border-blue-200/50 dark:border-blue-700/50 min-h-[44px]">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              <span className="font-bold">...and many more</span> specialized skills across emerging technologies
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

SkillsSectionMobile.displayName = "SkillsSectionMobile"; 