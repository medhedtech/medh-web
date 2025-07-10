"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen,
  BarChart3,
  Users,
  GraduationCap,
  DollarSign,
  Zap,
  Target,
  Sparkles,
  Monitor,
  TrendingUp
} from "lucide-react";

interface IAdvantage {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const advantagesData: IAdvantage[] = [
  {
    id: 1,
    icon: BookOpen,
    title: "Diversification of Skill Sets",
    description: "Empower students with a broader range of skills for today's fast-changing job market.",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    id: 2,
    icon: BarChart3,
    title: "Data-Driven Insights for Educators",
    description: "Track student progress and personalize learning with actionable analytics.",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    id: 3,
    icon: Users,
    title: "Access to Specialized Expertise",
    description: "Give students high-quality, industry-relevant courses from subject matter experts.",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  },

  {
    id: 5,
    icon: DollarSign,
    title: "Cost-Effective Solutions",
    description: "Offer more skill development options without straining your budget.",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    id: 6,
    icon: Zap,
    title: "Scalability and Flexibility",
    description: "Easily scale programs and adapt to any academic schedule.",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-sky-600"
  },

  {
    id: 8,
    icon: Sparkles,
    title: "Making Students Future-ready",
    description: "Prepare students for the future with engaging, modern skill-building.",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600"
  },
  {
    id: 9,
    icon: Monitor,
    title: "Integration of Technology",
    description: "Enhance digital literacy with state-of-the-art tools and platforms.",
    gradientFrom: "from-purple-600",
    gradientTo: "to-violet-600"
  },
  {
    id: 10,
    icon: TrendingUp,
    title: "Increased Student Engagement and Motivation",
    description: "Make learning fun and interactive with gamification and real-time feedback.",
    gradientFrom: "from-orange-600",
    gradientTo: "to-red-600"
  },

];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const KeyAdvantages: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900 py-12 md:py-16 lg:py-20">
      {/* Simplified background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-violet-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-violet-950/10 pointer-events-none" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Key advantages to{" "}
              <span className="bg-gradient-to-r from-[#3bac63] to-emerald-400 bg-clip-text text-transparent">
                Schools/Institutes
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Transform your educational institution with our comprehensive skill development platform
            </p>
          </motion.div>

          {/* Advantages Grid - Edge to Edge */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {advantagesData.map((advantage) => (
              <motion.div
                key={advantage.id}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-[#3bac63]/20 focus:outline-none focus:ring-2 focus:ring-[#3bac63]/50 focus:ring-offset-2"
                tabIndex={0}
              >
                {/* Icon */}
                <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${advantage.gradientFrom} ${advantage.gradientTo} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                  <advantage.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-[#3bac63] transition-colors duration-300">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {advantage.description}
                </p>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#3bac63] to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(KeyAdvantages);
