"use client";
import React, { useState, useEffect } from "react";
// import lessons from "@/../public/fakedata/lessons.json";
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";
import { ChevronUp, Play, Download, Clock, CheckCircle, ChevronLeft, Menu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const LessonPrimary = ({ id: lessonId }) => {
  const [contentOpen, setContentOpen] = useState(false); // Start closed on mobile
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Find the current lesson from the lessons data
  useEffect(() => {
    const lesson = lessons?.find(({ id }) => lessonId === id) || {
      id: 1,
      title: "Welcome!",
      link: "https://www.youtube.com/embed/vHdclsdkp28",
      duration: "3:27",
      completionStatus: "incomplete"
    };
    setCurrentLesson(lesson);
  }, [lessonId]);

  const markAsComplete = () => {
    setIsCompleting(true);
    // This would typically call an API to mark the lesson as complete
    setTimeout(() => {
      setCurrentLesson({
        ...currentLesson,
        completionStatus: "complete"
      });
      setIsCompleting(false);
    }, 600);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto py-0 lg:py-6 px-0 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button 
              onClick={() => setContentOpen(!contentOpen)}
              className="p-4 bg-primaryColor text-white rounded-full shadow-lg flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          {/* Course Content Sidebar */}
          <div className={`fixed inset-0 lg:static lg:col-span-3 z-40 lg:z-auto ${contentOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="h-full lg:h-auto overflow-auto bg-white dark:bg-gray-800 lg:rounded-lg shadow-sm">
              {/* Overlay for mobile */}
              <div 
                className="fixed inset-0 bg-black/50 lg:hidden" 
                onClick={() => setContentOpen(false)}
              ></div>
              
              <div className="relative z-10 h-full lg:h-auto flex flex-col">
                {/* Course Content Header */}
                <div className="border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center px-4 py-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Course content</h2>
                    <button 
                      onClick={() => setContentOpen(!contentOpen)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
                    >
                      <ChevronUp className="w-5 h-5 transform rotate-180" />
                    </button>
                  </div>
                </div>
                
                {/* Course Content Body */}
                <div className="flex-1 overflow-auto">
                  <LessonAccordion currentLessonId={parseInt(lessonId)} courseId="1" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 lg:rounded-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative">
                <div className="aspect-video w-full">
                  {currentLesson && (
                    <iframe
                      src={currentLesson.link}
                      allowFullScreen
                      allow="autoplay"
                      className="w-full h-full border-0"
                      title={currentLesson.title}
                    ></iframe>
                  )}
                </div>
              </div>
              
              {/* Video Info and Controls */}
              <div className="p-4 lg:p-6">
                {/* Back to Course Link */}
                <div className="mb-4">
                  <Link 
                    href="/lesson-course-materials" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primaryColor transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span>Back to course</span>
                  </Link>
                </div>
                
                {/* Lesson Title and Controls */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentLesson?.title || "Lesson Video"}
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{currentLesson?.duration || "0:00"} • Lecture {lessonId}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={markAsComplete}
                      disabled={isCompleting || currentLesson?.completionStatus === "complete"}
                      whileTap={{ scale: 0.95 }}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                        currentLesson?.completionStatus === "complete"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : isCompleting
                            ? "bg-primaryColor/80 text-white/80 cursor-wait"
                            : "bg-primaryColor text-white hover:bg-primaryColor/90"
                      }`}
                    >
                      {currentLesson?.completionStatus === "complete" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span>Completed</span>
                        </>
                      ) : isCompleting ? (
                        <span>Marking...</span>
                      ) : (
                        <span>Mark complete</span>
                      )}
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span>Resources</span>
                    </motion.button>
                  </div>
                </div>
                
                {/* Lesson Navigation */}
                <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href={`/lessons/${parseInt(lessonId) > 1 ? parseInt(lessonId) - 1 : 1}`}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ${parseInt(lessonId) <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      <span>Previous</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href={`/lessons/${parseInt(lessonId) + 1}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>Next</span>
                      <Play className="w-4 h-4 ml-2" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonPrimary;
