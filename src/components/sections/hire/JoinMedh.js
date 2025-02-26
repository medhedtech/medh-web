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
    <div className={`flex flex-col gap-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Educator Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 transform -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            {/* Image container with animated effect */}
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-3xl transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-ml-6"></div>
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl">
                <Image
                  src={educatorImage}
                  width={720}
                  height={450}
                  alt={educatorTitle}
                  className="w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            {/* Content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
                  Become an Educator
                </span>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {educatorTitle}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {educatorText}
                </p>
                
                <button
                  onClick={() => router.push("/join-us-as-educator")}
                  className={`inline-flex items-center px-6 py-3 ${educatorBtnClass} rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  style={!isPrimaryEducatorBtn ? { backgroundColor: educatorButtonColor, color: 'white' } : {}}
                  aria-label={`${educatorButtonText} as an educator`}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  <span>{educatorButtonText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Partnership Section */}
      <section className={`relative overflow-hidden ${partnerBgClass}`}
        style={!isPrimaryPartnerBg ? { backgroundColor: partnerBackgroundColor } : {}}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl opacity-50 transform translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center">
            {/* Content container */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
              <div className="max-w-lg">
                <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                  Institutional Partnership
                </span>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: partnerTextColor }}>
                  {partnerTitle}
                </h2>
                
                <p className="text-lg leading-relaxed mb-8 opacity-90" style={{ color: partnerTextColor }}>
                  {partnerText}
                </p>
                
                <button
                  onClick={() => router.push("/join-us-as-school-institute")}
                  className="inline-flex items-center px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: partnerButtonColor, 
                    color: partnerBtnColor,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label={`${partnerButtonText} as a school or institute`}
                >
                  {partnerButtonColor === "white" ? (
                    <PlusCircle className="mr-2 h-5 w-5" style={{ color: partnerBtnColor }} />
                  ) : (
                    <PlusCircle className="mr-2 h-5 w-5" style={{ color: 'white' }} />
                  )}
                  <span>{partnerButtonText}</span>
                </button>
              </div>
            </div>
            
            {/* Image container with animated effect */}
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-3 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-500 md:-mr-6"></div>
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl">
                <Image
                  src={partnerImage}
                  width={720}
                  height={450}
                  alt={partnerTitle}
                  className="w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinMedh;
