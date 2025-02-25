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
    ? "bg-primary-500 hover:bg-primary-600 text-white" 
    : "";
  
  const isPrimaryTrainingBg = trainingBackgroundColor === "#7ECA9D";
  const trainingBgClass = isPrimaryTrainingBg 
    ? "bg-primary-500 dark:bg-primary-600" 
    : "";
  
  const isPrimaryHireBg = hireBackground === "#EDE6FF";
  const hireBgClass = isPrimaryHireBg 
    ? "bg-purple-50 dark:bg-purple-900/20" 
    : "";

  return (
    <div className={`flex flex-col gap-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hire Section */}
      <section className={`relative overflow-hidden ${hireBgClass}`}
        style={!isPrimaryHireBg ? { backgroundColor: hireBackground } : {}}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-3xl opacity-40 transform -translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-secondary-100/30 dark:bg-secondary-900/10 rounded-full blur-3xl opacity-40 transform translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            {/* Image container with animated effect */}
            {hireImage && (
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-3xl transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-ml-6"></div>
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl">
                  <Image
                    src={hireImage}
                    width={720}
                    height={450}
                    alt="Hire from Medh"
                    className="w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            )}
            
            {/* Content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
                  <Briefcase className="inline-block h-4 w-4 mr-1.5" />
                  Recruitment
                </span>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {hireTitle}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {hireText}
                </p>
                
                <button
                  onClick={() => router.push("/hire-from-medh")}
                  className={`inline-flex items-center px-6 py-3 ${hireBtnClass} rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  style={!isPrimaryHireBtn ? { backgroundColor: hireButtonColor, color: hireButtonTextColor } : {}}
                  aria-label="Hire professionals from Medh"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  <span>{hireButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className={`relative overflow-hidden ${trainingBgClass}`}
        style={!isPrimaryTrainingBg ? { backgroundColor: trainingBackgroundColor } : {}}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center">
            {/* Content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                  <Users className="inline-block h-4 w-4 mr-1.5" />
                  Staff Development
                </span>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: trainingTextColor }}>
                  {trainingTitle}
                </h2>
                
                <p className="text-lg leading-relaxed mb-8 opacity-90" style={{ color: trainingTextColor }}>
                  {trainingText}
                </p>
                
                <button
                  onClick={() => router.push("/corporate-training-courses")}
                  className="inline-flex items-center px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: trainingButtonColor, 
                    color: trainingButtonTextColor,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label="Learn more about corporate training courses"
                >
                  {trainingButtonTextColor === "black" ? (
                    <PlusCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <PlusCircle className="mr-2 h-5 w-5" />
                  )}
                  <span>{trainingButtonText}</span>
                </button>
              </div>
            </div>
            
            {/* Image container with animated effect */}
            {trainingImage && (
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-mr-6"></div>
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl">
                  <Image
                    src={trainingImage}
                    width={720}
                    height={450}
                    alt={trainingTitle}
                    className="w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
