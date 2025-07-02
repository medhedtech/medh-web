"use client";
import React, { useState } from "react";
import {
  BookOpen,
  MonitorPlay,
  GraduationCap,
  MessagesSquare,
  Award,
  Users2,
  LucideIcon,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";

// TypeScript interfaces
interface IFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'courses' | 'support' | 'certification' | 'community' | 'interactive' | 'experts';
  highlight?: string;
  stats?: string;
  benefit?: string;
}

const MembershipFeatures: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: IFeature[] = [
    {
      title: "Expert Programs",
      description: "Industry-ready courses by professionals",
      icon: BookOpen,
      category: "courses",
      highlight: "Market-Ready",
      stats: "50+ Programs",
      benefit: "Career-focused"
    },
    {
      title: "Live Sessions",
      description: "Real-time Q&A and mentorship",
      icon: MonitorPlay,
      category: "interactive",
      highlight: "Real-time",
      stats: "100+ Hours/Month",
      benefit: "Instant help"
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry veterans",
      icon: GraduationCap,
      category: "experts",
      highlight: "5+ Years Exp",
      stats: "10+ Experts",
      benefit: "Practical insights"
    },
    {
      title: "24/7 Support",
      description: "Always-available learning assistance",
      icon: MessagesSquare,
      category: "support",
      highlight: "Always On",
      stats: "Response <2hrs",
      benefit: "Never stuck"
    },
    {
      title: "Recognized Certificates",
      description: "Industry-valued credentials",
      icon: Award,
      category: "certification",
      highlight: "Employer-Valued",
      stats: "95% Recognition",
      benefit: "Career boost"
    },
    {
      title: "Job Placement",
      description: "Career assistance and job referrals",
      icon: Users2,
      category: "community",
      highlight: "Guaranteed",
      stats: "95% Placement",
      benefit: "Career success"
    },
  ];

  const getSemanticColor = (category: IFeature['category']): { bg: string; text: string; border: string } => {
    const colorMap = {
      courses: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
      interactive: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
      experts: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
      support: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
      certification: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
      community: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' }
    };
    return colorMap[category] || { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' };
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="w-full">
        {/* Main Container */}
        <div className="bg-white dark:bg-gray-800 shadow-xl border-t border-b border-gray-200 dark:border-gray-700">
          {/* Compact Header with Impact */}
          <div className="text-center mb-8 px-6 md:px-8 lg:px-10 pt-6 md:pt-8 lg:pt-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Star className="w-3 h-3 fill-current" />
              Premium Features
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              What's Included
            </h2>
          </div>

          {/* Compact Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-8 lg:px-10">
            {features.map((feature: IFeature, index: number) => {
              const colors = getSemanticColor(feature.category);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className="relative bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-5"
                >
                {/* Top Section */}
                <div className="flex items-center justify-between mb-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5" strokeWidth={2} />
                  </div>

                  {/* Stats Badge */}
                  {feature.stats && (
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {feature.stats}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                      {feature.title}
                    </h3>
                    
                    {feature.highlight && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.text} ${colors.bg} ${colors.border}`}>
                        {feature.highlight}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefit */}
                  {feature.benefit && (
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {feature.benefit}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-12 text-center px-6 md:px-8 lg:px-10 pb-6 md:pb-8 lg:pb-10">
            <div className="w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Trusted by Professionals Worldwide
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Career Growth Rate</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Industry Recognized</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipFeatures;
