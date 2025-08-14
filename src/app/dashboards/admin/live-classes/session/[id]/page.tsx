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
  FaComments
} from "react-icons/fa";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

export default function VideoSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const response = await liveClassesAPI.getSession(sessionId);
        console.log('Session data:', response);
        setSession(response.data);
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
    setIsPlaying(!isPlaying);
  };

  const toggleSummary = (index: number) => {
    setExpandedSummary(expandedSummary === index ? null : index);
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

            {/* Main Text */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-4xl">
                <h2 className="text-6xl font-bold text-white mb-4">Welcome</h2>
                <div className="relative">
                  <p className="text-2xl text-green-400 font-medium">
                    TO UNLOCKING THE POTENTIAL OF AI AND MACHINE LEARNING
                  </p>
                  <button 
                    onClick={handlePlayPause}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <FaPause className="text-gray-900 text-xl" />
                    ) : (
                      <FaPlay className="text-gray-900 text-xl ml-1" />
                    )}
                  </button>
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
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaComments className="text-green-400 w-4 h-4" />
                    <span className="text-green-400 text-sm font-medium">Remarks</span>
                  </div>
                  <p className="text-white font-semibold">
                    {session.summary?.description || 'Excellent progress in session fundamentals'}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Summary */}
            {session.summary && (
              <div>
                <h3 className="text-green-400 font-semibold text-lg mb-4">Session Summary</h3>
                <div className="space-y-2">
                  {session.summary.items && Array.isArray(session.summary.items) ? (
                    session.summary.items.map((item: any, index: number) => (
                      <div 
                        key={index}
                        className="bg-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSummary(index)}
                          className="w-full p-3 flex justify-between items-center text-left hover:bg-gray-600 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-200 truncate">
                            {item.title || `Topic ${index + 1}`}
                          </span>
                          <FaPlus 
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedSummary === index ? 'rotate-45' : ''
                            }`}
                          />
                        </button>
                        {expandedSummary === index && (
                          <div className="px-3 pb-3">
                            <p className="text-xs text-gray-300">{item.description || 'No description available'}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-300">No summary items available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
