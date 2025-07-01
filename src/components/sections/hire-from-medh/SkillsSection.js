"use client";
import React from "react";
import Image from "next/image";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import SkillSectionImg from "@/assets/images/hireformmedh/skillsectionimg.jpeg";

const SkillsSection = () => {
  const skills = [
    "Artificial Intelligence (AI)",
    "Data Science & Analytics",
    "Cloud Computing",
    "Mobile App Development",
    "Big Data",
    "Web Development",
    "Cyber Security",
    "Digital Marketing ... and many more.",
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Image Section */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1">
            <div className="relative group">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-600/20 shadow-2xl"></div>
              
              {/* Main image container */}
              <div className="relative p-4 rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-600/30">
                <Image
                  src={SkillSectionImg}
                  alt="Professional learning environment - Medh candidates in training"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-xl transform group-hover:scale-105 transition-all duration-700"
                  priority
                />
                
                {/* Floating badge */}
                <div className="absolute top-8 right-8 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                  <Sparkles className="inline w-4 h-4 mr-1" />
                  Industry Ready
                </div>
              </div>
              
              {/* Enhanced decorative elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            {/* Header with enhanced styling */}
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-full border border-emerald-200 dark:border-emerald-700/50 mb-4">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Diverse Skill Sets</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Skilled Professionals
              </h2>
              <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                across key technology domains
              </p>
            </div>

            {/* Enhanced Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="group flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
