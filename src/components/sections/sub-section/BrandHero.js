"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import bgImg1 from "@/assets/images/herobanner/bg1-img.jpeg";
import Link from "next/link";
import { Sparkles, Rocket, Target, Award } from 'lucide-react';

const BrandHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced feature cards data with modern icons and engaging descriptions
  const featureCards = [
    {
      id: 1,
      title: "Level Up with 50+ Epic Courses",
      description: "Jump into the future with AI, Cybersecurity, and more! Your adventure in tech mastery starts here. 🚀",
      linkText: "Start Your Journey",
      linkUrl: "/courses/",
      bgColor: "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700",
      icon: <Rocket className="w-8 h-8 text-white mb-4" />,
      hoverEffect: "hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25",
    },
    {
      id: 2,
      title: "Join the Medh Squad",
      description: "Level up your skills with exclusive access to premium content and epic learning adventures! 🌟",
      linkText: "Power Up",
      linkUrl: "/medh-membership",
      bgImage: bgImg,
      icon: <Sparkles className="w-8 h-8 text-white mb-4" />,
      hoverEffect: "hover:scale-105 hover:shadow-xl hover:shadow-secondary-500/25",
    },
    {
      id: 3,
      title: "Earn Epic Achievements",
      description: "Collect industry-recognized badges and certificates. Show off your awesome skills! 🏆",
      linkText: "View Achievements",
      linkUrl: "/about-us",
      bgColor: "bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700",
      icon: <Award className="w-8 h-8 text-white mb-4" />,
      hoverEffect: "hover:scale-105 hover:shadow-xl hover:shadow-secondary-500/25",
    },
    {
      id: 4,
      title: "100% Success Rate Quest",
      description: "Embark on a guaranteed path to victory with our job-ready quests! Your dream career awaits. 🎯",
      linkText: "Accept the Challenge",
      linkUrl: "/placement-guaranteed-courses",
      bgImage: bgImg1,
      icon: <Target className="w-8 h-8 text-white mb-4" />,
      hoverEffect: "hover:scale-105 hover:shadow-xl hover:shadow-primary-500/25",
    },
  ];

  return (
    <div className="overflow-hidden py-8">
      {/* Enhanced Feature Cards Grid with Modern Animation */}
      <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {featureCards.map((card, index) => (
            <div 
              key={card.id}
              className={`
                relative overflow-hidden group rounded-2xl
                ${card.bgColor || 'bg-gray-800'} 
                ${card.hoverEffect}
                transition-all duration-500 transform
                cursor-pointer
              `}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Enhanced Background Effects */}
              {card.bgImage ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={card.bgImage}
                    alt={`Background for ${card.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                    priority={card.id === 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/70 transition-colors duration-300"></div>
                </div>
              ) : (
                <div className="absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent)]"></div>
                </div>
              )}
              
              {/* Enhanced Card Content with Modern Layout */}
              <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col min-h-[320px]">
                {/* Icon with Animation */}
                <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                  {card.icon}
                </div>
                
                {/* Title with Modern Typography */}
                <h2 className="font-bold text-xl lg:text-2xl text-white mb-4 tracking-tight">
                  {card.title}
                </h2>
                
                {/* Description with Engaging Style */}
                <p className="mt-2 text-base text-white/90 flex-grow leading-relaxed">
                  {card.description}
                </p>
                
                {/* Enhanced Link Button */}
                <Link 
                  href={card.linkUrl}
                  className="mt-6 inline-flex items-center gap-2 text-white font-medium text-base group/link
                    relative overflow-hidden rounded-lg px-4 py-2 transition-all duration-300
                    before:absolute before:inset-0 before:bg-white/10 before:transform before:scale-x-0 before:transition-transform
                    hover:before:scale-x-100 before:origin-left"
                >
                  <span className="relative z-10">{card.linkText}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transform group-hover/link:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                {/* Enhanced Interactive Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-tr-full transform -translate-x-16 translate-y-16 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Welcome Section with Modern Design */}
      <section className={`transition-all duration-1000 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4 relative overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-extrabold text-transparent text-3xl lg:text-4xl bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-8">
              Welcome to the Future of Learning with Medh
            </h2>
            
            <div className="relative backdrop-blur-sm bg-white/5 dark:bg-gray-900/50 rounded-2xl p-8 shadow-xl">
              <p className="text-gray-700 dark:text-gray-300 text-lg lg:text-xl mb-8 leading-relaxed">
                Ready to level up? MEDH is your ultimate companion in the quest for knowledge! 
                We're not just another EdTech platform – we're your partners in unleashing your full potential. 
                From cool tech skills to awesome career moves, we've got your back! 🚀
              </p>
              
              <div className="inline-block relative">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 text-lg lg:text-xl">
                  Your Epic Journey to Success Starts Here!
                </span>
                <div className="absolute -z-10 bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full transform skew-x-2"></div>
              </div>
            </div>
            
            {/* Enhanced CTA Button */}
            <div className="mt-10">
              <Link 
                href="/about-us" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 
                  text-white font-medium rounded-xl transition-all duration-500
                  hover:from-primary-600 hover:to-secondary-600
                  transform hover:scale-105 hover:-translate-y-1
                  shadow-lg hover:shadow-xl hover:shadow-primary-500/25
                  relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Begin Your Adventure
                  <Rocket className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 15s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default BrandHero;
