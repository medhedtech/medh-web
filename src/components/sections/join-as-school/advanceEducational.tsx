"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Award } from "lucide-react";
import EducationalFeatureCard from "./educationalFeatureCard";

interface ISkill {
  id: number;
  text: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const skillsList: ISkill[] = [
  {
    id: 1,
    text: "Promotes independence",
    icon: CheckCircle2
  },
  {
    id: 2,
    text: "Enhances creativity and encourages teamwork",
    icon: CheckCircle2
  },
  {
    id: 3,
    text: "Develops students' social skills",
    icon: CheckCircle2
  },
  {
    id: 4,
    text: "Improves their communication skills",
    icon: CheckCircle2
  },
  {
    id: 5,
    text: "Makes them fast learners",
    icon: CheckCircle2
  },
  {
    id: 6,
    text: "Ways to prepare students for the workforce of the future",
    icon: CheckCircle2
  }
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Promotes independence",
    description: "Students learn to think and act for themselves."
  },
  {
    icon: CheckCircle2,
    title: "Enhances creativity & teamwork",
    description: "Fosters creative problem-solving and collaboration."
  },
  {
    icon: CheckCircle2,
    title: "Develops social skills",
    description: "Builds empathy, leadership, and cooperation."
  },
];

const strategies = [
  {
    icon: CheckCircle2,
    title: "Think on their feet",
    description: "Adapt quickly and handle emergencies."
  },
  {
    icon: CheckCircle2,
    title: "Be more creative",
    description: "Push beyond comfort zones and share ideas."
  },
  {
    icon: CheckCircle2,
    title: "Make communication essential",
    description: "Teach clear, confident expression."
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const AdvanceEducational: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900 mt-12 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
      <div className="bg-white p-8 rounded-2xl w-full mt-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-5 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            Future-Ready Education
          </span>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3">
            Creating future-ready students through<br />
            <span className="text-[#3bac63]">advanced educational approaches</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            <span className="block md:inline">Why skill-based learning matters—</span>
            <span className="block md:inline">how to make it real in your school/institution.</span>
          </p>
        </div>
        {/* Benefits Grid */}
        <div className="w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">Why Skill-Based Learning?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
            {/* Hardcoded benefits for separation from above */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Promotes independence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Students learn to think and act for themselves.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Enhances creativity & teamwork</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Fosters creative problem-solving and collaboration.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Develops social skills</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Builds empathy, leadership, and cooperation.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="w-full flex items-center justify-center my-8">
          <div className="h-0.5 w-24 bg-gradient-to-r from-[#3bac63] to-emerald-400 rounded-full opacity-70" />
        </div>
        {/* Strategies Grid */}
        <div className="w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">How to Prepare Students for the Future</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Think on their feet</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Adapt quickly and handle emergencies.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Be more creative</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Push beyond comfort zones and share ideas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Make communication essential</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Teach clear, confident expression.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvanceEducational;
