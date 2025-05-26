"use client";

import React from "react";
import Link from "next/link";
import { FaVideo, FaUsers, FaGraduationCap } from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiAcademicCap } from "react-icons/hi";

const sessionTypes = [
  {
    id: "Demo",
    title: "Demo Classes",
    subtitle: "free trial sessions",
    description: "Experience our teaching style with complimentary demo sessions",
    icon: FaGraduationCap,
    heroIcon: HiAcademicCap,
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "from-emerald-900/20 to-teal-900/20",
    emoji: "🎓",
    illustration: "👨‍🎓📚💡",
    stats: { sessions: "25+", duration: "30 min", type: "Free" }
  },
  {
    id: "live",
    title: "Live Classes",
    subtitle: "real-time interactive sessions",
    description: "Join live sessions with real-time interaction and Q&A",
    icon: FaVideo,
    heroIcon: HiLightningBolt,
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "from-emerald-900/20 to-teal-900/20",
    emoji: "📹",
    illustration: "👨‍💻🖥️⏰",
    stats: { sessions: "40+", duration: "60 min", type: "Live" }
  },
  {
    id: "Blended",
    title: "Blended Classes",
    subtitle: "hybrid learning experience",
    description: "Combination of live sessions and pre-recorded content",
    icon: FaUsers,
    heroIcon: HiSparkles,
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "from-emerald-900/20 to-teal-900/20",
    emoji: "🎯",
    illustration: "🎬📱💾",
    stats: { sessions: "35+", duration: "45 min", type: "Hybrid" }
  }
];

export default function OnlineClassSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-20">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium tracking-wider uppercase">online classes</span>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping delay-300"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent mb-4">
          choose your format
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          select your preferred learning style ✨
        </p>
      </div>

      {/* Session Types Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sessionTypes.map((sessionType) => {
            const IconComponent = sessionType.icon;
            const HeroIconComponent = sessionType.heroIcon;
            
            return (
              <Link
                key={sessionType.id}
                href={`/dashboards/admin/online-class/${sessionType.id}`}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 min-h-[500px] flex flex-col">
                  {/* Illustration Area */}
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 mb-6 flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{sessionType.illustration}</div>
                      <IconComponent className="text-4xl text-emerald-600 dark:text-emerald-400 mx-auto" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-white">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold">{sessionType.title}</h3>
                      <span className="text-2xl">{sessionType.emoji}</span>
                    </div>
                    <p className="text-emerald-100 text-sm mb-4">{sessionType.subtitle}</p>
                    <p className="text-emerald-50 text-xs mb-6 opacity-90">{sessionType.description}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">{sessionType.stats.sessions}</div>
                        <div className="text-xs text-emerald-100">sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">{sessionType.stats.duration}</div>
                        <div className="text-xs text-emerald-100">duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-white">{sessionType.stats.type}</div>
                        <div className="text-xs text-emerald-100">type</div>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100 text-sm font-medium">manage classes</span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional info section */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              comprehensive learning management 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Create, manage, and track online sessions across all formats. Each format offers specialized tools and features tailored to different learning methodologies and student engagement levels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Demo Classes</div>
                <div className="text-emerald-600 dark:text-emerald-400">Perfect for trial sessions and course previews</div>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Live Classes</div>
                <div className="text-teal-600 dark:text-teal-400">Real-time interaction with immediate feedback</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="font-semibold text-green-700 dark:text-green-300 mb-1">Blended Classes</div>
                <div className="text-green-600 dark:text-green-400">Best of both worlds - live and recorded content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 