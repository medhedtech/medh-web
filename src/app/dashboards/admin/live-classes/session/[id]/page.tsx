"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FaExpand,
  FaCompress
} from "react-icons/fa";
import { liveClassesAPI } from "@/apis/liveClassesAPI";
import { motion } from "framer-motion";

interface ISession {
  _id: string;
  sessionTitle: string;
  sessionNo: string;
  students: Array<{ _id: string; full_name: string; email: string }>;
  grades: Array<{ _id: string; name: string }>;
  instructorId: { _id: string; full_name: string; email: string };
  video: {
    fileId: string;
    name: string;
    size: number;
    url?: string;
  };
  date: string;
  remarks?: string;
  summary?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export default function VideoSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [session, setSession] = useState<ISession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const response = await liveClassesAPI.getSession(sessionId);
        console.log('Session data:', response);
        
        // Handle the API client response structure
        // API client wraps backend response in { status: 'success', data: backendResponse }
        // Backend returns { status: 'success', data: sessionData }
        // So we need to access response.data.data
        let sessionData = null;
        if (response && response.status === 'success') {
          if (response.data && response.data.data) {
            // API client wrapped response: { status: 'success', data: { status: 'success', data: sessionData } }
            sessionData = response.data.data;
          } else if (response.data) {
            // Direct backend response: { status: 'success', data: sessionData }
            sessionData = response.data;
          }
        } else if (response && response.data) {
          // Fallback for direct response
          sessionData = response.data;
        } else if (response) {
          // Last fallback
          sessionData = response;
        }
        
        console.log('Extracted session data:', sessionData);
        
        // Debug: Check if summary and remarks are present
        if (sessionData) {
          console.log('Session data structure:', {
            hasRemarks: !!(sessionData.remarks),
            hasSummary: !!(sessionData.summary),
            remarks: sessionData.remarks,
            summary: sessionData.summary,
            videoUrl: sessionData.video?.url
          });
        }
        
        setSession(sessionData);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSummary = (index: number) => {
    setExpandedSummary(expandedSummary === index ? null : index);
  };

