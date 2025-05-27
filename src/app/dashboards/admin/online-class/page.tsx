"use client";

import React from "react";
import Link from "next/link";
import { FaVideo, FaUsers, FaGraduationCap, FaArrowRight } from "react-icons/fa";

type ColorType = "violet" | "emerald" | "rose";

interface ISessionType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorType;
}

interface IColorClasses {
  icon: string;
  border: string;
  hover: string;
}

const sessionTypes: ISessionType[] = [
  {
    id: "Demo",
    title: "Demo Classes",
    subtitle: "try before you buy",
    description: "Free trial sessions to experience our teaching style",
    icon: FaGraduationCap,
    color: "violet"
  },
  {
    id: "live",
    title: "Live Classes",
    subtitle: "real-time learning",
    description: "Interactive sessions with instant feedback and Q&A",
    icon: FaVideo,
    color: "emerald"
  },
  {
    id: "Blended",
    title: "Blended Classes",
    subtitle: "best of both worlds",
    description: "Mix of live sessions and self-paced content",
    icon: FaUsers,
    color: "rose"
  }
];

const colorClasses: Record<ColorType, IColorClasses> = {
  violet: {
    icon: "text-violet-700 dark:text-violet-300",
    border: "border-violet-300 dark:border-violet-600",
    hover: "hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30"
  },
  emerald: {
    icon: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-600",
    hover: "hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
  },
  rose: {
    icon: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-600",
    hover: "hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
  }
};

export default function OnlineClassSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
      <div className="text-center py-16 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
          <span className="text-sm text-gray-700 dark:text-gray-300">online classes</span>
          </div>
          
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Choose Your Learning Style
          </h1>
          
        <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          Select the perfect format for your educational journey
          </p>
        </div>

        {/* Session Types */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessionTypes.map((sessionType) => {
              const IconComponent = sessionType.icon;
            const colors = colorClasses[sessionType.color];
              
              return (
                <Link
                  key={sessionType.id}
                  href={`/dashboards/admin/online-class/${sessionType.id}`}
                className="group h-full"
                >
                <div className={`bg-white dark:bg-gray-900 border-2 ${colors.border} ${colors.hover} rounded-xl p-6 transition-all duration-200 hover:shadow-md h-full flex flex-col min-h-[200px]`}>
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4 flex-1">
                    <div className="flex-shrink-0">
                      <IconComponent className={`text-2xl ${colors.icon}`} />
                          </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1 line-clamp-2">
                          {sessionType.title}
                        </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                          {sessionType.subtitle}
                        </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {sessionType.description}
                        </p>
                    </div>
                </div>
                
                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Manage Classes
                    </span>
                    <FaArrowRight className="text-sm text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 