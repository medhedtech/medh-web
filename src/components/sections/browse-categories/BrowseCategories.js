"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import personalityIcon from "@/assets/images/courses/Personal.png";
import aiIcon from "@/assets/images/courses/ai.png";
import vedicIcon from "@/assets/images/courses/Maths.png";
import { ChevronRight, BookOpen, Award, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const BrowseCategories = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add entrance animation effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Features data
  const features = [
    {
      id: 1,
      title: "Industry-Relevant Skills",
      description: "Designed in collaboration with industry experts, ensuring that students acquire practical, up-to-date skills for their desired career paths.",
      icon: <BookOpen className="text-primary-500 dark:text-primary-400" size={24} />
    },
    {
      id: 2,
      title: "Industry-Recognized Certifications",
      description: "Offer industry-recognized certifications upon completion, adding credibility to the student's skillset and enhancing their professional profile.",
      icon: <Award className="text-primary-500 dark:text-primary-400" size={24} />
    },
    {
      id: 3,
      title: "Networking Opportunities",
      description: "Provide opportunities to connect with industry professionals, mentors, and fellow learners, fostering valuable collaboration.",
      icon: <Users className="text-secondary-500 dark:text-secondary-400" size={24} />
    },
  ];

  // Categories data
  const categories = [
    {
      id: 1,
      title: "Personality Development",
      image: personalityIcon,
      href: "/personality-development-course",
      color: "from-primary-400 to-primary-600"
    },
    {
      id: 2,
      title: "AI and Data Science",
      image: aiIcon,
      href: "/ai-and-data-science-course",
      color: "from-primary-500 to-primary-700"
    },
    {
      id: 3,
      title: "Vedic Mathematics",
      image: vedicIcon,
      href: "/vedic-mathematics-course",
      color: "from-primary-600 to-primary-800"
    }
  ];

  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Browse Trending Categories Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-2">
              Course Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Browse Trending Categories
            </h2>
          </div>
          
          <button
            onClick={() => router.push("/courses/")}
            className="inline-flex items-center px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            aria-label="View all courses"
          >
            <span>View All</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {categories.map((category) => (
            <Link 
              href={category.href} 
              key={category.id}
              className="group block"
            >
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 dark:bg-primary-500/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full transform -translate-x-16 translate-y-16 group-hover:-translate-x-8 group-hover:translate-y-8 transition-transform duration-500"></div>
                
                {/* Card content */}
                <div className="relative z-10 flex flex-col items-center p-8">
                  <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-2xl transform rotate-6 transition-transform duration-300 group-hover:rotate-12"></div>
                    <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
                      <Image
                        src={category.image}
                        alt={category.title}
                        className="object-contain drop-shadow-xl"
                        fill
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white p-5 rounded-xl flex items-center justify-between transform transition-all duration-300 group-hover:from-primary-600 group-hover:to-primary-700 group-hover:scale-105 shadow-lg group-hover:shadow-xl">
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0 transform">
                        Explore
                      </span>
                      <ArrowRight className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Immersive Learning Section */}
        <div className="relative py-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-secondary-100 dark:bg-secondary-900/20 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-2">
              Make Connections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Immersive Learning: Your Tailored Pathway to Excellence
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
              Offers engaging, interactive experiences, fostering deep understanding, critical thinking, 
              and skill development in diverse educational settings.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 blur transition-opacity p-0.5 -z-10"></div>
                
                {/* Card content */}
                <div className="flex flex-col h-full">
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl inline-flex items-center justify-center w-14 h-14 mb-4">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
                    {feature.description}
                  </p>
                  
                  <Link href="#" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;