  const handleVideoDoubleClick = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.close()}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close session"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-green-400 font-semibold text-lg">
            {session.sessionTitle || 'Live Session'}
          </h1>
        </div>
        <div className="text-green-400 font-semibold">Session Details</div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Video Player */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-40 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-40 left-60 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-60 left-40 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 p-8 h-full flex flex-col">
            {/* Logo */}
            <div className="absolute top-6 right-8 text-center">
              <div className="text-2xl font-bold text-white">MEDH</div>
              <div className="text-xs text-gray-300">- LEARN. UPSKILL. ELEVATE. -</div>
            </div>

            {/* Video Player */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-4xl mx-auto">
                {/* Video Container */}
                <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                  {session.video?.url ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain cursor-pointer"
                      onDoubleClick={handleVideoDoubleClick}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls
                    >
                      <source src={session.video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <FaPlay className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No video available for this session</p>
                        <p className="text-sm mt-2">Video URL: {session.video?.url || 'Not provided'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Double-click hint overlay - only show if video is available */}
                  {session.video?.url && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      Double-click for fullscreen
                    </div>
                  )}
                  
                  {/* Play/Pause overlay button - only show if video is available */}
                  {session.video?.url && (
                    <button 
                      onClick={handlePlayPause}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                      title={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <FaPause className="text-gray-900 text-xl" />
                      ) : (
                        <FaPlay className="text-gray-900 text-xl ml-1" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Video Title */}
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">{session.sessionTitle}</h2>
                  <p className="text-green-400 font-medium">
                    Session #{session.sessionNo}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Icons */}
            <div className="flex items-center gap-6 mb-8">
              <div className="text-green-400">
                <FaMicrochip className="w-8 h-8" />
              </div>
              <div className="text-green-400">
                <FaCog className="w-8 h-8" />
              </div>
              <div className="text-green-400">
                <FaPython className="w-8 h-8" />
              </div>
            </div>

            {/* Brain Graphic */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-32 h-32 border-2 border-blue-400 rounded-full relative">
                <div className="absolute inset-2 border border-blue-300 rounded-full"></div>
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <div className="absolute bottom-8 right-4 w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-6 py-2 flex justify-between items-center text-sm">
              <div>Live Session</div>
              <div>{session.courseCategory || 'AI & Data Science'}</div>
              <div>Session #{session.sessionNo}</div>
              <div>Copyright © 2024. Medh.co</div>
            </div>
          </div>
        </div>

        {/* Right Side - Session Details & Summary */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            {/* Session Details */}
            <div className="mb-8">
              <h3 className="text-green-400 font-semibold text-lg mb-4 flex items-center gap-2">
                <FaUser className="w-5 h-5" />
                Session Information
              </h3>
              
              <div className="space-y-4">
                {/* Student Name */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Student Name</span>
                  </div>
                  <p className="text-white font-semibold">
                    {Array.isArray(session.students) && session.students.length > 0 
                      ? session.students[0]?.full_name || session.students[0]?.name || 'N/A'
                      : 'N/A'}
                  </p>
                </div>

                {/* Grade */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaGraduationCap className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Grade</span>
                  </div>
                  <p className="text-white font-semibold">
                    {Array.isArray(session.grades) && session.grades.length > 0 
                      ? session.grades[0]?.name || session.grades[0] || 'N/A'
                      : 'N/A'}
                  </p>
                </div>

                {/* Instructor */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Instructor</span>
                  </div>
                  <p className="text-white font-semibold">
                    {typeof session.instructorId === 'object' && session.instructorId?.full_name 
                      ? session.instructorId.full_name 
                      : session.instructorId?.name || 'N/A'}
                  </p>
                </div>

                {/* Session Title */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaComments className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Session Title</span>
                  </div>
                  <p className="text-white font-semibold">{session.sessionTitle || 'N/A'}</p>
                </div>

                {/* Session Number */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Session Number</span>
                  </div>
                  <p className="text-white font-semibold">{session.sessionNo || 'N/A'}</p>
                </div>

                {/* Date */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCalendarAlt className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Date & Time</span>
                  </div>
                  <p className="text-white font-semibold">
                    {formatDate(session.video?.date || session.date || new Date())}
                  </p>
                </div>

                {/* Remarks */}
                <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-500/20 rounded-lg">
                      <FaComments className="text-amber-400 w-4 h-4" />
                    </div>
                    <span className="text-amber-400 text-sm font-medium">Remarks</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <p className="text-white font-semibold text-sm leading-relaxed">
                      {session.remarks || 'No remarks available for this session.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Summary */}
            {session.summary && (
              <div>
                <h3 className="text-green-400 font-semibold text-lg mb-4 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                    <FaComments className="w-5 h-5 text-white" />
                  </div>
                  Session Summary
                </h3>
                <div className="space-y-3">
                  {session.summary.items && Array.isArray(session.summary.items) ? (
                    session.summary.items.map((item: any, index: number) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/30 shadow-lg"
                      >
                        <button
                          onClick={() => toggleSummary(index)}
                          className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-600/50 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg">
                              <span className="text-green-400 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-200 truncate">
                              {item.title || `Topic ${index + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: expandedSummary === index ? 45 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center justify-center w-6 h-6 bg-green-500/20 rounded-lg"
                            >
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </motion.div>
                          </div>
                        </button>
                        {expandedSummary === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                          >
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {item.description || 'No description available'}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500/20 rounded-lg">
                          <FaComments className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-300">No summary items available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary Description */}
            {session.summary?.description && (
              <div className="mt-6">
                <h3 className="text-green-400 font-semibold text-lg mb-4 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                    <FaComments className="w-5 h-5 text-white" />
                  </div>
                  Summary Description
                </h3>
                <div className="bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 shadow-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {session.summary.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
