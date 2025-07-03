"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, Clock, Rocket, ArrowRight, Zap } from "lucide-react";
import { mobilePatterns, getAnimations, buildComponent } from "@/utils/designSystem";

const offerings = [
  {
    icon: <Star className="w-6 h-6" />,
    title: "Transform Lives",
    description: "Create lasting impact through exceptional education.",
    color: "amber"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Teaching",
    description: "Enjoy location independence and flexible scheduling.",
    color: "emerald"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "AI-Enhanced Tools",
    description: "Access cutting-edge teaching platforms and resources.",
    color: "blue"
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Premium Support",
    description: "Receive ongoing mentorship and career development.",
    color: "violet"
  },
];

const Offerings = () => {
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
      amber: { icon: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-700" },
      emerald: { icon: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-700" },
      blue: { icon: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-700" },
      violet: { icon: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-700" }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className={mobilePatterns.mobileSection('light')}>
      <div className={mobilePatterns.mobileContainer('lg')}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-violet-50 dark:bg-violet-900/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400 mr-2" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">What We Offer</span>
            </div>
            
            <h2 className={mobilePatterns.mobileTypography.heading + " mb-6"}>
              Why exceptional educators{" "}
              <span className="text-violet-600 dark:text-violet-400">choose Medh</span>
            </h2>
            
            <p className={mobilePatterns.mobileTypography.body + " max-w-3xl mx-auto"}>
              Join our community and unlock exclusive advantages designed to support your teaching journey and career growth.
            </p>
          </motion.div>

          {/* Offerings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 md:mb-16">
            {offerings.map((offering, index) => {
              const colors = getColorClasses(offering.color);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div className={`${mobilePatterns.mobileCard('elevated')} h-full ${getAnimations.transition('smooth')}`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center ${getAnimations.transition('smooth')} group-hover:scale-110`}>
                        <div className={colors.icon}>
                          {offering.icon}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 ${getAnimations.transition('smooth')} group-hover:${colors.icon}`}>
                          {offering.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                          {offering.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Social Proof Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className={buildComponent.card('premium', 'tablet') + " max-w-2xl mx-auto"}>
              <div className="flex items-center justify-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                    <Star className="w-4 h-4 text-blue-600" fill="currentColor" />
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Join 500+ educators worldwide making an impact
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Offerings;
