"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Educator from "@/assets/images/hire/Educator.png";
import Partner from "@/assets/images/hire/Partner.png";
import EducationBg from "@/assets/images/about/joinSvg.png";
import SchoolBg from "@/assets/images/about/Image.svg";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowRight } from "lucide-react";

// AddIcon component
const AddIcon = ({ fill = "white" }) => {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5498 7.32227H11.4502V11.4971H7.2998V13.5723H11.4502V17.7471H13.5498V13.5723H17.7002V11.4971H13.5498V7.32227ZM12.5 2.12207C11.0677 2.12207 9.7168 2.39062 8.44727 2.92773C7.17773 3.48112 6.07096 4.22982 5.12695 5.17383C4.18294 6.11784 3.44238 7.21647 2.90527 8.46973C2.35189 9.73926 2.0752 11.0902 2.0752 12.5225C2.0752 13.9548 2.35189 15.3057 2.90527 16.5752C3.44238 17.8447 4.18294 18.9515 5.12695 19.8955C6.07096 20.8395 7.17773 21.5801 8.44727 22.1172C9.7168 22.6706 11.0677 22.9473 12.5 22.9473C13.9323 22.9473 15.2832 22.6706 16.5527 22.1172C17.8223 21.5801 18.929 20.8395 19.873 19.8955C20.8171 18.9515 21.5576 17.8447 22.0947 16.5752C22.6481 15.3057 22.9248 13.9548 22.9248 12.5225C22.9248 11.0902 22.6481 9.73926 22.0947 8.46973C21.5576 7.21647 20.8171 6.11784 19.873 5.17383C18.929 4.22982 17.8223 3.48112 16.5527 2.92773C15.2832 2.39062 13.9323 2.12207 12.5 2.12207ZM12.5 20.8721C11.3444 20.8721 10.262 20.6523 9.25293 20.2129C8.24381 19.7734 7.36084 19.1753 6.604 18.4185C5.84717 17.6616 5.25716 16.7786 4.83398 15.7695C4.39453 14.7604 4.1748 13.6781 4.1748 12.5225C4.1748 11.3831 4.39453 10.3008 4.83398 9.27539C5.25716 8.26628 5.84717 7.38737 6.604 6.63867C7.36084 5.88997 8.24381 5.2959 9.25293 4.85645C10.262 4.41699 11.3444 4.19727 12.5 4.19727C13.6556 4.19727 14.738 4.41699 15.7471 4.85645C16.7562 5.2959 17.6392 5.88997 18.396 6.63867C19.1528 7.38737 19.7428 8.26628 20.166 9.27539C20.6055 10.3008 20.8252 11.3831 20.8252 12.5225C20.8252 13.6781 20.6055 14.7604 20.166 15.7695C19.7428 16.7786 19.1528 17.6616 18.396 18.4185C17.6392 19.1753 16.7562 19.7734 15.7471 20.2129C14.738 20.6523 13.6556 20.8721 12.5 20.8721Z"
        fill={fill}
      />
    </svg>
  );
};

