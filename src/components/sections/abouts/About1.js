"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import aidata from "@/assets/images/about/ai-data-science.png";
import digital from "@/assets/images/about/digital-marketing.png";
import personality from "@/assets/images/about/personality-development.png";
import vedic from "@/assets/images/about/vedic-mathematics.png";

const About1 = () => {
  // Static data for courses
  const courses = [
    {
      _id: "1",
      course_title: "Artificial Intelligence and Data Science",
      course_image: aidata,
      path: "/ai-and-data-science-course",
      description: "Master AI concepts, machine learning algorithms, and data analysis techniques.",
      features: ["Live Sessions", "Industry Projects", "Expert Mentors"]
    },
    {
      _id: "2",
      course_title: "Digital Marketing with Data Analytics",
      course_image: digital,
      path: "/digital-marketing-with-data-analytics-course",
      description: "Learn modern marketing strategies enhanced with data-driven decision making.",
      features: ["SEO Mastery", "Analytics Tools", "Campaign Strategy"]
    },
    {
      _id: "3",
      course_title: "Personality Development",
      course_image: personality,
      path: "/personality-development-course",
      description: "Build confidence, communication skills, and professional presence.",
      features: ["Public Speaking", "Leadership Skills", "Personal Branding"]
    },
    {
      _id: "4",
      course_title: "Vedic Mathematics",
      course_image: vedic,
      path: "/vedic-mathematics-course",
      description: "Discover ancient calculation techniques for fast and accurate problem-solving.",
      features: ["Quick Calculation", "Mental Math", "Logical Reasoning"]
    },
  ];

  // Track hover state for each card
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary-100 dark:bg-secondary-900/20 blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            Skill Development
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Featured <span className="text-primary-500 dark:text-primary-400">LIVE</span> Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Medh's expertly crafted skill development courses empower you to
            excel in life. Master industry-relevant skills and conquer modern
            challenges. Embrace the future - Invest in your skills now.
          </p>
        </div>

        {/* Course Cards - Fixed height grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div 
              key={course._id}
              className="group relative h-[450px]" // Fixed height for container
              onMouseEnter={() => setHoveredCard(course._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link href={course.path} className="block h-full">
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col relative z-10 border border-gray-200 dark:border-gray-700"
                >
                  {/* Course Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={course.course_image}
                      alt={course.course_title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className={`object-cover transition-transform duration-700 ${
                        hoveredCard === course._id ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Course features appearing on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {course.features.map((feature, i) => (
                          <span 
                            key={i} 
                            className="inline-block px-2 py-1 bg-primary-500/80 text-white text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Content - Fixed height layout */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="h-[170px]"> {/* Fixed content area height */}
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 h-[3.5rem]">
                        {course.course_title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-4 h-[5rem]">
                        {course.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:underline">
                        Learn More
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Decorative accent for each card */}
              <div 
                className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full transition-all duration-500 ${
                  index % 4 === 0 ? 'bg-primary-500/10' : 
                  index % 4 === 1 ? 'bg-secondary-500/10' : 
                  index % 4 === 2 ? 'bg-accent-purple/10' : 
                  'bg-accent-teal/10'
                } ${hoveredCard === course._id ? 'scale-125' : 'scale-100'}`}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Action button */}
        <div className="mt-12 text-center">
          <Link 
            href="/courses/" 
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            View All Courses
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About1;
