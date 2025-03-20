"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronUp, 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  BookOpen, 
  Download,
  Loader 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

const LessonAccordion = ({ courseId, currentLessonId, courseData }) => {
  const [openSections, setOpenSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const { getQuery } = useGetQuery();
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
  };
  
  useEffect(() => {
    const fetchCourseSections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError({
            message: "Authentication Required",
            type: "auth",
            details: "Please log in to view course content"
          });
          setLoading(false);
          return;
        }
        
        const headers = {
          'x-access-token': token,
          'Content-Type': 'application/json'
        };
        
        await getQuery({
          url: apiUrls.courses.detail(courseId),
          headers,
          onSuccess: (response) => {
            if (response?.success && response?.course) {
              // Transform course sections data
              const transformedSections = response.course.sections.map(section => ({
                id: section._id,
                title: section.title,
                itemCount: section.lessons.length,
                duration: section.duration || "0min",
                content: section.lessons.map(lesson => ({
                  id: lesson._id,
                  type: lesson.type || "video",
                  title: lesson.title,
                  duration: lesson.duration || "0min",
                  completed: lesson.is_completed || false,
                  hasResources: lesson.resources && lesson.resources.length > 0
                }))
              }));
              
              setSections(transformedSections);
              // Open the section containing the current lesson
              const currentSection = transformedSections.find(section => 
                section.content.some(lesson => lesson.id === currentLessonId)
              );
              if (currentSection) {
                setOpenSections([currentSection.id]);
              }
            } else {
              setError({
                message: "Failed to load course content",
                type: "api_error",
                details: "The course data is invalid or incomplete"
              });
            }
            setLoading(false);
          },
          onError: (error) => {
            console.error("Error fetching course sections:", error);
            let errorMessage = {
              message: "Failed to load course content",
              type: "unknown",
              details: error?.message || "Please try again later"
            };

            if (error?.response?.status === 401) {
              errorMessage = {
                message: "Session Expired",
                type: "auth",
                details: "Please log in again to continue"
              };
            } else if (error?.response?.status === 404) {
              errorMessage = {
                message: "Course Not Found",
                type: "not_found",
                details: "The requested course content could not be found"
              };
            } else if (error?.response?.status >= 500) {
              errorMessage = {
                message: "Server Error",
                type: "server",
                details: "Our servers are experiencing issues. Please try again later"
              };
            }

            setError(errorMessage);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error in fetchCourseSections:", error);
        setError({
          message: "An unexpected error occurred",
          type: "unknown",
          details: "There was a problem loading the course content"
        });
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseSections();
    }
  }, [courseId, currentLessonId, retryCount]);
  
  const toggleSection = (sectionId) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3"
        >
          <Loader className="w-6 h-6 text-primaryColor" />
          <span className="text-gray-600 dark:text-gray-400">Loading course content...</span>
        </motion.div>
                  </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="mb-4">
            {error.type === "auth" ? (
              <div className="w-12 h-12 mx-auto mb-3 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V7a4 4 0 00-8 0v4h8z" />
                </svg>
                  </div>
            ) : error.type === "server" ? (
              <div className="w-12 h-12 mx-auto mb-3 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  </div>
            ) : (
              <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  </div>
            )}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {error.message}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error.details}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {error.type !== "auth" && (
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 text-sm bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
              >
                Try Again
            </button>
            )}
            {error.type === "auth" && (
                      <Link
                href="/login"
                className="w-full px-4 py-2 text-sm bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                      >
                Log In
                      </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="group">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-3 h-3 mr-1" />
                    <span>{section.itemCount} lessons</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{section.duration}</span>
                  </div>
                  </div>
                  </div>
              
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-primaryColor h-1 rounded-full"
                    style={{ width: `${getSectionProgress(section)}%` }}
                  ></div>
                  </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {getSectionProgress(section)}%
                </span>
                  </div>
            </div>
            
            <ChevronUp
              className={`w-5 h-5 text-gray-400 transition-transform ${
                openSections.includes(section.id) ? "rotate-180" : ""
              }`}
            />
          </button>
          
          <AnimatePresence>
            {openSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {section.content.map((item) => {
                    const isActive = currentLessonId && item.id === currentLessonId;
                    
                    return (
                      <Link
                        key={item.id}
                        href={`/integrated-lessons/${item.id}`}
                        className={`flex items-start group/item p-2 rounded-lg ${
                          isActive
                            ? "bg-primaryColor/10 dark:bg-primaryColor/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {item.completed ? (
                            <div className="w-4 h-4 rounded-full bg-primaryColor flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className={`w-4 h-4 rounded-full border ${
                              isActive ? 'border-primaryColor' : 'border-gray-300 dark:border-gray-500'
                            } flex items-center justify-center`}>
                              {item.type === 'video' ? (
                                <Play className={`w-2.5 h-2.5 ${
                                  isActive ? 'text-primaryColor' : 'text-gray-400'
                                }`} />
                              ) : (
                                <FileText className={`w-2.5 h-2.5 ${
                                  isActive ? 'text-primaryColor' : 'text-gray-400'
                                }`} />
                              )}
                  </div>
                          )}
                  </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            isActive
                              ? "text-primaryColor"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {item.title}
                          </p>
                          
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.duration}
                            </span>
                            {item.hasResources && (
                              <>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Download className="w-3 h-3 mr-1" />
                                  Resources
                                </span>
                              </>
                            )}
                  </div>
                  </div>
                      </Link>
                    );
                  })}
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default LessonAccordion;
