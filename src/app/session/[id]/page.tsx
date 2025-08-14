"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaPlus,
  FaMicrochip,
  FaCog,
  FaPython,
  FaUser,
  FaGraduationCap,
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

export default function VideoSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState<number | string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        console.log("Loading session with ID:", sessionId);
        const response = await liveClassesAPI.getSession(sessionId);
        console.log("Session API response:", response);
        
        if (response && response.data) {
          console.log("Setting session data:", response.data);
          console.log("Students data:", response.data.students);
          console.log("Instructor data:", response.data.instructorId);
          console.log("Grades data:", response.data.grades);
          setSession(response.data);
        } else {
          console.error("No data in response:", response);
          setSession(null);
        }
      } catch (error) {
        console.error("Error loading session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSummary = (index: number | string) => {
    setExpandedSummary(expandedSummary === index ? null : index);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Session not found</div>
      </div>
    );
  }

  // Debug information
  console.log('Session data in render:', {
    students: session.students,
    instructorId: session.instructorId,
    grades: session.grades,
    sessionTitle: session.sessionTitle,
    sessionNo: session.sessionNo
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800'
    }`}>
              <div className="flex min-h-screen">
          {/* Left Side - Video Player */}
          <div className={`flex-1 relative transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
              <button 
                onClick={() => window.close()}
                className={`${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                } p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                title="Close session"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Debug Info - Temporary */}
            <div className="absolute top-6 left-20 z-50">
              <div className={`${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 border-gray-600' 
                  : 'bg-white text-gray-700 border-gray-200'
              } p-2 rounded border text-xs max-w-xs`}>
                <div>Students: {JSON.stringify(session.students)}</div>
                <div>Instructor: {JSON.stringify(session.instructorId)}</div>
                <div>Grades: {JSON.stringify(session.grades)}</div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <div className="absolute top-6 right-6 z-50">
              <button 
                onClick={toggleTheme}
                className={`${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                } p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 p-8 pt-20 flex flex-col">
                            {/* Header */}
              <div className="flex justify-between items-start mb-8">
                {/* Session Info */}
                <div className="flex-1 mr-8 min-w-0">
                  <h1 className={`text-2xl md:text-3xl font-bold mb-2 break-words ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {session.sessionTitle || "Live Learning Session"}
                  </h1>
                  <div className={`flex flex-wrap items-center gap-2 md:gap-4 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className={`${
                      isDarkMode 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-blue-100 text-blue-700'
                    } px-3 py-1 rounded-full font-medium whitespace-nowrap`}>
                      Session #{session.sessionNo}
                    </span>
                  </div>
                </div>

                {/* MEDH Logo */}
                <div className="text-center flex-shrink-0">
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MEDH
                  </div>
                  <div className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    - LEARN. UPSKILL. ELEVATE. -
                  </div>
                </div>
              </div>

            {/* Video Player Area */}
            <div className="flex items-center justify-center py-12">
              <div className="relative w-full max-w-5xl">
                {/* Video Container */}
                <div className={`relative aspect-video rounded-3xl border-2 overflow-hidden shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200'
                }`}>
                  {/* Video Background */}
                  <div className={`absolute inset-0 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
                      : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
                  }`}></div>

                  {/* Play Button */}
                  <button
                    onClick={handlePlayPause}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-blue-100"
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <FaPause className="text-blue-600 text-3xl" />
                    ) : (
                      <FaPlay className="text-blue-600 text-3xl ml-2" />
                    )}
                  </button>

                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent"></div>
                </div>

                {/* Session Description */}
               
              </div>
            </div>

                         {/* Bottom Info */}
             <div className={`mt-8 pt-6 border-t ${
               isDarkMode ? 'border-gray-700' : 'border-gray-200'
             }`}>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {/* Student Name */}
                 <div className="text-center">
                   <div className={`text-sm mb-1 ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>Student</div>
                   <div className={`font-semibold ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {Array.isArray(session.students) && session.students.length > 0 
                       ? session.students[0]?.full_name || session.students[0]?.name || 'N/A'
                       : 'N/A'}
                   </div>
                 </div>

                 {/* Grade */}
                 <div className="text-center">
                   <div className={`text-sm mb-1 ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>Grade</div>
                   <div className={`font-semibold ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {Array.isArray(session.grades) && session.grades.length > 0 
                       ? session.grades[0]?.name || session.grades[0] || 'N/A'
                       : 'N/A'}
                   </div>
                 </div>

                 {/* Instructor */}
                 <div className="text-center">
                   <div className={`text-sm mb-1 ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>Instructor</div>
                   <div className={`font-semibold ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {typeof session.instructorId === 'object' && session.instructorId?.full_name 
                       ? session.instructorId.full_name 
                       : session.instructorId?.name || 'N/A'}
                   </div>
                 </div>

                 {/* Date */}
                 <div className="text-center">
                   <div className={`text-sm mb-1 ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>Date</div>
                   <div className={`font-semibold ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {formatDate(session.video?.date || session.date || new Date())}
                   </div>
                 </div>

                 {/* Remarks */}
                 <div className="text-center">
                   <div className={`text-sm mb-1 ${
                     isDarkMode ? 'text-gray-400' : 'text-gray-500'
                   }`}>Remarks</div>
                   <div className={`font-semibold text-sm ${
                     isDarkMode ? 'text-white' : 'text-gray-900'
                   }`}>
                     {session.summary?.description || 'Excellent progress'}
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

                  {/* Right Side - Session Summary */}
          <div className={`w-96 overflow-y-auto shadow-xl transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-900 border-l border-gray-700' 
              : 'bg-white border-l border-gray-200'
          }`}>
          <div className="p-6">
            {/* Session Summary */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaComments className="w-6 h-6 text-blue-600" />
                Session Summary
              </h3>

              {/* Summary Items */}
              <div className="space-y-3">
                {/* Summary Title */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
                  <button
                    onClick={() => toggleSummary('title')}
                    className="w-full p-4 flex justify-between items-center text-left hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaComments className="text-blue-600 w-4 h-4" />
                      <span className="text-gray-900 font-semibold text-lg">
                        {session.summary?.title || "Session Overview"}
                      </span>
                    </div>
                    <FaPlus
                      className={`w-4 h-4 text-blue-600 transition-transform ${
                        expandedSummary === 'title' ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  {expandedSummary === 'title' && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-700">
                        {session.summary?.description || "No description available"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary Topics */}
                {session.summary && session.summary.items && Array.isArray(session.summary.items) && 
                  session.summary.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-300 transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSummary(index)}
                        className="w-full p-4 flex justify-between items-center text-left hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FaComments className="text-purple-600 w-4 h-4" />
                          <span className="text-gray-900 font-semibold text-lg">
                            {item.title || `Topic ${index + 1}`}
                          </span>
                        </div>
                        <FaPlus
                          className={`w-4 h-4 text-purple-600 transition-transform ${
                            expandedSummary === index ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                      {expandedSummary === index && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-700">
                            {item.description || "No description available"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>



            {/* No Summary Available */}
            {(!session.summary ||
              !session.summary.items ||
              !Array.isArray(session.summary.items) ||
              session.summary.items.length === 0) && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 text-center">
                <FaComments className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No summary details available
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Summary information will appear here when available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
