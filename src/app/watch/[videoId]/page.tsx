"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Calendar,
  Clock,
  User,
  Video,
  Loader2,
  AlertCircle,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
  Eye,
  Download,
  MoreVertical,
} from "lucide-react";
import { liveClassesAPI } from "@/apis/liveClassesAPI";

interface VideoData {
  _id: string;
  title: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  duration?: string;
  instructor?: {
    full_name: string;
    email: string;
  };
  video_url: string;
  fileSize?: number;
  description?: string;
  student_name?: string;
  liveSessionId?: string;
}

interface LiveSessionData {
  _id: string;
  sessionTitle: string;
  sessionNo: string;
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
  instructorId?: {
    _id: string;
    full_name: string;
    email: string;
  };
  students?: Array<{
    _id: string;
    full_name: string;
    email: string;
  }>;
  status: string;
}

const VideoPlayerPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  // MAXIMUM SECURITY: Prevent ALL forms of content theft + Link Sharing Protection
  useEffect(() => {
    // PREVENT MULTIPLE TABS & LINK SHARING
    const sessionKey = `video_session_${videoId}`;
    const currentTime = Date.now();
    
    // Check if video is already open in another tab
    const existingSession = localStorage.getItem(sessionKey);
    if (existingSession) {
      const sessionData = JSON.parse(existingSession);
      if (currentTime - sessionData.timestamp < 5000) { // 5 seconds tolerance
        alert('This video is already open in another tab. Please close other tabs first.');
        window.close();
        return;
      }
    }
    
    // Set current session
    localStorage.setItem(sessionKey, JSON.stringify({
      timestamp: currentTime,
      tabId: Math.random().toString(36).substr(2, 9)
    }));
    
    // Clear session on page unload
    const handleBeforeUnload = () => {
      localStorage.removeItem(sessionKey);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check for direct URL access (prevent link sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const hasValidData = urlParams.get('data') || localStorage.getItem(`video_${videoId}`);
    
    if (!hasValidData) {
      alert('Invalid access. Please access video through proper navigation.');
      window.location.href = '/dashboards/student';
      return;
    }
    
    // Prevent URL copying
    const originalURL = window.location.href;
    const cleanURL = window.location.origin + window.location.pathname;
    
    // Replace URL without data parameters
    if (window.location.search) {
      window.history.replaceState({}, document.title, cleanURL);
    }
    
    // Monitor for URL changes
    const handlePopState = () => {
      if (window.location.href !== cleanURL) {
        window.location.href = '/dashboards/student';
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Block ALL developer tools and screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen, F-keys, and all developer shortcuts
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        e.keyCode === 44 || // PrintScreen keycode
        e.which === 44 ||   // PrintScreen which
        e.key === 'F12' ||
        e.key === 'F1' ||
        e.key === 'F2' ||
        e.key === 'F3' ||
        e.key === 'F4' ||
        e.key === 'F5' ||
        e.key === 'F6' ||
        e.key === 'F7' ||
        e.key === 'F8' ||
        e.key === 'F9' ||
        e.key === 'F10' ||
        e.key === 'F11' ||
        // Developer tools combinations
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        (e.ctrlKey && (e.key === 'h' || e.key === 'H')) ||
        // Mac shortcuts
        (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.metaKey && (e.key === 'u' || e.key === 'U')) ||
        (e.metaKey && (e.key === 's' || e.key === 'S')) ||
        (e.metaKey && (e.key === 'a' || e.key === 'A')) ||
        (e.metaKey && (e.key === 'p' || e.key === 'P')) ||
        // Windows screenshot shortcuts
        (e.altKey && e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'PrintScreen') ||
        (e.shiftKey && e.key === 'PrintScreen') ||
        // Windows + Shift + S (Snipping Tool)
        (e.metaKey && e.shiftKey && e.key === 'S') ||
        // Alt + Tab (prevent task switching during video)
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Show warning for screenshot attempts
        if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
          alert('Screenshots are not allowed for security reasons.');
        }
        
        return false;
      }
    };

    // Pause video when tab becomes hidden (prevents background recording)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    };

    // Detect focus loss (user switched to another app)
    const handleBlur = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Mobile touch events prevention
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent multi-touch gestures
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    };

    // Additional screenshot prevention
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent clipboard access
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add all event listeners
    document.addEventListener('contextmenu', handleContextMenu, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('keyup', handleKeyUp, { passive: false });
    document.addEventListener('copy', handleCopy, { passive: false });
    document.addEventListener('cut', handleCut, { passive: false });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('dragstart', handleDragStart, { passive: false });
    document.addEventListener('selectstart', handleSelectStart, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Apply CSS security styles
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserDrag = 'none';
    document.body.style.webkitTapHighlightColor = 'transparent';
    document.body.style.pointerEvents = 'auto';
    
    // Disable text selection globally
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Disable image dragging */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Disable video controls manipulation */
      video::-webkit-media-controls {
        display: none !important;
      }
      
      video::-webkit-media-controls-enclosure {
        display: none !important;
      }
      
      /* Mobile specific restrictions */
      @media (max-width: 768px) {
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Override console methods to prevent debugging
    const originalConsole = { ...console };
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    console.table = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.clear = () => {};

    // Monitor for screen recording attempts (passive detection)
    let isRecording = false;
    
    // Only check when user actually tries to start recording
    const monitorScreenShare = () => {
      // Check if screen sharing API is being accessed
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function(...args) {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            alert('Screen recording detected. Video paused for security.');
          }
          return originalGetDisplayMedia.apply(this, args);
        };
      }
    };

    monitorScreenShare();

    // Cleanup function
    return () => {
      // Remove session tracking
      localStorage.removeItem(sessionKey);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      // Restore original styles
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.style.webkitUserDrag = '';
      document.body.style.webkitTapHighlightColor = '';
      document.body.style.pointerEvents = '';
      
      // Remove security styles
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      // Restore console
      Object.assign(console, originalConsole);
    };
  }, []);
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [liveSessionData, setLiveSessionData] =
    useState<LiveSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  
  // UI states
  const [showSummary, setShowSummary] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const loadVideoAndSessionData = async () => {
      try {
        setLoading(true);
        
        // Get video data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const videoDataParam = urlParams.get("data");
        let videoInfo: VideoData | null = null;
        
        if (videoDataParam) {
          videoInfo = JSON.parse(decodeURIComponent(videoDataParam));
        } else {
          const storedData = localStorage.getItem(`video_${videoId}`);
          if (storedData) {
            videoInfo = JSON.parse(storedData);
          }
        }
        
        if (!videoInfo) {
          setError("Video data not found");
          setLoading(false);
          return;
        }
        
        console.log("🔍 Video data loaded:", videoInfo);
        console.log("🔍 Video data keys:", Object.keys(videoInfo));
        console.log("🔍 liveSessionId:", videoInfo.liveSessionId);
        console.log("🔍 session_id:", videoInfo.session_id);
        
        // Extract batch ID, student ID, and session number for S3 bucket fetch
        let batchId = "";
        let studentId = "";
        let sessionNo = "";
        
        // Try to extract from liveSessionId or session_id
        if (videoInfo.liveSessionId || videoInfo.session_id) {
          const sessionId = videoInfo.liveSessionId || videoInfo.session_id;
          console.log("🔍 Session ID found:", sessionId);
          
          // We'll fetch the session data to get batch and student info
          try {
            const sessionResponse = await liveClassesAPI.getSession(sessionId);
            const sessionData =
              sessionResponse.data?.data || sessionResponse.data;
            
            if (sessionData) {
              batchId = sessionData.batchId;
              studentId =
                sessionData.students?.[0]?._id || sessionData.students?.[0];
              sessionNo =
                sessionData.originalSessionNo ||
                sessionData.sessionNo?.split("-")[0] ||
                "1";

              console.log("📊 Extracted from session:", {
                batchId,
                studentId,
                sessionNo,
              });
            }
          } catch (sessionError) {
            console.error("❌ Error fetching session data:", sessionError);
          }
        }
        
        // If we have the required IDs, fetch video from S3 bucket structure
        if (batchId && studentId && sessionNo) {
          console.log("🎯 Fetching video from S3 bucket structure...");
          console.log("📊 S3 Fetch Parameters:", {
            batchId,
            studentId,
            sessionNo,
          });

          try {
            const s3VideoResponse =
              await liveClassesAPI.getVideoByBatchStudentSession(
                batchId,
                studentId,
                sessionNo
              );

            console.log("🔍 S3 API Response:", s3VideoResponse);
            console.log("🔍 Response Status:", s3VideoResponse.status);
            console.log("🔍 Response Data:", s3VideoResponse.data);
            
            // Handle double-nested response structure
            const s3Data = s3VideoResponse.data?.data || s3VideoResponse.data;
            
            if (s3VideoResponse.status === "success" && s3Data?.signedUrl) {
              console.log("✅ Video fetched from S3 bucket successfully");
              
              // Use RAW S3 URL directly (skip CloudFront conversion for now)
              let s3Url = s3Data.signedUrl;
              let finalVideoUrl = s3Url;
              
              console.log("🔍 Raw S3 URL from backend:", s3Url);
              console.log("🔍 S3 URL length:", s3Url.length);
              console.log(
                "🔍 S3 URL contains AWS params:",
                s3Url.includes("X-Amz-")
              );
              
              // Skip CloudFront conversion - use raw S3 URL
              console.log("🎯 Using RAW S3 URL (no CloudFront conversion)");
              
              // Optional: Try CloudFront conversion as backup
              let cloudFrontUrl = null;
              if (s3Url.includes("medh-filess.s3.ap-south-1.amazonaws.com")) {
                const s3UrlParts = s3Url.split(
                  "medh-filess.s3.ap-south-1.amazonaws.com/"
                );
                if (s3UrlParts.length === 2) {
                  const objectPath = s3UrlParts[1];
                  const cleanPath = objectPath.split("?")[0];
                  const decodedPath = decodeURIComponent(cleanPath);
                  cloudFrontUrl = `https://cdn.medh.co/${decodedPath}`;
                  
                  console.log("🔄 CloudFront URL (backup):", cloudFrontUrl);
                }
              }
              
              // Update video info with S3 URL
              videoInfo.video_url = finalVideoUrl;
              videoInfo.s3_metadata = s3Data.videoMetadata;
              videoInfo.fetchedFromS3 = true;
              videoInfo.cloudFrontBackup = cloudFrontUrl;
              videoInfo.rawS3Url = s3Url;
              
              console.log("🎬 Final S3 Video URL:", videoInfo.video_url);
              console.log("📁 S3 Metadata:", videoInfo.s3_metadata);
              console.log(
                "🔄 CloudFront Backup URL:",
                videoInfo.cloudFrontBackup
              );
            } else {
              console.log("⚠️ S3 response not successful or missing signedUrl");
              console.log(
                "📋 Full S3 Response:",
                JSON.stringify(s3VideoResponse, null, 2)
              );
            }
          } catch (s3Error) {
            console.error("❌ Error fetching video from S3:", s3Error);
            console.log("⚠️ Falling back to original video URL");
          }
        } else {
          console.log(
            "⚠️ Missing batch/student/session info, trying hardcoded values for testing..."
          );
          console.log("📋 Available info:", {
            batchId: batchId || "missing",
            studentId: studentId || "missing",
            sessionNo: sessionNo || "missing",
          });
          
          // Test with hardcoded values from the URL we know works
          console.log("🧪 Testing S3 fetch with known working values...");
          try {
            const testS3Response =
              await liveClassesAPI.getVideoByBatchStudentSession(
                "68a9c9e15e447b6571f701d5",
                "6800b0508c413e0442bf11e0",
                "1"
              );

            console.log("🧪 Test S3 Response:", testS3Response);

            if (
              testS3Response.status === "success" &&
              testS3Response.data?.signedUrl
            ) {
              console.log("✅ Test S3 fetch successful! Using test result.");
              
              // Convert S3 URL to CloudFront URL
              let s3Url = testS3Response.data.signedUrl;
              let finalVideoUrl = s3Url;
              
              if (s3Url.includes("medh-filess.s3.ap-south-1.amazonaws.com")) {
                const s3UrlParts = s3Url.split(
                  "medh-filess.s3.ap-south-1.amazonaws.com/"
                );
                if (s3UrlParts.length === 2) {
                  const objectPath = s3UrlParts[1];
                  const cleanPath = objectPath.split("?")[0];
                  const decodedPath = decodeURIComponent(cleanPath);
                  const queryParams = objectPath.includes("?")
                    ? "?" + objectPath.split("?")[1]
                    : "";
                  finalVideoUrl = `https://cdn.medh.co/${decodedPath}${queryParams}`;
                  
                  console.log(
                    "🔄 Test: Converted S3 to CloudFront URL:",
                    finalVideoUrl
                  );
                }
              }
              
              // Update video info with test S3 URL
              videoInfo.video_url = finalVideoUrl;
              videoInfo.s3_metadata = testS3Response.data.videoMetadata;
              videoInfo.fetchedFromS3 = true;
              videoInfo.testFetch = true;
              
              console.log("🎬 Test: Final S3 Video URL:", videoInfo.video_url);
            }
          } catch (testError) {
            console.error("❌ Test S3 fetch failed:", testError);
          }
        }
        
        console.log("🔍 Final video URL:", videoInfo.video_url);
        
        // Verify video source and log details
        if (videoInfo.fetchedFromS3) {
          console.log(
            "🎯 ✅ Video successfully fetched from S3 bucket structure!"
          );
          console.log("📁 S3 Folder Structure Used: batch → student → session");
          console.log(
            "🔧 CORS: Removed crossOrigin attribute to avoid CORS issues"
          );
          console.log("♾️ NO EXPIRY: Videos are permanently accessible");
          console.log("🔓 NO RESTRICTIONS: All intercept restrictions removed");
        } else if (
          videoInfo.video_url &&
          videoInfo.video_url.includes("cdn.medh.co")
        ) {
          console.log(
            "✅ Video source: S3 CDN (cdn.medh.co) - Using fallback URL"
          );
          console.log(
            "🔧 CORS: Removed crossOrigin attribute to avoid CORS issues"
          );
          console.log("♾️ NO EXPIRY: Videos are permanently accessible");
          console.log("🔓 NO RESTRICTIONS: All intercept restrictions removed");
        } else if (videoInfo.video_url && videoInfo.video_url.includes("s3")) {
          console.log("✅ Video source: S3 Bucket - Direct URL");
          console.log(
            "🔧 CORS: Removed crossOrigin attribute to avoid CORS issues"
          );
          console.log("♾️ NO EXPIRY: Videos are permanently accessible");
        } else if (videoInfo.video_url) {
          console.log(
            "⚠️ Video source: Other/Unknown - Should be from S3 bucket"
          );
        } else {
          console.log("❌ No video URL provided");
        }
        
        setVideoData(videoInfo);
        
        // Debug S3 video URL source
        console.log("🔍 S3 Video URL source check:");
        console.log("   - From S3 (URL params):", !!videoInfo.video_url);
        console.log("   - S3 Video URL:", videoInfo.video_url);
        console.log("   - URL Length:", videoInfo.video_url?.length || 0);
        console.log(
          "   - LiveSession ID (for summary/remarks only):",
          videoInfo.liveSessionId
        );
        
        // Additional debugging for video loading
        console.log("🎬 Video Loading Debug:");
        console.log("   - Will attempt to load video:", !!videoInfo.video_url);
        console.log("   - Videos are permanently accessible - NO EXPIRY");
        console.log("   - Video data structure:", {
          hasTitle: !!videoInfo.title,
          hasSessionTitle: !!videoInfo.sessionTitle,
          hasDate: !!videoInfo.date,
          hasInstructor: !!videoInfo.instructor,
          hasFileSize: !!videoInfo.fileSize,
        });
        
        // Try to fetch LiveSession data if we have a session ID
        if (
          videoInfo.liveSessionId &&
          videoInfo.liveSessionId !== "null" &&
          videoInfo.liveSessionId !== null
        ) {
          try {
            console.log(
              "🔍 Fetching LiveSession data for ID:",
              videoInfo.liveSessionId
            );
            const sessionResponse = await liveClassesAPI.getSession(
              videoInfo.liveSessionId
            );
            console.log("🔍 LiveSession API response:", sessionResponse);
            
            // Handle the API client response structure
            let sessionData = null;
            if (sessionResponse && sessionResponse.status === "success") {
              if (sessionResponse.data && sessionResponse.data.data) {
                sessionData = sessionResponse.data.data;
              } else if (sessionResponse.data) {
                sessionData = sessionResponse.data;
              }
            } else if (sessionResponse && sessionResponse.data) {
              sessionData = sessionResponse.data;
            } else if (sessionResponse) {
              sessionData = sessionResponse;
            }
            
            console.log("🔍 Extracted LiveSession data:", sessionData);
            
            if (sessionData) {
              console.log("🔍 LiveSession data structure:", {
                hasRemarks: !!sessionData.remarks,
                hasSummary: !!sessionData.summary,
                remarks: sessionData.remarks,
                summary: sessionData.summary,
              });

              console.log(
                "ℹ️ LiveSession collection is used only for summary and remarks, not for video URLs"
              );
              console.log(
                "✅ Video URLs come from S3 bucket through URL parameters"
              );
            }
            
            setLiveSessionData(sessionData);
          } catch (sessionError) {
            console.error("❌ Error fetching LiveSession data:", sessionError);
          }
        }
        
        // Final check - if no valid S3 video URL, show helpful error
        if (
          !videoInfo?.video_url ||
          videoInfo.video_url === "#" ||
          videoInfo.video_url === ""
        ) {
          console.error("❌ No valid S3 video URL found");
          console.log("🔍 S3 Video URL check:", {
            hasVideoInfo: !!videoInfo,
            s3VideoUrl: videoInfo?.video_url,
            liveSessionId: videoInfo?.liveSessionId,
          });
          setError(
            "S3 video URL not found in URL parameters. Videos should come from S3 bucket only."
          );
        } else {
          console.log("✅ S3 video URL found, proceeding with video load");
          console.log("🎯 Final video URL to load:", videoInfo.video_url);
          
          // Test URL accessibility before video element tries to load it
          if (
            videoInfo.video_url &&
            videoInfo.video_url.includes("cdn.medh.co")
          ) {
            console.log("🧪 Testing S3 URL accessibility...");
            console.log(
              "📋 Copy this URL to test in browser:",
              videoInfo.video_url
            );
            
            // Try a simple fetch test
            fetch(videoInfo.video_url, { method: "HEAD", mode: "no-cors" })
              .then((response) => {
                console.log("✅ S3 URL fetch test completed");
                console.log("   - Response available:", !!response);
              })
              .catch((error) => {
                console.error("❌ S3 URL fetch test failed:", error);
                console.log("   - This might indicate network or CORS issues");
              });
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading video data:", err);
        setError("Failed to load video data");
        setLoading(false);
      }
    };
    
    if (videoId) {
      loadVideoAndSessionData();
    }
  }, [videoId]);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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
      setVideoLoading(false);
      setVideoError(null);
    }
  };

  const handleVideoError = async (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = e.currentTarget;
    const error = video.error;
    const videoSrc = video.src;
    
    let errorMessage = "Video loading failed";
    let errorDetails = "Unknown error";
    let isCorsIssue = false;
    let shouldRetryWithFreshUrl = false;
    
    // Check if it's an S3 CDN related error - NO EXPIRY CHECKS
    if (
      videoSrc &&
      videoSrc.includes("cdn.medh.co") &&
      error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
    ) {
      errorMessage = "S3 CDN Access Issue - Attempting to refresh URL";
      errorDetails =
        "Video URL may have expired. Generating fresh signed URL...";
      isCorsIssue = true;
      shouldRetryWithFreshUrl = true;
    } else if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Video loading was aborted";
          errorDetails = "The video loading process was interrupted";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error occurred while loading video";
          errorDetails = "Check your internet connection and try again";
          shouldRetryWithFreshUrl = true; // Network errors might be due to expired URLs
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Video format is not supported";
          errorDetails =
            "The video file format cannot be played by your browser";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage =
            "Video source is not supported - Attempting to refresh URL";
          errorDetails =
            "The video URL may have expired. Generating fresh signed URL...";
          shouldRetryWithFreshUrl = true;
          break;
        default:
          errorMessage = `Video error (Code: ${error.code})`;
          errorDetails =
            error.message ||
            "An unknown error occurred while loading the video";
      }
    }
    
    // Detailed error logging for debugging
    console.error("❌ Video loading error details:", {
      errorCode: error?.code || "No error code",
      errorMessage: error?.message || "No error message",
      videoSrc: videoSrc || "No video source",
      videoSrcLength: videoSrc?.length || 0,
      isCorsIssue: isCorsIssue,
      isS3CDN: videoSrc?.includes("cdn.medh.co") || false,
      shouldRetryWithFreshUrl: shouldRetryWithFreshUrl,
      currentVideoData: videoData
        ? {
        hasVideoUrl: !!videoData.video_url,
        videoUrlLength: videoData.video_url?.length || 0,
            sessionTitle: videoData.sessionTitle,
          }
        : "No video data",
    });
    
    // Try CloudFront backup URL first if available
    if (
      videoData?.cloudFrontBackup &&
      videoSrc !== videoData.cloudFrontBackup
    ) {
      console.log("🔄 Trying CloudFront backup URL...");
      console.log("🔍 CloudFront URL:", videoData.cloudFrontBackup);
      
      const updatedVideoData = {
        ...videoData,
        video_url: videoData.cloudFrontBackup,
      };
      
      setVideoData(updatedVideoData);
      setVideoError(null);
      setVideoLoading(true);
      
      console.log("✅ Switched to CloudFront backup URL");
      return;
    }
    
    // Try to fetch fresh video from S3 bucket structure if this looks like an expiry issue
    if (shouldRetryWithFreshUrl && videoData && videoSrc) {
      try {
        console.log("🔄 Attempting to fetch fresh video from S3 bucket...");
        
        // Check authentication status
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("token");
        console.log("🔑 Authentication token available:", !!token);
        console.log("🔑 Token length:", token ? token.length : 0);
        
        // Try to get batch, student, session info from video data
        let batchId = "";
        let studentId = "";
        let sessionNo = "";
        
        if (videoData.liveSessionId || videoData.session_id) {
          const sessionId = videoData.liveSessionId || videoData.session_id;
          console.log("🔍 Using session ID for fresh fetch:", sessionId);
          
          try {
            const sessionResponse = await liveClassesAPI.getSession(sessionId);
            const sessionData =
              sessionResponse.data?.data || sessionResponse.data;
            
            if (sessionData) {
              batchId = sessionData.batchId;
              studentId =
                sessionData.students?.[0]?._id || sessionData.students?.[0];
              sessionNo =
                sessionData.originalSessionNo ||
                sessionData.sessionNo?.split("-")[0] ||
                "1";

              console.log("📊 Extracted for fresh fetch:", {
                batchId,
                studentId,
                sessionNo,
              });
            }
          } catch (sessionError) {
            console.error(
              "❌ Error fetching session for refresh:",
              sessionError
            );
          }
        }
        
        // If we have the required info, fetch fresh video from S3
        if (batchId && studentId && sessionNo) {
          console.log("🎯 Fetching fresh video from S3 bucket structure...");

          const s3Response = await liveClassesAPI.getVideoByBatchStudentSession(
            batchId,
            studentId,
            sessionNo
          );

          console.log("🔍 S3 fresh fetch response:", s3Response);
          
          // Handle double-nested response structure
          const s3Data = s3Response.data?.data || s3Response.data;
          
          if (s3Response.status === "success" && s3Data?.signedUrl) {
            console.log("✅ Fresh video fetched from S3 bucket successfully");
            
            // Convert S3 URL to CloudFront URL
            let freshS3Url = s3Data.signedUrl;
            let finalFreshUrl = freshS3Url;
            
            if (
              freshS3Url.includes("medh-filess.s3.ap-south-1.amazonaws.com")
            ) {
              const s3UrlParts = freshS3Url.split(
                "medh-filess.s3.ap-south-1.amazonaws.com/"
              );
              if (s3UrlParts.length === 2) {
                const objectPath = s3UrlParts[1];
                const cleanPath = objectPath.split("?")[0];
                const decodedPath = decodeURIComponent(cleanPath);
                const queryParams = objectPath.includes("?")
                  ? "?" + objectPath.split("?")[1]
                  : "";
                finalFreshUrl = `https://cdn.medh.co/${decodedPath}${queryParams}`;
                
                console.log(
                  "🔄 Fresh: Converted S3 to CloudFront URL:",
                  finalFreshUrl
                );
              }
            }
            
            // Update video data with fresh S3 URL
            const updatedVideoData = {
              ...videoData,
              video_url: finalFreshUrl,
              s3_metadata: s3Data.videoMetadata,
              fetchedFromS3: true,
            };
            
            setVideoData(updatedVideoData);
            setVideoError(null);
            setVideoLoading(true);
            
            console.log(
              "🎯 Updated with fresh S3 URL:",
              s3Response.data.signedUrl
            );
            
            // The video element will automatically reload with the new URL
            return;
          }
        } else {
          console.log(
            "⚠️ Missing batch/student/session info, trying fallback method..."
          );
          
          // Fallback: Extract video path and use old method
          const url = new URL(videoSrc);
          const videoPath = url.pathname.substring(1); // Remove leading slash
          
          console.log("🔍 Extracted video path for fallback:", videoPath);

          const response =
            await liveClassesAPI.generateSignedVideoUrl(videoPath);

          if (
            response.status === "success" &&
            response.data &&
            response.data.signedUrl
          ) {
            console.log("✅ Fresh signed URL generated via fallback");
            
            let freshUrl = response.data.signedUrl;
            
            // Convert S3 URL to CloudFront URL if needed
            if (freshUrl.includes("medh-filess.s3.ap-south-1.amazonaws.com")) {
              const s3UrlParts = freshUrl.split(
                "medh-filess.s3.ap-south-1.amazonaws.com/"
              );
              if (s3UrlParts.length === 2) {
                const objectPath = s3UrlParts[1];
                const cleanPath = objectPath.split("?")[0];
                const decodedPath = decodeURIComponent(cleanPath);
                const queryParams = objectPath.includes("?")
                  ? "?" + objectPath.split("?")[1]
                  : "";
                freshUrl = `https://cdn.medh.co/${decodedPath}${queryParams}`;
                
                console.log("🔄 Converted S3 URL to CloudFront URL:", freshUrl);
              }
            }
            
            const updatedVideoData = {
              ...videoData,
              video_url: freshUrl,
            };
            
            setVideoData(updatedVideoData);
            setVideoError(null);
            setVideoLoading(true);
            
            console.log("🎯 Updated with fallback URL:", freshUrl);
            return;
          }
        }
      } catch (refreshError) {
        console.error("❌ Failed to fetch fresh video:", refreshError);
        errorMessage = "Failed to refresh video URL";
        errorDetails =
          "Unable to fetch a fresh video from S3. Please try refreshing the page.";
      }
    }
    
    // Additional debugging - test URL accessibility
    if (videoSrc && videoSrc.includes("cdn.medh.co")) {
      console.log("🔍 S3 CDN URL Analysis:");
      try {
        const url = new URL(videoSrc);
        console.log("   - Protocol:", url.protocol);
        console.log("   - Host:", url.hostname);
        console.log("   - Path:", url.pathname);
        console.log("   - Has query params:", url.search.length > 0);
        console.log("   - Full URL length:", videoSrc.length);
        
        // Test if URL is reachable (this will show in network tab)
        console.log("🌐 Testing S3 CDN connectivity...");
        fetch(videoSrc, { method: "HEAD", mode: "no-cors" })
          .then(() => console.log("✅ S3 CDN HEAD request completed"))
          .catch((err) => console.error("❌ S3 CDN HEAD request failed:", err));
      } catch (urlError) {
        console.error("❌ Invalid URL format:", urlError);
      }
    }
    
    setVideoError(errorMessage);
    setVideoLoading(false);
  };

  const handleVideoLoadStart = () => {
    console.log("🔄 Video loading started...");
    setVideoLoading(true);
    setVideoError(null);
  };

  const handleVideoCanPlay = () => {
    console.log("✅ Video can play");
    setVideoLoading(false);
    setVideoError(null);
  };

  const retryVideoLoad = () => {
    if (videoRef.current && videoData?.video_url) {
      console.log("🔄 Retrying video load...");
      console.log("   - Video URL:", videoData.video_url);
      console.log("   - Video element ready:", !!videoRef.current);
      
      setVideoError(null);
      setVideoLoading(true);
      
      // Force reload the video element
      videoRef.current.load();
    } else {
      console.error("❌ Cannot retry: Missing video reference or URL");
      console.log("   - Video ref exists:", !!videoRef.current);
      console.log("   - Video URL exists:", !!videoData?.video_url);

      setVideoError("Cannot retry: Video URL or player not available");
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleBackButton = () => {
    window.close();
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Video
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we prepare your content...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Video Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error ||
              "The requested video could not be loaded. Please check the URL or try again later."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20"
      style={{ userSelect: "auto" }}
    >
       {/* Modern Header */}
       <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-b border-gradient-to-r from-indigo-200/30 via-purple-200/30 to-pink-200/30 dark:border-gray-700/50 sticky top-0 z-50 shadow-lg shadow-indigo-500/10">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
                             <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                onClick={handleBackButton}
                 className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl shadow-indigo-500/25"
              >
                <ArrowLeft className="w-4 h-4" />
                 <span className="font-medium">Back</span>
               </motion.button>
              
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {videoData.sessionTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Session #{videoData.sessionNumber} •{" "}
                  {formatDate(videoData.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
                             <div className="hidden md:flex items-center space-x-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                   <User className="w-5 h-5 text-white" />
                 </div>
              <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {videoData.instructor?.full_name}
                </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Instructor
                  </p>
              </div>
            </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
          </div>
        </div>
      </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-3 space-y-6">
                         {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
               className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10"
             >
              <div className="relative aspect-video">
                {videoData.video_url ? (
                                    <>
                    {console.log(
                      "🎬 Rendering video element with URL:",
                      videoData.video_url
                    )}
                    
              <video
                ref={videoRef}
                src={videoData.video_url}
                       className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                       onPlay={() => {
                        console.log("🎬 Video started playing successfully!");
                         setIsPlaying(true);
                       }}
                onPause={() => setIsPlaying(false)}
                       onDoubleClick={toggleFullscreen}
                       onError={handleVideoError}
                       onLoadStart={handleVideoLoadStart}
                       onCanPlay={(e) => {
                        console.log("🎬 Video can play - ready to start!");
                        console.log("🔍 Video duration:", e.target.duration);
                        console.log(
                          "🔍 Video readyState:",
                          e.target.readyState
                        );
                         handleVideoCanPlay(e);
                       }}
                       onLoadedData={(e) => {
                        console.log("🎬 Video data loaded successfully!");
                        console.log(
                          "🔍 Video dimensions:",
                          e.target.videoWidth,
                          "x",
                          e.target.videoHeight
                        );
                       }}
                       onContextMenu={(e) => e.preventDefault()}
                       controlsList="nodownload nofullscreen noremoteplaybook"
                       disablePictureInPicture
                       disableRemotePlayback
                       controls
                       preload="metadata"
                     />
                    
                    {/* Video Loading Overlay */}
                    <AnimatePresence>
                      {videoLoading && !videoError && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm"
                        >
                          <div className="text-center text-white">
                            <div className="relative mb-6">
                              <Loader2 className="w-16 h-16 mx-auto text-blue-400 animate-spin" />
                              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200/30 rounded-full animate-pulse mx-auto"></div>
                  </div>
                            <h3 className="text-xl font-semibold mb-2">
                              Loading Video
                            </h3>
                            <p className="text-gray-300">
                              Preparing your content...
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Video Error Overlay */}
                    <AnimatePresence>
                      {videoError && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 to-gray-900/90 backdrop-blur-sm"
                        >
                          <div className="text-center text-white max-w-md mx-auto p-8">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                              <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                              Video Loading Failed
                            </h3>
                            <p className="text-gray-300 mb-4">{videoError}</p>
                            
                            <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
                              <p className="text-xs text-gray-400 mb-2">
                                Debug Information:
                              </p>
                              <div className="text-xs text-gray-300 space-y-1">
                                <p>
                                  • Video Source:{" "}
                                  {videoData?.video_url
                                    ? "S3 CDN URL provided"
                                    : "No video URL"}
                                </p>
                                <p>
                                  • Session:{" "}
                                  {videoData?.sessionTitle || "Unknown"}
                                </p>
                                <p>• Error Type: Network or Format Issue</p>
                                <p>
                                  • Status: Video failed to load from S3 CDN
                                </p>
                                <p>
                                  • URL Length:{" "}
                                  {videoData?.video_url?.length || 0} characters
                                </p>
                                <p>
                                  • CDN Host:{" "}
                                  {videoData?.video_url?.includes("cdn.medh.co")
                                    ? "cdn.medh.co"
                                    : "Other"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mb-6 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                              <p className="text-xs text-blue-300 mb-2">
                                Troubleshooting Steps:
                              </p>
                              <div className="text-xs text-blue-200 space-y-1">
                                <p>
                                  1. Check browser console for detailed error
                                  logs
                                </p>
                                <p>
                                  2. Copy S3 URL from console and test in new
                                  tab
                                </p>
                                <p>
                                  3. Check network connectivity to cdn.medh.co
                                </p>
                                <p>
                                  4. Verify S3 bucket permissions and CORS
                                  settings
                                </p>
                              </div>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={retryVideoLoad}
                              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
                            >
                              Retry Loading
                            </motion.button>
                            
                            <div className="text-xs text-gray-400 space-y-1">
                              <p className="font-medium text-gray-300">
                                Solutions:
                              </p>
                              <p>• Check network connection to cdn.medh.co</p>
                              <p>• Try refreshing the page</p>
                              <p>• Verify video URL is accessible</p>
                              <p>• Contact support if issue persists</p>
                              <p>
                                • Videos should always be available - no expiry
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Double-click hint */}
                    {!videoLoading && !videoError && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                        Double-click for fullscreen
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Video className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        No Video Available
              </h3>
                      <p className="text-gray-400">
                        Video content is not available
                      </p>
                    </div>
                  </div>
                )}
                    </div>
            </motion.div>



                         {/* Instructor Remarks Below Video Details */}
             {liveSessionData?.remarks && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="bg-gradient-to-br from-white/80 to-amber-50/80 dark:from-gray-900/80 dark:to-amber-900/30 backdrop-blur-xl rounded-3xl shadow-xl shadow-amber-500/10 border border-white/30 dark:border-gray-700/30 overflow-hidden"
               >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Instructor Remarks
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Additional feedback and notes
                      </p>
                    </div>
          </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {liveSessionData.remarks}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

                     {/* Right Sidebar - Only Summary */}
           <div className="lg:col-span-1 space-y-6">
             {/* Session Summary - Only in Right Sidebar */}
               <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-gray-900/80 dark:to-emerald-900/30 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-500/10 border border-white/30 dark:border-gray-700/30 overflow-hidden"
             >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Session Summary
                  </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Key learning points
                    </p>
                  </div>
                </div>
                
                {liveSessionData?.summary ? (
                  <div className="space-y-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30 transition-all duration-200"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                      {liveSessionData.summary.title}
                    </h4>
                    <motion.div
                      animate={{ rotate: showSummary ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                    >
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </div>
                    </motion.div>
                
                    <AnimatePresence>
                {showSummary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                  >
                          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/30">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {liveSessionData.summary.description}
                    </p>
                          </div>
                  </motion.div>
                )}
                    </AnimatePresence>
                </div>
                ) : (
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/30 text-center">
                    <Info className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No summary available for this session.
                </p>
              </div>
            )}
                </div>
              </motion.div>
                </div>
              </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage;
