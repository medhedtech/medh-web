"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Globe, ArrowRight, Star } from "lucide-react";
import { mobilePatterns, getAnimations } from "@/utils/designSystem";
import Image from "next/image";

const TechEducator = () => {
  const criteriaData = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Passionate Teaching",
      description: "Transform knowledge into impactful learning experiences.",
      color: "blue"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Subject Expertise", 
      description: "Bring industry knowledge to professional training.",
      color: "violet"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Impact",
      description: "Create inclusive, diverse educational environments.",
      color: "emerald"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { icon: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-700" },
      violet: { icon: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-700" },
      emerald: { icon: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-700" }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900 pt-0 pb-8 sm:pb-10 md:pb-12">
      <div className={mobilePatterns.mobileContainer('lg') + " pt-6"}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-8">
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Join Our Faculty</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight whitespace-nowrap">
              Empower minds
            </h2>
            
            <p className="text-[clamp(0.875rem,2vw+0.5rem,1rem)] text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
              Share your expertise on a platform that values innovation and rewards exceptional teaching.
            </p>
            
            <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                We're looking for educators who embody:
              </span>
            </div>
          </motion.div>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-0">
            {criteriaData.map((item, index) => {
              const colors = getColorClasses(item.color);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div className={`${mobilePatterns.mobileCard('elevated')} h-full text-center ${getAnimations.transition('smooth')}`}>
                    <div className={`w-16 h-16 ${colors.bg} ${colors.border} border rounded-2xl flex items-center justify-center mx-auto mb-4 ${getAnimations.transition('smooth')} group-hover:scale-110`}>
                      <div className={colors.icon}>
                        {item.icon}
                      </div>
                    </div>

                    <h3 className={`text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 ${getAnimations.transition('smooth')} group-hover:${colors.icon}`}>
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
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

export default TechEducator;
