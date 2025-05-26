"use client";

import React from "react";
import Link from "next/link";
import { FaRobot, FaUser, FaCalculator, FaChartLine } from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiAcademicCap, HiTrendingUp } from "react-icons/hi";

const categories = [
  {
    id: "ai-data-science",
    title: "AI and Data Science",
    subtitle: "explore the future of technology",
    description: "Machine learning, artificial intelligence, and data analytics courses",
    icon: FaRobot,
    heroIcon: HiLightningBolt,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    bgGradient: "from-purple-100 to-indigo-100",
    darkBgGradient: "from-purple-900/30 to-indigo-900/30",
    emoji: "🤖"
  },
  {
    id: "personality-development",
    title: "Personality Development",
    subtitle: "unlock your true potential",
    description: "Communication skills, leadership, and personal growth programs",
    icon: FaUser,
    heroIcon: HiSparkles,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgGradient: "from-pink-100 to-rose-100",
    darkBgGradient: "from-pink-900/30 to-rose-900/30",
    emoji: "✨"
  },
  {
    id: "vedic-mathematics",
    title: "Vedic Mathematics",
    subtitle: "ancient wisdom, modern application",
    description: "Fast calculation techniques and mathematical problem-solving methods",
    icon: FaCalculator,
    heroIcon: HiAcademicCap,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-100 to-teal-100",
    darkBgGradient: "from-emerald-900/30 to-teal-900/30",
    emoji: "🧮"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing with Data Analytics",
    subtitle: "master the digital landscape",
    description: "SEO, social media marketing, and data-driven marketing strategies",
    icon: FaChartLine,
    heroIcon: HiTrendingUp,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-orange-100 to-amber-100",
    darkBgGradient: "from-orange-900/30 to-amber-900/30",
    emoji: "📈"
  }
];

export default function CategorySelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-20">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
          <span className="text-purple-600 dark:text-purple-400 text-sm font-medium tracking-wider uppercase">online classes</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-700 to-blue-700 dark:from-gray-100 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent mb-4">
          choose your path
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          select a category to manage online classes ✨
        </p>
      </div>

      {/* Categories Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const HeroIconComponent = category.heroIcon;
            
            return (
              <Link
                key={category.id}
                href={`/dashboards/admin/online-class/live/${category.id}`}
                className="group relative"
              >
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700 p-8 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} dark:${category.darkBgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <HeroIconComponent className="text-4xl text-gray-600 dark:text-gray-400" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Category header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                              <IconComponent className="text-2xl text-gray-700 dark:text-gray-300" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                              {category.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{category.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      <div className="text-3xl ml-4">{category.emoji}</div>
                    </div>

                    {/* Action button */}
                    <div className={`w-full py-3 px-6 bg-gradient-to-r ${category.gradient} text-white rounded-xl font-semibold text-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                      manage classes
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional info section */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              comprehensive learning management 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Create, manage, and track online sessions across all categories. Each category offers specialized tools and features tailored to the specific learning needs and teaching methodologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 