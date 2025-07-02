"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, Award, Clock, Users, 
  GraduationCap, ArrowRight, Star, Zap, CheckCircle
} from "lucide-react";
import { buildComponent, getResponsive, getAnimations, mobilePatterns } from "@/utils/designSystem";

const benefitsData = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Impact",
    description: "Reach students worldwide and create lasting educational change.",
    color: "blue"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Advanced Tools",
    description: "Access cutting-edge AI-powered teaching platforms and resources.",
    color: "violet"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Schedule",
    description: "Enjoy work-life balance with remote teaching opportunities.",
    color: "emerald"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Professional Growth",
    description: "Advance your career with continuous learning and development.",
    color: "rose"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Expert Community",
    description: "Connect with innovative educators in a supportive network.",
    color: "indigo"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Competitive Pay",
    description: "Earn industry-leading compensation for your expertise.",
    color: "amber"
  },
];

// Simplified earning potential data
const compensationHighlights = [
  "Industry-leading compensation packages",
  "Performance-based bonuses and incentives", 
  "Professional development funding",
  "Leadership advancement opportunities"
];

const Benefits = () => {
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
      rose: { icon: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-200 dark:border-rose-700" },
      indigo: { icon: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-200 dark:border-indigo-700" },
      amber: { icon: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-700" }
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
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Why Choose Medh</span>
            </div>
            
            <h2 className={mobilePatterns.mobileTypography.heading + " mb-6"}>
              Join a platform that <span className="text-blue-600 dark:text-blue-400">values educators</span>
            </h2>
            
            <p className={mobilePatterns.mobileTypography.body + " max-w-3xl mx-auto"}>
              Experience the benefits of teaching with cutting-edge tools, flexible schedules, and a supportive community.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className={mobilePatterns.mobileLayouts.adaptiveGrid + " mb-12 md:mb-16"}>
            {benefitsData.map((benefit, index) => {
              const colors = getColorClasses(benefit.color);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div className={`${mobilePatterns.mobileCard('elevated')} h-full ${getAnimations.transition('smooth')}`}>
                    <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center mb-4 ${getAnimations.transition('smooth')} group-hover:scale-110`}>
                      <div className={colors.icon}>
                        {benefit.icon}
                      </div>
                    </div>
                    
                    <h3 className={`text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 ${getAnimations.transition('smooth')} group-hover:${colors.icon}`}>
                      {benefit.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Compensation Highlights */}
          <motion.div variants={itemVariants} className="text-center">
            <div className={buildComponent.card('premium', 'tablet') + " max-w-4xl mx-auto"}>
              <div className="inline-flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-full mb-6">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" fill="currentColor" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Compensation & Growth</span>
              </div>
              
              <h3 className={mobilePatterns.mobileTypography.subheading + " mb-6"}>
                Competitive <span className="text-amber-600 dark:text-amber-400">rewards</span> for exceptional educators
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compensationHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm md:text-base">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
