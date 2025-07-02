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
    impact: "Measurable productivity gains across teams",
    metric: "Up to 40% improvement"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Talent Retention",
    impact: "Reduced turnover costs significantly",
    metric: "85% retention rate"
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Innovation Edge",
    impact: "Competitive advantage in market",
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
    <section className="relative w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements - Mobile optimized */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl sm:blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="w-full bg-white/10 backdrop-blur-xl border-y border-white/20 py-8 md:py-12 lg:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 md:mb-16 h-full">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-600 shadow-lg h-full min-h-[340px] flex flex-col justify-between">
                  {/* Icon Header - Mobile optimized */}
                  <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl md:rounded-2xl mb-4 sm:mb-5 md:mb-6 mx-auto">
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

          </div>
        </motion.div>

        {/* Executive Results Section - Edge-to-Edge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative overflow-hidden w-full"
        >
          {/* Premium Background with Subtle Texture */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 w-full border-y border-blue-800/30 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
              
              {/* Sophisticated Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-40 -translate-x-40"></div>
              
              <div className="relative z-10">
                {/* Executive Header */}
                <div className="text-center mb-8 md:mb-12">
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 px-3 py-1.5 rounded-full mb-4">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-blue-200 font-medium text-xs tracking-wide uppercase">Executive Impact</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    Transformational 
                    <span className="block text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">
                      Business Results
                    </span>
                  </h2>
                  
                  <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                    Join industry leaders who have achieved remarkable transformation through our 
                    <span className="text-white font-semibold"> strategic workforce development programs</span>
                  </p>
                </div>

                {/* Outcomes Grid - Mobile optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8">
                  {businessOutcomes.map((outcome, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                      className="group relative"
                    >
                      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/20 h-full flex flex-col">
                        
                        {/* Floating Icon */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300">
                            <div className="text-white text-sm">
                              {outcome.icon}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="text-center pt-6 flex-1 flex flex-col justify-between">
                          {/* Primary Metric */}
                          <div className="mb-3">
                            <div className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text mb-1 min-h-[2.5rem] flex items-center justify-center">
                              {outcome.metric}
                            </div>
                            <div className="h-px w-12 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mb-3"></div>
                          </div>
                          
                          {/* Title & Description */}
                          <div className="flex-1 flex flex-col justify-center">
                            <h3 className="text-base md:text-lg font-bold text-white mb-2 min-h-[1.5rem]">
                              {outcome.title}
                            </h3>
                            <p className="text-blue-100/70 text-xs md:text-sm leading-relaxed min-h-[2.5rem] flex items-center justify-center">
                              {outcome.impact}
                            </p>
                          </div>
                        </div>
                        
                        {/* Subtle Bottom Accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-blue-400/50 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Executive Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="border-t border-white/10 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-white font-semibold text-sm mb-1">ISO 27001 Certified</div>
                      <div className="text-blue-200/60 text-xs">Enterprise-grade security & compliance</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-white font-semibold text-sm mb-1">Trusted by Industry Leaders</div>
                      <div className="text-blue-200/60 text-xs">Focus on Global Standards</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center mb-2">
                        <Trophy className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="text-white font-semibold text-sm mb-1">92% Completion Rate</div>
                      <div className="text-blue-200/60 text-xs">Consistent delivery excellence</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Minimal Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(CorporateOverview);
