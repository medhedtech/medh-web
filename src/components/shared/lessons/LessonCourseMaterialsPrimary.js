"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Bookmark, BookmarkCheck, Share2, FileText, Video, Users, Certificate, Clock, Calendar, Star, Globe, ChevronRight } from "lucide-react";

const LessonCourseMaterialsPrimary = ({ courseData }) => {
  // Mock course data for demonstration
  const course = courseData || {
    id: 1,
    title: "Complete Web Development Bootcamp",
    subtitle: "Learn HTML, CSS, JavaScript, React, Node.js and more to become a full-stack web developer",
    instructor: "Jane Smith",
    instructorAvatar: "/images/instructor-avatar.jpg",
    rating: 4.7,
    reviewCount: 4289,
    studentsCount: 12453,
    updatedDate: "November 2023",
    language: "English",
    level: "All Levels",
    duration: "36 hours",
    includes: [
      { icon: Video, text: "42 hours on-demand video" },
      { icon: FileText, text: "25 articles & resources" },
      { icon: Download, text: "52 downloadable resources" },
      { icon: Certificate, text: "Certificate of completion" },
      { icon: Globe, text: "Full lifetime access" },
      { icon: Users, text: "Access on mobile and TV" }
    ],
    description: `
      <p>This comprehensive Web Development course is designed to take you from beginner to professional web developer. Whether you have no prior experience or are looking to enhance your skills, this course covers everything you need to know to build modern, responsive websites and web applications.</p>
      <p>Starting with the foundations of HTML and CSS, you'll progressively advance to more complex concepts like JavaScript, React, Node.js, and database integration. By the end of this course, you'll have the skills to create full-stack web applications and have a portfolio of projects to showcase your abilities to potential employers.</p>
    `,
    whatYouWillLearn: [
      "Build responsive websites using HTML, CSS, and JavaScript",
      "Develop dynamic web applications with React.js",
      "Create server-side applications with Node.js and Express",
      "Work with databases like MongoDB and SQL",
      "Deploy your applications to the web using various hosting platforms",
      "Implement authentication and security best practices"
    ],
    sections: [
      { 
        title: "Introduction to Web Development", 
        lessons: 6,
        duration: "2 hours 15 minutes"
      },
      { 
        title: "HTML Fundamentals", 
        lessons: 8,
        duration: "3 hours 20 minutes"
      },
      { 
        title: "CSS Styling and Layout", 
        lessons: 12,
        duration: "5 hours 45 minutes"
      },
      { 
        title: "JavaScript Essentials", 
        lessons: 15,
        duration: "7 hours 30 minutes"
      },
      { 
        title: "React.js Frontend Development", 
        lessons: 14,
        duration: "8 hours 15 minutes"
      },
      { 
        title: "Node.js Backend Development", 
        lessons: 10,
        duration: "6 hours 40 minutes"
      },
      { 
        title: "Database Integration", 
        lessons: 8,
        duration: "4 hours 30 minutes"
      }
    ]
  };

  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {course.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              {course.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="flex items-center text-amber-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(course.rating)
                          ? "fill-current"
                          : "fill-none"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {course.rating}
                </span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {course.reviewCount.toLocaleString()} reviews
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.studentsCount.toLocaleString()} students</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Last updated {course.updatedDate}</span>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-full">
                <Image
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {course.instructor}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={toggleBookmark}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-primaryColor" />
                    <span>Bookmarked</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Bookmark</span>
                  </>
                )}
              </button>
              
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-700">
              <Image
                src="/images/course-thumbnail.jpg"
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all duration-200 transform hover:scale-105">
                  <Video className="w-6 h-6 text-primaryColor" />
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Course Info</p>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{course.level}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{course.language}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">This course includes:</h3>
                <ul className="space-y-2.5">
                  {course.includes.map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <item.icon className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href={`/course/${course.id}/enroll`}
                className="w-full block py-3 px-4 bg-primaryColor hover:bg-primaryColorDark text-white font-medium text-sm rounded-md text-center transition-colors duration-200"
              >
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {['Overview', 'Curriculum', 'Reviews', 'Resources'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors focus:outline-none ${
                  selected
                    ? 'border-primaryColor text-primaryColor'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels>
          {/* Overview Tab */}
          <Tab.Panel>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Course</h2>
                  <div 
                    className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </section>
                
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What You Will Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              
              <div>
                <section className="sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.sections.length} sections
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {course.sections.reduce((acc, section) => acc + section.lessons, 0)} lessons
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.duration} total
                        </p>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      {course.sections.map((section, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {index + 1}. {section.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {section.lessons} lessons • {section.duration}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-750">
                      <Link
                        href={`/course/${course.id}/curriculum`}
                        className="w-full block py-2 px-4 text-sm text-center font-medium text-primaryColor hover:text-primaryColorDark transition-colors duration-200"
                      >
                        View Full Curriculum
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </Tab.Panel>

          {/* Curriculum Tab */}
          <Tab.Panel>
            <p className="text-gray-500 dark:text-gray-400 italic">Course curriculum content would go here</p>
          </Tab.Panel>
          
          {/* Reviews Tab */}
          <Tab.Panel>
            <p className="text-gray-500 dark:text-gray-400 italic">Course reviews content would go here</p>
          </Tab.Panel>
          
          {/* Resources Tab */}
          <Tab.Panel>
            <p className="text-gray-500 dark:text-gray-400 italic">Course resources content would go here</p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LessonCourseMaterialsPrimary; 