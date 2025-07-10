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

const futureReadyCards = [
  {
    title: "Make students think on their feet",
    description: "Equip students to handle emergencies and adapt quickly in a fast-paced world.",
    icon: CheckCircle2,
  },
  {
    title: "Inspire students to take calculated risks",
    description: "Encourage thoughtful risk-taking to build confidence and adaptability.",
    icon: CheckCircle2,
  },
  {
    title: "Encourage students to be more creative",
    description: "Foster creativity by pushing beyond comfort zones and sharing new ideas.",
    icon: CheckCircle2,
  },
  {
    title: "Identify specific future-ready skills in children",
    description: "Help teachers tailor learning to develop essential, in-demand skills.",
    icon: CheckCircle2,
  },
  {
    title: "Introduce a student-led learning approach",
    description: "Empower students to take part in decisions and shape their learning journey.",
    icon: CheckCircle2,
  },
  {
    title: "Make communication an essential part of their journey",
    description: "Teach clear, confident communication for success in modern education.",
    icon: CheckCircle2,
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
    <>
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 md:py-16 lg:py-20">
        {/* Simplified background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-violet-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-violet-950/10 pointer-events-none" />
        
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* Header Section */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                Future-Ready Education
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Creating future-ready students through{" "}
                <span className="text-[#3bac63]">advanced educational approaches</span>
              </h2>
            </motion.div>

            {/* Content Section */}
            <motion.div 
              variants={itemVariants}
              className="mb-10 md:mb-12"
            >
              <div className="max-w-4xl mx-auto text-center mb-8 md:mb-10">
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Education is no longer confined to textbooks and exam preparation. Today, educators focus on developing lifelong skills that go beyond jobs and technology. Here's why skill-based learning is now essential in schools and institutes:
                </p>
              </div>

              {/* Skills Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12"
              >
                {skillsList.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 group hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-200/70 dark:hover:border-blue-700/50 transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {skill.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Future-Ready Cards Grid */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {futureReadyCards.map((card, idx) => (
                  <motion.div
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-4 p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 group-hover:scale-110 transition-transform duration-300 mt-1">
                      <card.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {card.title}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        {card.description}
                      </p>
                    </div>
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
