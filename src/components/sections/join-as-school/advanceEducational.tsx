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
    <>
      <section className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Header Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-6 md:mb-8 text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                Future-Ready Education
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4 md:mb-6">
                Creating future-ready students through
                <span className="block text-[#3bac63] mt-2">advanced educational approaches</span>
              </h2>
            </motion.div>

            {/* Content Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-6 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30 mb-6 md:mb-8"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Gone are the days when education was limited to the pages of a
                  book and students memorised information solely to pass an
                  examination. Educators are pushing the envelope and helping
                  students possess skills that go beyond jobs and technology – and
                  will last them a lifetime. Here are some of the reasons why
                  skill-based learning has become imperative in schools/institutes:
                </p>
              </div>

              {/* Skills Grid */}
              <motion.div 
                variants={containerVariants}
                className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              >
                {skillsList.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/70 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 group hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-200/70 dark:hover:border-blue-700/50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {skill.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <EducationalFeatureCard />
    </>
  );
};

export default AdvanceEducational;
