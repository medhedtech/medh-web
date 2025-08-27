"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { liveClassesAPI } from "@/apis/liveClassesAPI";
import { FaArrowLeft, FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaClosedCaptioning, FaClock, FaUser, FaGraduationCap, FaCalendarAlt, FaComments, FaTimes } from "react-icons/fa";
import Link from "next/link";

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

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<ISession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  
  // Summary expansion state
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await liveClassesAPI.getSession(sessionId);
        console.log('Session API response:', response);
        
        // Handle the response structure from the backend
        if (response && response.data) {
          setSession(response.data);
        } else {
          setSession(response);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load session");
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
        // Trigger fade-in animation
        setTimeout(() => setFadeIn(true), 100);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // Video player functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleCaptions = () => {
    setShowCaptions(!showCaptions);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper functions for data display
  const getStudentName = () => {
    if (session?.students && session.students.length > 0) {
      return session.students[0].full_name || "Student Name";
    }
    return "Student Name";
  };

  const getInstructorName = () => {
    if (session?.instructorId) {
      return session.instructorId.full_name || "Instructor Name";
    }
    return "Instructor Name";
  };

  const getGrade = () => {
    if (session?.grades && session.grades.length > 0) {
      return session.grades[0].name || "Grade";
    }
    return "Grade";
  };

  // Function to close the tab
  const handleCloseTab = () => {
    if (typeof window !== 'undefined') {
      window.close();
      // Fallback: redirect to dashboard if window.close() doesn't work
      setTimeout(() => {
        window.location.href = '/dashboard/admin/online-class';
      }, 100);
    }
  };

  // Function to toggle summary expansion
  const toggleSummary = (index: number) => {
    setExpandedSummary(expandedSummary === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Session Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested session could not be loaded."}</p>
          <button 
            onClick={handleCloseTab}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaTimes className="mr-2" />
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with close button */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleCloseTab}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaTimes className="mr-2" />
              Close Tab
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Live Learning Session
              </h1>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Session Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaGraduationCap className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Instructor</p>
                <p className="text-lg font-semibold text-gray-900">{getInstructorName()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaGraduationCap className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Grade</p>
                <p className="text-lg font-semibold text-gray-900">{getGrade()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaCalendarAlt className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(session.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Video Player and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Video Title */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{session.sessionTitle}</h2>
                <p className="text-blue-100">{session.remarks || "Live learning session"}</p>
              </div>

              {/* Video Container - Fixed height for better viewing */}
              <div 
                className="relative bg-black"
                style={{ height: '600px' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={session.video?.url || "/api/placeholder/video"} type="video/mp4" />
                  {showCaptions && (
                    <track
                      kind="subtitles"
                      src="/captions.vtt"
                      srcLang="en"
                      label="English"
                    />
                  )}
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-all duration-300 ${showControls || isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      title="Seek video"
                    />
                    <div className="flex justify-between text-white text-sm mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 transform hover:scale-110"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <FaPause className="text-white text-xl" />
                        ) : (
                          <FaPlay className="text-white text-xl" />
                        )}
                      </button>

                      {/* Volume Control */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <FaVolumeMute className="text-white" />
                          ) : (
                            <FaVolumeUp className="text-white" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          title="Volume"
                        />
                      </div>

                      {/* Playback Speed */}
                      <div className="relative group">
                        <button className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white text-sm font-medium">
                          {playbackRate}x
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 bg-black/90 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handlePlaybackRateChange(rate)}
                              className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                                playbackRate === rate
                                  ? 'bg-blue-600 text-white'
                                  : 'text-white hover:bg-white/20'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Captions Toggle */}
                      <button
                        onClick={toggleCaptions}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          showCaptions
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        title="Toggle captions"
                      >
                        <FaClosedCaptioning />
                      </button>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 transform hover:scale-110"
                      title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <FaCompress className="text-white text-xl" />
                      ) : (
                        <FaExpand className="text-white text-xl" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Details Section - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaComments className="mr-3 text-purple-600" />
                Summary Details
              </h3>
              
              <div className="space-y-4">
                {/* Session Summary */}
                {session.summary ? (
                  <div className="space-y-4">
                    {/* Summary Title - Clickable */}
                    <div 
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => toggleSummary(-1)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaComments className="mr-2 text-purple-600" />
                          {session.summary.title || "Session Overview"}
                        </h4>
                        <div className={`transform transition-transform duration-200 ${expandedSummary === -1 ? 'rotate-180' : ''}`}>
                          <FaArrowLeft className="text-purple-600" />
                        </div>
                      </div>
                      {expandedSummary === -1 && (
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {session.summary.description || "No description available"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Summary Items - Clickable */}
                    {session.summary.items && session.summary.items.length > 0 && (
                      <div className="space-y-3">
                        {session.summary.items.map((item, index) => (
                          <div 
                            key={index} 
                            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 cursor-pointer hover:shadow-md transition-all duration-200"
                            onClick={() => toggleSummary(index)}
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-md font-semibold text-gray-800 flex items-center">
                                <FaComments className="mr-2 text-green-600" />
                                {item.title || `Topic ${index + 1}`}
                              </h5>
                              <div className={`transform transition-transform duration-200 ${expandedSummary === index ? 'rotate-180' : ''}`}>
                                <FaArrowLeft className="text-green-600" />
                              </div>
                            </div>
                            {expandedSummary === index && (
                              <div className="mt-3 pt-3 border-t border-green-200">
                                <p className="text-gray-700 leading-relaxed text-sm">
                                  {item.description || "No description available"}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 text-center">
                    <FaComments className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="font-medium text-gray-600 text-sm">No summary available</p>
                    <p className="text-xs mt-1 text-gray-500">Summary information will appear here when available</p>
                  </div>
                )}

                {/* Additional Notes */}
                {session.remarks && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <FaComments className="mr-2 text-orange-600" />
                      Additional Notes
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {session.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
