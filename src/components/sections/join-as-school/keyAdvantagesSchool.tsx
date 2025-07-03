"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Star,
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
import medhLogo from "@/assets/images/logo/medh.png";
interface IAdvantage {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface IAdditionalBenefit {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const advantagesData: IAdvantage[] = [
  {
    id: 1,
    icon: BookOpen,
    title: "Diversification of Skill Sets",
    description: "Empower students with a broader range of skills for today's fast-changing job market.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    id: 2,
    icon: BarChart3,
    title: "Data-Driven Insights for Educators",
    description: "Track student progress and personalize learning with actionable analytics.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    id: 3,
    icon: Users,
    title: "Access to Specialized Expertise",
    description: "Give students high-quality, industry-relevant courses from subject matter experts.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  },
  {
    id: 4,
    icon: GraduationCap,
    title: "Empowerment of Teachers",
    description: "Equip teachers with modern training and resources to boost their impact.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600"
  },
  {
    id: 5,
    icon: DollarSign,
    title: "Cost-Effective Solutions",
    description: "Offer more skill development options without straining your budget.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    id: 6,
    icon: Zap,
    title: "Scalability and Flexibility",
    description: "Easily scale programs and adapt to any academic schedule.",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-sky-600"
  },
  {
    id: 7,
    icon: Target,
    title: "Preparation for Future Careers",
    description: "Align learning with industry needs so students are ready for tomorrow's jobs.",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-600"
  },
  {
    id: 8,
    icon: Sparkles,
    title: "Making Students Future-ready",
    description: "Prepare students for the future with engaging, modern skill-building.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600"
  },
  {
    id: 9,
    icon: Monitor,
    title: "Integration of Technology",
    description: "Enhance digital literacy with state-of-the-art tools and platforms.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    gradientFrom: "from-purple-600",
    gradientTo: "to-violet-600"
  },
];

const advantagesPotentialData: IAdditionalBenefit[] = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Increased Student Engagement and Motivation",
    description: "Make learning fun and interactive with gamification and real-time feedback.",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Enhanced Curriculum and Learning Experience",
    description: "Enrich classes with innovative methods and cutting-edge technology.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const KeyAdvantages: React.FC = () => {
  const [hoveredAdvantage, setHoveredAdvantage] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* OUTER CONTAINER: Glassmorphism, gradient, and pattern for depth */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden px-2 py-4 sm:px-6 md:px-10 md:py-10 mb-8">
            {/* Subtle background pattern/gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-emerald-50/60 dark:from-blue-900/30 dark:via-slate-900/40 dark:to-emerald-900/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] opacity-10 dark:opacity-10 pointer-events-none" />
            <div className="relative z-10">
              {/* Modern Heading with accent */}
              <div className="flex flex-col items-center mb-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 text-center leading-tight">
                  Key advantages to <span>Schools/Institutes</span>
                </h3>
              </div>

              {/* Responsive Grid of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {advantagesData.map((advantage, index) => (
                  <div
                    key={advantage.id}
                    tabIndex={0}
                    className="group relative bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#3bac63] focus:ring-offset-2 min-h-[220px] cursor-pointer hover:-translate-y-1 hover:scale-[1.025]"
                  >
                    {/* Icon or Accent */}
                    <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${advantage.gradientFrom} ${advantage.gradientTo} shadow-sm`}>
                      <advantage.icon className={`w-7 h-7 text-white drop-shadow`} />
                    </div>
                    {/* Title */}
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 bg-gradient-to-r from-[#3bac63] to-emerald-400 bg-clip-text text-transparent">
                      {advantage.title}
                    </h4>
                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                ))}
                {advantagesPotentialData.map((item, index) => (
                  <div
                    key={item.id}
                    tabIndex={0}
                    className="group relative bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-[#3bac63] focus:ring-offset-2 min-h-[220px] cursor-pointer hover:-translate-y-1 hover:scale-[1.025]"
                  >
                    {/* Icon or Accent */}
                    <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 shadow-sm">
                      <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400 drop-shadow" />
                    </div>
                    {/* Title */}
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 bg-gradient-to-r from-[#3bac63] to-emerald-400 bg-clip-text text-transparent">
                      {item.title}
                    </h4>
                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyAdvantages;
