"use client";

import React from "react";
import Link from "next/link";
import { FaRobot, FaUser, FaCalculator, FaChartLine, FaArrowRight } from "react-icons/fa";

type ColorType = "blue" | "rose" | "emerald" | "amber";

interface ICategory {
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

const categories: ICategory[] = [
  {
    id: "ai-data-science",
    title: "AI and Data Science",
    subtitle: "explore the future of technology",
    description: "Machine learning, artificial intelligence, and data analytics courses",
    icon: FaRobot,
    color: "blue"
  },
  {
    id: "personality-development",
    title: "Personality Development",
    subtitle: "unlock your true potential",
    description: "Communication skills, leadership, and personal growth programs",
    icon: FaUser,
    color: "rose"
  },
  {
    id: "vedic-mathematics",
    title: "Vedic Mathematics",
    subtitle: "ancient wisdom, modern application",
    description: "Fast calculation techniques and mathematical problem-solving methods",
    icon: FaCalculator,
    color: "emerald"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing with Data Analytics",
    subtitle: "master the digital landscape",
    description: "SEO, social media marketing, and data-driven marketing strategies",
    icon: FaChartLine,
    color: "amber"
  }
];

const colorClasses: Record<ColorType, IColorClasses> = {
  blue: {
    icon: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-600",
    hover: "hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30"
  },
  rose: {
    icon: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-600",
    hover: "hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
  },
  emerald: {
    icon: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-600",
    hover: "hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
  },
  amber: {
    icon: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-600",
    hover: "hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
  }
};

export default function CategorySelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="text-center py-16 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-6">
          <span className="text-sm text-gray-700 dark:text-gray-300">live classes</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Choose Your Category
        </h1>
        
        <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          Select a category to manage online classes
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const colors = colorClasses[category.color];
            
            return (
              <Link
                key={category.id}
                href={`/dashboards/admin/online-class/live/${category.id}`}
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
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {category.subtitle}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {category.description}
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