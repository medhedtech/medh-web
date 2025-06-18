'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useZoomClient } from "@/hooks/useZoomClient";
import { ZoomMeetingStatus } from "@/types/zoom";
import { formatDuration, formatZoomDateTime } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Types for the component props
interface Meeting {
  id: string;
  title: string;
  image: string;
  speakerName: string;
  speakerImage: string;
  date: string;
  startingTime: string;
  duration: string;
  department: string;
  zoomMeetingId?: string;
  joinUrl?: string;
  status?: "upcoming" | "live" | "completed";
}

interface ZoomMeetingProps {
  meeting: Meeting;
}

const departmentColors = {
  "bg-secondaryColor": "Science",
  "bg-blue": "Mathematics",
  "bg-secondaryColor2": "Engineering",
  "bg-greencolor2": "Arts",
  "bg-orange": "Literature",
  "bg-yellow": "History",
} as const;

export const ZoomMeeting = ({ meeting }: ZoomMeetingProps) => {
  const [meetingStatus, setMeetingStatus] = useState<ZoomMeetingStatus>(
    meeting.status === "live" ? "in_progress" : 
    meeting.status === "completed" ? "ended" : 
    "not_started"
  );
  const [isJoining, setIsJoining] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const { zoomClient, isInitialized, isLoading, error, currentMeeting } = useZoomClient();

  // Reference to meeting container
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  // Unique ID for this meeting instance
  const meetingElementId = `zoom-meeting-${meeting.id}`;

  const {
    id,
    title,
    image,
    speakerName,
    speakerImage,
    date,
    startingTime,
    duration,
    department,
    zoomMeetingId,
    joinUrl,
    status
  } = meeting;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Clean up when component unmounts
      if (currentMeeting === zoomMeetingId && isInitialized) {
        try {
          zoomClient.leaveMeeting().catch(console.error);
        } catch (err) {
          console.warn('Error leaving meeting on unmount:', err);
        }
      }
    };
  }, [currentMeeting, isInitialized, zoomClient, zoomMeetingId]);

  // Get background color based on department
  const depColor = Object.entries(departmentColors).find(
    ([_, dept]) => dept === department
  )?.[0] || "bg-secondaryColor";

  useEffect(() => {
    if (!isMounted || status) return; // Skip API call if we already have status

    const checkMeetingStatus = async () => {
      if (!zoomMeetingId || !isInitialized) return;
      
      try {
        const status = await zoomClient.getMeetingStatus(zoomMeetingId);
        setMeetingStatus(status || "not_started");
      } catch (error) {
        console.error("Failed to fetch meeting status:", error);
        showToast.error("Failed to get meeting status");
      }
    };

    checkMeetingStatus();
    // Poll for status updates every minute
    const interval = setInterval(checkMeetingStatus, 60000);
    return () => clearInterval(interval);
  }, [zoomMeetingId, isInitialized, isMounted, zoomClient, status]);

  const handleJoinMeeting = async () => {
    if (!zoomMeetingId) {
      showToast.error("Meeting ID not available");
      return;
    }

    setIsJoining(true);
    try {
      // First, initialize the Zoom client with our meeting container
      if (!isInitialized) {
        const initSuccess = await zoomClient.init(meetingElementId);
        if (!initSuccess) {
          throw new Error("Failed to initialize Zoom client");
        }
      }

      // Join the meeting
      await zoomClient.joinMeeting({
        meetingNumber: zoomMeetingId,
        password: "", // Add password if required
        userName: "Guest User", // Replace with actual user name
        userEmail: "", // Add email if required
        role: 0, // 0 for attendee, 1 for host
      });

      setShowMeeting(true);
    } catch (error) {
      console.error("Failed to join meeting:", error);
      showToast.error(error instanceof Error ? error.message : "Failed to join meeting");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveMeeting = async () => {
    try {
      await zoomClient.leaveMeeting();
      setShowMeeting(false);
      showToast.success("Left meeting successfully");
    } catch (error) {
      console.error("Failed to leave meeting:", error);
      showToast.error("Failed to leave meeting");
    }
  };

  // Render the meeting UI or meeting card
  return (
    <>
      {showMeeting ? (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            {/* Meeting Container */}
            <div 
              id={meetingElementId} 
              ref={meetingContainerRef}
              className="w-full h-full"
            />
            
            {/* Leave Meeting Button */}
            <button
              onClick={handleLeaveMeeting}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md z-10"
            >
              Leave Meeting
            </button>
          </div>
        </div>
      ) : (
        <div className="group" data-aos="fade-up">
          <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
            {/* Card image */}
            <div className="relative mb-4 overflow-hidden">
              <Link href={`/zoom/meetings/${id}`} className="block w-full">
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={225}
                  className="w-full transition-all duration-300 group-hover:scale-110"
                  placeholder="empty"
                />
              </Link>
              <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                <div>
                  <p className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold ${depColor}`}>
                    {department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    meetingStatus === "in_progress" ? "bg-green-500" :
                    meetingStatus === "not_started" ? "bg-yellow-500" :
                    "bg-red-500"
                  } text-white`}>
                    {meetingStatus === "in_progress" ? "Live" :
                     meetingStatus === "not_started" ? "Upcoming" :
                     "Ended"}
                  </span>
                  <Link
                    className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor transition-colors"
                    href={`/zoom/meetings/${id}`}
                    aria-label="Add to favorites"
                  >
                    <i className="icofont-heart-alt text-base py-1 px-2"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card content */}
            <div>
              <div className="flex flex-wrap justify-between items-center mb-15px">
                <div className="flex items-center">
                  <i className="icofont-calendar pr-5px text-primaryColor text-lg"></i>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {formatZoomDateTime(date)}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              <Link
                href={`/zoom/meetings/${id}`}
                className="text-lg md:text-size-22 font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
              >
                {title}
              </Link>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center">
                  Starting Time:
                  <span className="text-xl md:text-size-26 leading-9 md:leading-12 font-bold text-primaryColor ml-10px">
                    {startingTime}
                  </span>
                </p>

                <p className="text-sm text-contentColor dark:text-contentColor-dark flex items-center">
                  Meeting ID:
                  <span className="text-sm md:text-lg leading-9 md:leading-12 font-bold text-secondaryColor ml-10px">
                    {zoomMeetingId || id}
                  </span>
                </p>

                {meetingStatus === "in_progress" && (
                  <Button
                    onClick={handleJoinMeeting}
                    disabled={isJoining || isLoading}
                    className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white"
                  >
                    {isJoining || isLoading ? "Joining..." : "Join Meeting"}
                  </Button>
                )}
              </div>

              {/* Speaker info */}
              <div className="pt-15px border-t border-borderColor">
                <Link
                  href={`/instructors/${id}`}
                  className="text-xs flex items-center text-contentColor hover:text-primaryColor dark:text-contentColor-dark dark:hover:text-primaryColor"
                >
                  <Image
                    className="w-50px h-50px rounded-full mr-15px"
                    src={speakerImage}
                    alt={`${speakerName}'s profile picture`}
                    width={50}
                    height={50}
                  />
                  <div>
                    <span>Speaker:</span>
                    <h3 className="text-lg font-bold text-blackColor dark:text-blackColor-dark">
                      {speakerName}
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomMeeting;
