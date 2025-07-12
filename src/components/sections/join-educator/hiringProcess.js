"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileCheck, MessageSquare, Award, Rocket, Briefcase, ArrowRight } from "lucide-react";
import { mobilePatterns, getAnimations, buildComponent } from "@/utils/designSystem";

const HiringProcess = () => {
  const processSteps = [
    {
      title: "Application Review",
      description: "Submit your qualifications and teaching experience for initial screening.",
      icon: <FileCheck className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Skills Assessment",
      description: "Complete subject proficiency tests and a live teaching demonstration.",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "violet"
    },
    {
      title: "Interview Process",
      description: "Discuss your teaching philosophy and alignment with our educational mission.",
      icon: <Award className="w-6 h-6" />,
      color: "emerald"
    },
    {
      title: "Onboarding",
      description: "Complete training on our platform and receive ongoing support.",
      icon: <Rocket className="w-6 h-6" />,
      color: "amber"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { icon: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-700" },
      violet: { icon: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-700" },
      emerald: { icon: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-700" },
      amber: { icon: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-700" }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900 pt-0 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-8">
      <div className="pt-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-8 w-full px-0">
            <motion.div variants={itemVariants} className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4 sm:mb-6">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Simple Process</span>
              </div>
              <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight">
                Your journey to becoming a <span className="text-[#3bac63]">Medh Educator</span>
              </h2>
              <p className="text-base sm:text-[clamp(0.875rem,2vw+0.5rem,1rem)] text-slate-600 dark:text-slate-300 leading-relaxed max-w-full sm:max-w-3xl mx-auto">
                Our streamlined process identifies exceptional educators who will thrive in our innovative teaching environment.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-16">
              {processSteps.map((step, index) => {
                const colors = getColorClasses(step.color);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.bg} ${colors.border} border rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 ${getAnimations.transition('smooth')} group-hover:scale-110`}>
                        <div className={colors.icon}>
                          {React.cloneElement(step.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{index + 1}</span>
                      </div>
                    </div>
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 ${getAnimations.transition('smooth')} group-hover:${colors.icon}`}>
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HiringProcess;
