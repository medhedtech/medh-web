"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, ArrowRight, Briefcase } from "lucide-react";
import Arrow from "@/assets/images/join-educator/arrow1.png";
import Logo1 from "@/assets/images/join-educator/logo-1.svg";
import Logo2 from "@/assets/images/join-educator/logo-2.svg";
import Logo3 from "@/assets/images/join-educator/logo-3.svg";
import Logo4 from "@/assets/images/join-educator/logo-4.svg";
import Logo5 from "@/assets/images/join-educator/logo-5.svg";
import Logo6 from "@/assets/images/join-educator/logo-6.svg";
import Logo7 from "@/assets/images/join-educator/logo-7.svg";

const HiringProcess = () => {
  const processSteps = [
    {
      title: "Application Screening",
      description:
        "We review applications based on qualifications, experience, teaching philosophy, and alignment with Medh's mission and values.",
      icon: Logo1,
      arrow: true,
      gradient: "gradient-indigo"
    },
    {
      title: "Interview Process",
      description:
        "Selected candidates participate in interviews to evaluate teaching approach, communication skills, and subject expertise.",
      icon: Logo2,
      arrow: true,
      gradient: "gradient-violet"
    },
    {
      title: "Subject Proficiency Test",
      description:
        "Candidates complete subject proficiency assessments to demonstrate mastery of the content they'll be teaching.",
      icon: Logo3,
      arrow: false, 
      gradient: "gradient-blue"
    },
    {
      title: "Demo Session",
      description:
        "Conduct a live teaching demonstration to showcase your ability to engage students and present material effectively.",
      icon: Logo4,
      arrow: true,
      gradient: "gradient-teal" 
    },
    {
      title: "Training & Onboarding",
      description:
        "Learn Medh's teaching methodologies, technology platform, and processes through our comprehensive training program.",
      icon: Logo5,
      arrow: true,
      gradient: "gradient-emerald"
    },
    {
      title: "Contract & Compensation",
      description:
        "Review and sign your employment agreement outlining competitive compensation, benefits, and position details.",
      icon: Logo6,
      arrow: true,
      gradient: "gradient-amber"
    },
    {
      title: "Performance Support",
      description:
        "Receive ongoing feedback, coaching, and professional development opportunities to maximize your success.",
      icon: Logo7,
      arrow: false,
      gradient: "gradient-rose"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-gray-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-3xl" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50/80 dark:bg-indigo-900/40 backdrop-blur-sm rounded-full mb-6 border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Recruitment Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight tracking-tight">
            Your journey to becoming a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Medh Educator</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Our structured hiring process is designed to identify exceptional educators who will thrive in our innovative teaching environment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="relative h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
                <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full ${step.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${step.gradient} p-0.5 transform group-hover:scale-110 transition-transform duration-300 mb-6 shadow-md`}>
                    <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                      <Image 
                        src={step.icon} 
                        alt={step.title}
                        className="w-10 h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{index + 1}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Decorative bottom line */}
                <div className={`absolute bottom-0 left-0 w-full h-1.5 ${step.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl opacity-80`} />
              </div>
              
              {step.arrow && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform translate-x-0 -translate-y-1/2 z-20">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/70 rounded-full flex items-center justify-center shadow-md">
                    <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Process Timeline for Mobile */}
        <motion.div variants={itemVariants} className="block lg:hidden mt-10 mb-8">
          <div className="w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 rounded-full opacity-80"></div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Application</span>
            <span className="text-sm font-medium text-violet-700 dark:text-violet-400">Onboarding</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HiringProcess;
