"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import hire from "@/assets/images/hire/Hire.png";
import Traning from "@/assets/images/hire/Traning.png";
import { useRouter } from "next/navigation";
import { PlusCircle, Users, Briefcase } from "lucide-react";

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
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Hire Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-purple-400/20 dark:from-primary-500/20 dark:to-purple-500/20 opacity-50"></div>
        
        {/* Mobile: Image on top, content below */}
        <div className="flex flex-col h-full">
          <div className="relative h-48 md:h-64 overflow-hidden">
            <Image
              src={hireImage}
              fill
              style={{ objectFit: 'cover' }}
              alt={hireTitle}
              className="transform transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow">
            <span className="inline-flex items-center px-4 py-1.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
              <Briefcase className="mr-2 h-4 w-4" />
              Recruitment
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {hireTitle}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base flex-grow">
              {hireText}
            </p>

            <button
              onClick={() => router.push("/hire-from-medh")}
              className="group w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              <span>{hireButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Training Card */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-primary-500 to-primary-600">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

        {/* Mobile: Image on top, content below */}
        <div className="flex flex-col h-full">
          <div className="relative h-48 md:h-64 overflow-hidden">
            <Image
              src={trainingImage}
              fill
              style={{ objectFit: 'cover' }}
              alt={trainingTitle}
              className="transform transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              <Users className="mr-2 h-4 w-4" />
              Staff Development
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {trainingTitle}
            </h2>

            <p className="text-white/90 text-sm md:text-base flex-grow">
              {trainingText}
            </p>

            <button
              onClick={() => router.push("/corporate-training-courses")}
              className="group w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              <span>{trainingButtonText}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Hire;
