"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { PlusCircle, Users, Briefcase, ArrowRight } from "lucide-react";

// Hire component with customizable content and styles
const Hire = ({
  hireImage = hire,
  hireTitle = "Hire from Medh",
  hireText = "Recruit industry-trained, job-ready top talents to meet your business needs through our placement services.",
  hireButtonText = "Recruit@Medh",
  hireButtonColor = "#7ECA9D",
  hireButtonTextColor = "white",
  trainingImage = Traning,
  trainingTitle = "Corporate Training",
  trainingText = "Enhance your employees' skills, motivation, and engagement with our dynamic Training Courses.",
  trainingButtonText = "Empower Your Team",
  trainingButtonColor = "white",
  trainingButtonTextColor = "black",
  trainingBackgroundColor = "#7ECA9D",
  trainingTextColor = "white",
  hireBackground = "#EDE6FF",
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Convert hex colors to CSS variables or use defaults
  const isPrimaryHireBtn = hireButtonColor === "#7ECA9D";
  const hireBtnClass = isPrimaryHireBtn 
    ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white" 
    : "";
  
  const isPrimaryTrainingBg = trainingBackgroundColor === "#7ECA9D";
  const trainingBgClass = isPrimaryTrainingBg 
    ? "bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700" 
    : "";
  
  const isPrimaryHireBg = hireBackground === "#EDE6FF";
  const hireBgClass = isPrimaryHireBg 
    ? "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/30" 
    : "";

  return (
    <div className={`flex flex-col gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Hire Section */}
      <section className={`relative overflow-hidden rounded-3xl ${hireBgClass}`}
        style={!isPrimaryHireBg ? { backgroundColor: hireBackground } : {}}
      >
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary-300/30 via-purple-300/20 to-pink-300/30 dark:from-primary-500/20 dark:via-purple-500/15 dark:to-pink-500/20 rounded-full blur-3xl opacity-60 transform -translate-x-1/3 -translate-y-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-300/30 via-teal-300/20 to-primary-300/30 dark:from-blue-500/20 dark:via-teal-500/15 dark:to-primary-500/20 rounded-full blur-3xl opacity-60 transform translate-x-1/3 translate-y-1/4 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            {/* Enhanced image container with modern effects */}
            {hireImage && (
              <div className="w-full md:w-1/2 relative group p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/40 to-purple-400/40 dark:from-primary-500/40 dark:to-purple-500/40 rounded-3xl transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-ml-6"></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={hireImage}
                    width={720}
                    height={450}
                    alt="Hire from Medh"
                    className="w-full object-cover transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Modern overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            )}
            
            {/* Enhanced content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/50 dark:to-purple-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-6 group-hover:shadow-lg transition-all duration-300">
                  <Briefcase className="inline-block h-4 w-4 mr-2" />
                  Recruitment
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                  {hireTitle}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {hireText}
                </p>
                
                <button
                  onClick={() => router.push("/hire-from-medh")}
                  className={`group inline-flex items-center px-8 py-4 ${hireBtnClass} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  style={!isPrimaryHireBtn ? { backgroundColor: hireButtonColor, color: hireButtonTextColor } : {}}
                  aria-label="Hire professionals from Medh"
                >
                  <PlusCircle className="mr-3 h-5 w-5 transform transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-lg">{hireButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className={`relative overflow-hidden rounded-3xl ${trainingBgClass}`}
        style={!isPrimaryTrainingBg ? { backgroundColor: trainingBackgroundColor } : {}}
      >
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl opacity-50 transform -translate-x-1/3 translate-y-1/4 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center">
            {/* Enhanced content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-flex items-center px-5 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 group-hover:shadow-lg transition-all duration-300">
                  <Users className="inline-block h-4 w-4 mr-2" />
                  Staff Development
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: trainingTextColor }}>
                  {trainingTitle}
                </h2>
                
                <p className="text-lg leading-relaxed mb-8 opacity-90" style={{ color: trainingTextColor }}>
                  {trainingText}
                </p>
                
                <button
                  onClick={() => router.push("/corporate-training-courses")}
                  className="group inline-flex items-center px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: trainingButtonColor, 
                    color: trainingButtonTextColor,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label="Learn more about corporate training courses"
                >
                  <PlusCircle className="mr-3 h-5 w-5 transform transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-lg">{trainingButtonText}</span>
                </button>
              </div>
            </div>
            
            {/* Enhanced image container with modern effects */}
            {trainingImage && (
              <div className="w-full md:w-1/2 relative group p-6">
                <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-mr-6"></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={trainingImage}
                    width={720}
                    height={450}
                    alt={trainingTitle}
                    className="w-full object-cover transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Modern overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hire;
