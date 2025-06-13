"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import Educator from "@/assets/images/hire/Educator.png";
import Partner from "@/assets/images/hire/Partner.png";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  Building, 
  ArrowUpRight, 
  Trophy, 
  Award, 
  Target, 
  BookOpen,
  Clock,
  Globe
} from "lucide-react";
import { useTheme } from "next-themes";

// Simplified interfaces
interface IFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

// Optimized feature data - reduced to essential items
const EDUCATOR_FEATURES: IFeature[] = [
  { icon: Globe, text: "Global teaching platform" },
  { icon: Clock, text: "Flexible scheduling" },
  { icon: Award, text: "Competitive compensation" },
  { icon: BookOpen, text: "Teaching resources provided" }
];

const PARTNER_FEATURES: IFeature[] = [
  { icon: Target, text: "Customized training programs" },
  { icon: Award, text: "Industry-aligned curriculum" },
  { icon: Trophy, text: "Cutting-edge resources" },
  { icon: Building, text: "Enhanced employability" }
];

// Optimized main component
const JoinMedh: React.FC = () => {
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
  const handleEducatorNavigate = useCallback(() => {
    router.push("/join-us-as-educator");
  }, [router]);

  const handlePartnerNavigate = useCallback(() => {
    router.push("/join-us-as-school-institute");
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
              <Users className="w-6 h-6 text-primary-500" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Educational Ecosystem
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
              Join Our Educational <span className="text-primary-600 dark:text-primary-400">Ecosystem</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be part of a thriving community that's shaping the future of education. Whether you're an educator or an institution, we have the perfect platform for you.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            
            {/* Educator Card */}
            <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-full rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Join Medh as an Educator
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Share your expertise globally
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={Educator}
                    alt="Join as Educator"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {EDUCATOR_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleEducatorNavigate}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Get Started</span>
                  <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Partner Card */}
            <div className="group relative h-full transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-full rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Partner with Medh as a School / Institute
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enhance your educational offerings
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={Partner}
                    alt="Partner with us"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {PARTNER_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                        <feature.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePartnerNavigate}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Let's Collaborate</span>
                  <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 relative">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to transform education? Join thousands of educators and institutions who are already part of our ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleEducatorNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-all duration-300 border border-primary-200 dark:border-primary-800"
              >
                <GraduationCap className="mr-2 w-4 h-4" />
                Join as Educator
              </button>
              <button
                onClick={handlePartnerNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-300 border border-green-200 dark:border-green-800"
              >
                <Building className="mr-2 w-4 h-4" />
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinMedh; 