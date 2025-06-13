"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  ArrowUpRight, 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Building,
  BookOpen,
  BarChart
} from "lucide-react";
import { useTheme } from "next-themes";

// Simplified interfaces
interface IHireFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

// Optimized feature data - reduced to essential items
const HIRE_FEATURES: IHireFeature[] = [
  { icon: Target, text: "Pre-screened candidates with verified skills" },
  { icon: Clock, text: "Faster hiring process with reduced time-to-hire" },
  { icon: Award, text: "Industry-certified professionals ready to contribute" },
  { icon: TrendingUp, text: "Access to diverse talent pool across domains" }
];

const TRAINING_FEATURES: IHireFeature[] = [
  { icon: BookOpen, text: "Customized training modules for your team" },
  { icon: BarChart, text: "Skill-gap analysis and performance tracking" },
  { icon: Award, text: "Industry expert trainers with real experience" },
  { icon: Target, text: "Hands-on practical sessions and projects" }
];

// Optimized main component
const Hire: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const isDark = mounted ? theme === 'dark' : true;
  
  // Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Optimized navigation handlers
  const handleHireNavigate = useCallback(() => {
    router.push("/hire-from-medh");
  }, [router]);

  const handleTrainingNavigate = useCallback(() => {
    router.push("/corporate-training-courses");
  }, [router]);

  // Loading state
  if (!mounted) {
    return (
      <div className="py-8 opacity-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`}>
      
      <section className="w-full py-8 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 mb-6">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Hiring Solutions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Hire Top <span className="text-blue-600 dark:text-blue-400">Talent</span> from Medh
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Connect with skilled professionals and get customized training solutions for your organization's growth.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            
            {/* Hire from Medh Card */}
            <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-full rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Hire from Medh
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access skilled professionals
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {HIRE_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleHireNavigate}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Recruit@Medh</span>
                  <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Corporate Training Card */}
            <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-full rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Corporate Training
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Upskill your workforce
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {TRAINING_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleTrainingNavigate}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Empower Your Team</span>
                  <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 relative">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you need skilled professionals or want to upskill your existing team, we have the right solution for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleHireNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 border border-blue-200 dark:border-blue-800"
              >
                <Users className="mr-2 w-4 h-4" />
                Hire Talent
              </button>
              <button
                onClick={handleTrainingNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-300 border border-purple-200 dark:border-purple-800"
              >
                <Building className="mr-2 w-4 h-4" />
                Corporate Training
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hire; 