// JoinMedh component with customizable content and styles
const JoinMedh = ({
  educatorImage = Educator,
  educatorTitle = "Join Medh as an Educator",
  educatorText = "Join Medh's pioneering learning community and contribute to shaping a transformative educational journey for learners worldwide.",
  educatorButtonText = "Get Started",
  educatorButtonColor = "#7ECA9D",
  partnerImage = Partner,
  partnerTitle = "Partner with Medh as a School / Institute",
  partnerText = "To implement customized skill development programs, empowering your students to excel in their chosen fields on a global scale.",
  partnerButtonText = "Let's Collaborate",
  partnerButtonColor = "white",
  partnerTextColor = "white",
  partnerBackgroundColor = "#F6B335",
  partnerBtnColor = "black",
  EducationBg,
  SchoolBg,
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Convert hex colors to CSS variables or use defaults
  const isPrimaryEducatorBtn = educatorButtonColor === "#7ECA9D";
  const educatorBtnClass = isPrimaryEducatorBtn 
    ? "bg-primary-500 hover:bg-primary-600 text-white" 
    : "";
  
  const isPrimaryPartnerBg = partnerBackgroundColor === "#F6B335";
  const partnerBgClass = isPrimaryPartnerBg 
    ? "bg-secondary-500 dark:bg-secondary-600" 
    : "";
  
  return (
    <div className={`flex flex-col gap-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Educator Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl">
        {/* Enhanced 3D decorative elements */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-conic from-primary-300/40 via-purple-300/30 to-pink-300/40 dark:from-primary-500/30 dark:via-purple-500/20 dark:to-pink-500/30 rounded-full blur-[6rem] opacity-70 transform translate-x-1/3 -translate-y-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-conic from-blue-300/40 via-teal-300/30 to-primary-300/40 dark:from-blue-500/30 dark:via-teal-500/20 dark:to-primary-500/30 rounded-full blur-[6rem] opacity-70 transform -translate-x-1/3 translate-y-1/4 animate-pulse-slow animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Enhanced image container with 3D effects */}
            <div className="w-full md:w-1/2 relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/40 to-purple-400/40 dark:from-primary-500/40 dark:to-purple-500/40 rounded-[2rem] transform rotate-6 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-ml-8 blur-xl"></div>
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl transform transition-all duration-500 group-hover:rotate-1 group-hover:scale-[1.02] will-change-transform">
                <Image
                  src={educatorImage}
                  width={720}
                  height={450}
                  alt={educatorTitle}
                  className="w-full object-cover transform transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Enhanced 3D overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            {/* Enhanced content container with 3D effects */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="max-w-lg space-y-8">
                <span className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/50 dark:to-purple-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full group-hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="mr-2 text-xl">🎓</span>
                  Become an Educator
                </span>
                
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  {educatorTitle}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg xl:text-xl leading-relaxed">
                  {educatorText}
                </p>
                
                <button
                  onClick={() => router.push("/join-us-as-educator")}
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <PlusCircle className="mr-3 h-5 w-5 transform transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-lg relative z-10">{educatorButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Partnership Section with enhanced 3D styling */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FF8C42] to-[#F6B335] dark:from-[#FF8C42] dark:to-[#F6B335] shadow-2xl">
        {/* Enhanced 3D decorative elements */}
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-conic from-white/30 via-white/20 to-transparent rounded-full blur-[6rem] opacity-60 transform -translate-x-1/3 -translate-y-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-conic from-white/30 via-white/20 to-transparent rounded-full blur-[6rem] opacity-60 transform translate-x-1/3 translate-y-1/4 animate-pulse-slow animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          <div className="flex flex-col-reverse md:flex-row items-center gap-16">
            {/* Enhanced content container with 3D effects */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="max-w-lg space-y-8">
                <span className="inline-flex items-center px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full group-hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="mr-2 text-xl">🤝</span>
                  Institutional Partnership
                </span>
                
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white">
                  {partnerTitle}
                </h2>
                
                <p className="text-white/90 text-lg xl:text-xl leading-relaxed">
                  {partnerText}
                </p>
                
                <button
                  onClick={() => router.push("/join-us-as-school-institute")}
                  className="group relative inline-flex items-center px-8 py-4 bg-white text-[#FF8C42] font-medium rounded-xl shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-white/25 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF8C42] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C42]/0 via-[#FF8C42]/10 to-[#FF8C42]/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <PlusCircle className="mr-3 h-5 w-5 transform transition-transform duration-300 group-hover:rotate-180" />
                  <span className="text-lg relative z-10">{partnerButtonText}</span>
                </button>
              </div>
            </div>
            
            {/* Enhanced image container with 3D effects */}
            <div className="w-full md:w-1/2 relative group perspective-1000">
              <div className="absolute inset-0 bg-white/30 rounded-[2rem] transform -rotate-6 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-mr-8 blur-xl"></div>
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl transform transition-all duration-500 group-hover:rotate-[-1deg] group-hover:scale-[1.02] will-change-transform">
                <Image
                  src={partnerImage}
                  width={720}
                  height={450}
                  alt={partnerTitle}
                  className="w-full object-cover transform transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Enhanced 3D overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C42]/20 to-[#F6B335]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
};

export default JoinMedh;
