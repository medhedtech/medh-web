"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  MonitorPlay,
  GraduationCap,
  MessagesSquare,
  Award,
  Users2,
  LucideIcon
} from "lucide-react";

// TypeScript interfaces
interface IFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

const MembershipFeatures: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: IFeature[] = [
    {
      title: "Program Selection and Design",
      description:
        "We offer a wide array of programs, carefully curated to cater to various skill levels and industries. Our programs are designed by a team of experts, considering market trends, industry demands, and emerging technologies.",
      icon: BookOpen,
      color: "blue",
      gradient: "from-blue-600 via-indigo-500 to-violet-600"
    },
    {
      title: "Interactive Learning Environment",
      description:
        "Our platform features multimedia content, quizzes, assignments, and Live Interactive Sessions with our Educators for doubt clearance and mentorship. This fosters active engagement, collaboration, and hands-on application of skills.",
      icon: MonitorPlay,
      color: "teal",
      gradient: "from-teal-400 via-emerald-500 to-cyan-600"
    },
    {
      title: "Experienced Educators",
      description:
        "Our programs are curated by experienced instructors who bring a wealth of knowledge and practical experience to the table. They provide guidance, answer queries, and facilitate discussions to enhance the learning experience.",
      icon: GraduationCap,
      color: "fuchsia",
      gradient: "from-fuchsia-500 via-purple-600 to-pink-600"
    },
    {
      title: "Continuous Support and Feedback",
      description:
        "Throughout the course, we provide ongoing support, feedback, and guidance to ensure learners are on the right track. We believe in a collaborative learning experience and encourage peer-to-peer interactions.",
      icon: MessagesSquare,
      color: "amber",
      gradient: "from-amber-500 via-orange-600 to-yellow-500"
    },
    {
      title: "Industry-Relevant Certifications",
      description:
        "Upon successful completion of a program, learners receive a certificate that is recognized by industry professionals. This certification serves as a testament to their acquired skills and boosts their career prospects.",
      icon: Award,
      color: "rose",
      gradient: "from-rose-600 via-pink-600 to-red-600"
    },
    {
      title: "Community Engagement",
      description:
        "Our platform facilitates a vibrant community where learners can network, share experiences, and collaborate on projects. We believe in building a strong professional network for our learners, helping them to thrive in their careers.",
      icon: Users2,
      color: "sky",
      gradient: "from-sky-400 via-blue-600 to-indigo-600"
    },
  ];

  const getGradientClass = (gradient: string): string => {
    return `bg-gradient-to-r ${gradient} bg-clip-text text-transparent hover:saturate-150 transition-all duration-300`;
  };

  const getIconBgClass = (color: string): string => {
    const backgrounds: Record<string, string> = {
      blue: "bg-gradient-to-br from-blue-600/10 via-indigo-500/10 to-violet-600/10 hover:from-blue-600/20 hover:via-indigo-500/20 hover:to-violet-600/20",
      teal: "bg-gradient-to-br from-teal-400/10 via-emerald-500/10 to-cyan-600/10 hover:from-teal-400/20 hover:via-emerald-500/20 hover:to-cyan-600/20",
      fuchsia: "bg-gradient-to-br from-fuchsia-500/10 via-purple-600/10 to-pink-600/10 hover:from-fuchsia-500/20 hover:via-purple-600/20 hover:to-pink-600/20",
      amber: "bg-gradient-to-br from-amber-500/10 via-orange-600/10 to-yellow-500/10 hover:from-amber-500/20 hover:via-orange-600/20 hover:to-yellow-500/20",
      rose: "bg-gradient-to-br from-rose-600/10 via-pink-600/10 to-red-600/10 hover:from-rose-600/20 hover:via-pink-600/20 hover:to-red-600/20",
      sky: "bg-gradient-to-br from-sky-400/10 via-blue-600/10 to-indigo-600/10 hover:from-sky-400/20 hover:via-blue-600/20 hover:to-indigo-600/20"
    };
    return `${backgrounds[color]} transition-all duration-500`;
  };

  const getIconClass = (color: string): string => {
    const colors: Record<string, string> = {
      blue: "text-blue-600 dark:text-blue-400",
      teal: "text-teal-600 dark:text-teal-400",
      fuchsia: "text-fuchsia-600 dark:text-fuchsia-400",
      amber: "text-amber-600 dark:text-amber-400",
      rose: "text-rose-600 dark:text-rose-400",
      sky: "text-sky-600 dark:text-sky-400"
    };
    return `${colors[color]} group-hover:scale-110 transition-transform duration-300`;
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="membership-features" className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-emerald-500/20 via-teal-600/20 to-cyan-600/20 rounded-full blur-3xl opacity-60 translate-x-1/4 translate-y-1/4 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: IFeature, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-100/20 dark:border-gray-700/30 hover:shadow-2xl hover:shadow-${feature.color}-500/20 transition-all duration-500"
            >
              <div className={`p-6 ${getIconBgClass(feature.color)}`}>
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    className="w-14 h-14 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800/80 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100/20 dark:border-gray-700/30"
                  >
                    <feature.icon className={`w-7 h-7 ${getIconClass(feature.color)}`} strokeWidth={1.5} />
                  </motion.div>
                  <h3 className={`text-xl font-bold ${getGradientClass(feature.gradient)} group-hover:scale-105 transition-transform duration-300`}>
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipFeatures;
