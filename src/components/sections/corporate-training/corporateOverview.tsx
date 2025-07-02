"use client";

import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Target, Users, Zap, Shield, Trophy, Lightbulb, CheckCircle, ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildAdvancedComponent, getResponsive, typography, getAnimations, mobilePatterns } from "@/utils/designSystem";

interface IFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
}

interface IBenefit {
  icon: React.ReactNode;
  title: string;
  impact: string;
  metric: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Core features with concise, benefit-focused content
const coreFeatures: IFeature[] = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Tailored Solutions",
    description: "Custom programs designed for your specific industry challenges and objectives.",
    benefit: "Immediate relevance to your business needs"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Instructors",
    description: "Industry veterans with proven track records in enterprise environments.",
    benefit: "Real-world insights that drive results"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Flexible Delivery",
    description: "On-site, virtual, or hybrid formats that adapt to your schedule.",
    benefit: "Minimal disruption to operations"
  }
];

// Key business outcomes with metrics
const businessOutcomes: IBenefit[] = [
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Performance Boost",
    impact: "Measurable productivity gains",
    metric: "Up to 40% improvement"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Talent Retention",
    impact: "Reduced turnover costs",
    metric: "85% retention rate"
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Innovation Edge",
    impact: "Competitive advantage",
    metric: "3x faster adaptation"
  }
];

const CorporateOverview: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`relative ${mobilePatterns.mobileSection()} overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements - Mobile optimized */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full px-0">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className={buildAdvancedComponent.glassCard({ variant: 'hero', padding: 'mobile' })}
        >
          {/* Header Section - Mobile optimized */}
          <div className="text-center mb-10 md:mb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6 leading-tight">
                Transform Your 
                <span className="block text-blue-600 dark:text-blue-400 mt-1 md:mt-2">
                  Workforce Excellence
                </span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 md:mb-8">
                  Accelerate growth with enterprise training programs that deliver 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> measurable results</span> and 
                  <span className="font-semibold text-slate-800 dark:text-slate-200"> competitive advantage</span>
                </p>
                
                {/* Value Proposition Highlights - Mobile friendly */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 sm:px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Industry-Aligned Curriculum</span>
                  </div>
                  <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 sm:px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">Expert-Led Training</span>
                  </div>
                  <div className="flex items-center bg-violet-50 dark:bg-violet-900/30 px-3 sm:px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full mr-2 sm:mr-3"></div>
                    <span className="text-violet-700 dark:text-violet-300 font-medium">Flexible Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Features Grid - Mobile optimized */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 md:mb-16">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                  {/* Icon Header - Mobile optimized */}
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl md:rounded-2xl mb-4 sm:mb-5 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Content - Mobile optimized */}
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 md:mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Benefit Badge - Mobile friendly */}
                    <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 sm:px-4 py-2 rounded-full">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {feature.benefit}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Business Outcomes Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative overflow-hidden"
          >
            {/* Section Background */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-slate-200/50 dark:border-slate-700/50">
              {/* Decorative Elements - Mobile optimized */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl md:blur-2xl -translate-y-8 md:-translate-y-16 translate-x-8 md:translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-xl md:blur-2xl translate-y-6 md:translate-y-12 -translate-x-6 md:-translate-x-12"></div>
              
              <div className="relative z-10">
                {/* Section Header - Mobile optimized */}
                <div className="text-center mb-8 md:mb-12">
                  <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/50 px-3 sm:px-4 py-2 rounded-full mb-4 md:mb-6">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm">Proven Results</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">
                    Measurable Business Impact
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Join forward-thinking organizations that have transformed their performance through strategic training investments
                  </p>
                </div>

                {/* Outcomes Grid - Mobile optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 h-full">
                  {businessOutcomes.map((outcome, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 text-center border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group-hover:border-blue-300 dark:group-hover:border-blue-600 h-full min-h-[340px] flex flex-col justify-between">
                        {/* Icon with gradient background - Mobile optimized */}
                        <div className="relative mb-4 md:mb-6">
                          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <div className="text-white">
                              {outcome.icon}
                            </div>
                          </div>
                          {/* Glow effect */}
                          <div className="absolute inset-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-400/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-xl mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Metric Display - Mobile optimized */}
                        <div className="mb-3 md:mb-4">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            {outcome.metric}
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {outcome.title}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                            {outcome.impact}
                          </p>
                        </div>
                        
                        {/* Progress Bar Visual */}
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isVisible ? { width: `${90 - index * 10}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 1 + index * 0.2 }}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Client satisfaction rate
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom CTA - Mobile optimized */}
                <div className="text-center mt-8 md:mt-12">
                  <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm md:text-base text-emerald-700 dark:text-emerald-300 font-medium">
                      Results backed by industry data and client success stories
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Minimal Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 md:mt-16"
          >
            <div className="bg-blue-600 dark:bg-blue-700 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
              {/* Simple Header */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to Transform Your Organization?
                </h3>
                <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
                  Join industry leaders who have accelerated their growth through strategic workforce development
                </p>
              </div>
              
              {/* Simple Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6">
                <button
                  onClick={() => router.push('#enroll-form')}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
                >
                  Start Your Training Journey
                </button>
                
                <button
                  onClick={() => router.push('/contact-us')}
                  className="w-full sm:w-auto px-6 py-3 text-white border-2 border-white/30 font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  Speak with Expert
                </button>
              </div>
              
              {/* Simple Trust Indicators */}
              <div className="border-t border-white/20 pt-4">
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-blue-100">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>ISO Certified</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Trained Professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(CorporateOverview);
