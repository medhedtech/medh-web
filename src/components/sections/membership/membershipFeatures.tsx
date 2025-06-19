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
  LucideIcon,
  ArrowRight
} from "lucide-react";
import { 
  ds
} from "@/utils/designSystem";

// TypeScript interfaces
interface IFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'courses' | 'support' | 'certification' | 'pricing' | 'enrollment';
  highlight?: string;
}

const MembershipFeatures: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: IFeature[] = [
    {
      title: "Program Selection and Design",
      description:
        "We offer a wide array of programs, carefully curated to cater to various skill levels and industries. Our programs are designed by a team of experts, considering market trends, industry demands, and emerging technologies.",
      icon: BookOpen,
      category: "courses",
      highlight: "Expert-Curated"
    },
    {
      title: "Interactive Learning Environment",
      description:
        "Our platform features multimedia content, quizzes, assignments, and Live Interactive Sessions with our Educators for doubt clearance and mentorship. This fosters active engagement, collaboration, and hands-on application of skills.",
      icon: MonitorPlay,
      category: "enrollment",
      highlight: "Live Sessions"
    },
    {
      title: "Experienced Educators",
      description:
        "Our programs are curated by experienced instructors who bring a wealth of knowledge and practical experience to the table. They provide guidance, answer queries, and facilitate discussions to enhance the learning experience.",
      icon: GraduationCap,
      category: "certification",
      highlight: "Industry Experts"
    },
    {
      title: "Continuous Support and Feedback",
      description:
        "Throughout the course, we provide ongoing support, feedback, and guidance to ensure learners are on the right track. We believe in a collaborative learning experience and encourage peer-to-peer interactions.",
      icon: MessagesSquare,
      category: "support",
      highlight: "24/7 Support"
    },
    {
      title: "Industry-Relevant Certifications",
      description:
        "Upon successful completion of a program, learners receive a certificate that is recognized by industry professionals. This certification serves as a testament to their acquired skills and boosts their career prospects.",
      icon: Award,
      category: "certification",
      highlight: "Recognized Certs"
    },
    {
      title: "Community Engagement",
      description:
        "Our platform facilitates a vibrant community where learners can network, share experiences, and collaborate on projects. We believe in building a strong professional network for our learners, helping them to thrive in their careers.",
      icon: Users2,
      category: "pricing",
      highlight: "Global Network"
    },
  ];

  // Get semantic colors directly from design system
  const getSemanticColorValue = (category: IFeature['category'], variant: 'light' | 'dark' = 'light') => {
    return ds.colors.semantic[category][variant];
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-36 h-36 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 z-10">
        {/* Clean Header */}
        <div className="bg-white dark:bg-slate-900 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm mb-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Membership Features
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive benefits and features that make our membership program 
              the ultimate choice for your professional growth and success.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {features.map((feature: IFeature, index: number) => {
            const semanticColor = getSemanticColorValue(feature.category, 'light');

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group bg-white dark:bg-slate-900 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/25 dark:hover:shadow-slate-800/50 hover:-translate-y-2 hover:scale-[1.02] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 ease-out cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: `${semanticColor}15`,
                      color: semanticColor
                    }}
                  >
                    <feature.icon className="w-6 h-6 transition-all duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  </div>

                  {/* Badge */}
                  {feature.highlight && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        color: semanticColor,
                        backgroundColor: `${semanticColor}10`,
                        borderColor: `${semanticColor}30`
                      }}
                    >
                      {feature.highlight}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 
                    className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-tight transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                  >
                    {feature.title}
                  </h3>

                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default MembershipFeatures;
