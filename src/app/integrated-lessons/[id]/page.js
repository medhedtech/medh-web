"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Clock, 
  ChevronLeft, 
  Download, 
  Menu, 
  CheckCircle, 
  ChevronUp, 
  Play, 
  Loader 
} from "lucide-react";
import Link from "next/link";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import useCourseLesson from "@/hooks/useCourseLesson.hook";

// Import necessary components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import LessonAccordion from "@/components/shared/lessons/LessonAccordion";
import lessons from "@/../public/fakedata/lessons.json";

const IntegratedLesson = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  
  // State for the content tabs and mobile sidebar toggle
  const [activeTab, setActiveTab] = useState("content");
  const [contentOpen, setContentOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Use our custom hook for course and lesson data
  const {
    loading,
    error,
    courseData,
    lessonData,
    handleRetry,
    markLessonComplete,
    submitAssignment,
    submitQuiz,
    getLoading,
    postLoading
  } = useCourseLesson(id, id);
  
  // Handle marking lesson as complete
  const handleMarkComplete = async () => {
    try {
      setIsCompleting(true);
      await markLessonComplete({
        completion_time: new Date().toISOString(),
        notes: "Completed via web interface"
      });
      setIsCompleting(false);
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      setIsCompleting(false);
    }
  };
  
  // Handle assignment submission
  const handleAssignmentSubmit = async (formData) => {
    try {
      const result = await submitAssignment({
        email: formData.email,
        content: formData.content,
        files: formData.files
      });
      
      // Handle successful submission
      console.log("Assignment submitted successfully:", result);
      // You can add toast notification or other UI feedback here
      
    } catch (error) {
      console.error("Error submitting assignment:", error);
      // Handle error (show toast notification, etc.)
    }
  };
  
  // Handle quiz submission
  const handleQuizSubmit = async (quizData) => {
    try {
      const result = await submitQuiz({
        answers: quizData.answers,
        time_taken: quizData.timeTaken
      });
      
      // Handle successful submission
      console.log("Quiz submitted successfully:", result);
      // You can add toast notification or other UI feedback here
      
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  // Show error state
  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6">
              {error.type === "auth" ? (
                <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              ) : error.type === "server" ? (
                <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {error.message}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error.details}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {error.type !== "auth" && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Go Back
              </button>
              {error.type === "auth" && (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 transition-colors"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Show loading state
  if (loading || getLoading || postLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-3"
            >
              <Loader className="w-6 h-6 text-primaryColor" />
              <span className="text-gray-600 dark:text-gray-400">Loading lesson...</span>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
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
                    <LessonAccordion 
                      currentLessonId={id} 
                      courseId={courseData?._id} 
                      courseData={courseData}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 lg:rounded-lg overflow-hidden">
                {/* Top Navigation */}
                <div className="border-b border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap">
                    <button
                      onClick={() => setActiveTab("content")}
                      className={`px-6 py-3 text-sm font-medium relative ${
                        activeTab === "content"
                          ? "text-primaryColor"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Lesson Content</span>
                      </div>
                      {activeTab === "content" && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryColor"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("assignments")}
                      className={`px-6 py-3 text-sm font-medium relative ${
                        activeTab === "assignments"
                          ? "text-primaryColor"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Assignments</span>
                      </div>
                      {activeTab === "assignments" && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryColor"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("quizzes")}
                      className={`px-6 py-3 text-sm font-medium relative ${
                        activeTab === "quizzes"
                          ? "text-primaryColor"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Quizzes</span>
                      </div>
                      {activeTab === "quizzes" && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryColor"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Active Tab Content */}
                <div className="p-4 lg:p-6">
                  {/* Back to Course Link */}
                  <div className="mb-4">
                    <Link 
                      href="/integrated-lessons" 
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primaryColor transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Back to course</span>
                    </Link>
                  </div>
                  
                  {/* Lesson Title */}
                  <div className="mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {lessonData?.title || "Lesson Content"}
                    </h1>
                  </div>
                  
                  {/* Tab Content Container */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Lesson Content Tab */}
                      {activeTab === "content" && (
                        <div>
                          {/* Video Player */}
                          <div className="relative mb-6">
                            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                              {lessonData && (
                                <iframe
                                  src={lessonData.video_url || lessonData.content_url}
                                  allowFullScreen
                                  allow="autoplay"
                                  className="w-full h-full border-0"
                                  title={lessonData.title}
                                ></iframe>
                              )}
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{lessonData?.duration || "0:00"} • Lecture {id}</span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <motion.button
                                  onClick={handleMarkComplete}
                                  disabled={isCompleting || lessonData?.is_completed}
                                  whileTap={{ scale: 0.95 }}
                                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                                    lessonData?.is_completed
                                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                      : isCompleting
                                        ? "bg-primaryColor/80 text-white/80 cursor-wait"
                                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                                  }`}
                                >
                                  {lessonData?.is_completed ? (
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
                          </div>
                          
                          {/* Lesson Navigation */}
                          <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                              <Link 
                                href={`/integrated-lessons/${id > 1 ? id - 1 : 1}`}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ${id <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                <span>Previous</span>
                              </Link>
                            </motion.div>
                            
                            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                              <Link 
                                href={`/integrated-lessons/${id + 1}`}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                              >
                                <span>Next</span>
                                <Play className="w-4 h-4 ml-2" />
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      )}
                      
                      {/* Assignments Tab */}
                      {activeTab === "assignments" && (
                        <div>
                          <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Latest Assignments
                            </h2>
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                              <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase">
                                  <tr>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Assignment Name</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Total Marks</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Total Submissions</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {/* Replace with actual assignments from state */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Assignment Submission
                            </h2>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.target);
                              handleAssignmentSubmit({
                                email: formData.get('email'),
                                content: formData.get('content'),
                                files: formData.getAll('files')
                              });
                            }} className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                                  Email address
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  placeholder="name@example.com"
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor text-gray-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="content">
                                  Assignment Content
                                </label>
                                <textarea
                                  id="content"
                                  rows="4"
                                  placeholder="Write your assignment content here..."
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor text-gray-900 dark:text-white"
                                ></textarea>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="file">
                                  Upload Files
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    id="file"
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 border-dashed rounded-md text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primaryColor/10 file:text-primaryColor hover:file:bg-primaryColor/20 cursor-pointer"
                                  />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Upload files (max 10MB) - PDF, DOCX, or ZIP formats accepted
                                </p>
                              </div>
                              <div className="flex justify-end">
                                <motion.button
                                  type="submit"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="px-4 py-2 bg-primaryColor text-white font-medium rounded-md hover:bg-primaryColor/90 transition-colors"
                                >
                                  Submit Assignment
                                </motion.button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      
                      {/* Quizzes Tab */}
                      {activeTab === "quizzes" && (
                        <div>
                          <div className="space-y-8">
                            {/* Replace with actual quizzes from state */}
                          </div>
                          
                          <div className="mt-12">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Quiz Results
                            </h2>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                              <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                                  <tr>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Quiz</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Questions</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Total Marks</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Correct Answers</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Result</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {/* Replace with actual quiz results from state */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default IntegratedLesson;