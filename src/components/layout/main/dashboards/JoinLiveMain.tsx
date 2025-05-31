"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Video, 
  Play, 
  Users,
  ExternalLink,
  Search,
  Filter,
  CalendarDays
} from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { toast } from "react-toastify";
// Default course image
import defaultCourseImage from "@/assets/images/courses/Ai&Ml.jpeg";

interface LiveClass {
  _id: string;
  meet_title?: string;
  title?: string;
  course_name?: string;
  date: string;
  time: string;
  meet_link?: string;
  meetingLink?: string;
  status?: string;
  participants?: number;
  maxParticipants?: number;
  instructor?: {
    name: string;
    image?: string;
  };
  courseDetails?: {
    course_image?: string;
  };
}

const JoinLiveMain: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const { getQuery, loading } = useGetQuery<LiveClass[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Fetch student ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStudentId(storedUserId);
      } else {
        console.error("No student ID found in localStorage");
      }
    }
  }, []);

  // Fetch upcoming classes
  useEffect(() => {
    if (studentId) {
      const fetchLiveClasses = () => {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getMeetingByStudentId}/${studentId}?show_all_live=true`,
          onSuccess: (response: LiveClass[]) => {
            setLiveClasses(response || []);
          },
          onFail: (err) => {
            console.error("Error fetching live classes:", err);
            toast.error("Failed to fetch live classes");
            
            // Use mock data for demonstration if API fails
            setLiveClasses([
              {
                _id: "1",
                title: "Advanced React Hooks",
                course_name: "React Masterclass",
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5),
                meetingLink: "https://zoom.us/j/123456789",
                status: "live",
                participants: 24,
                maxParticipants: 30,
                instructor: {
                  name: "John Doe",
                  image: "/assets/images/instructors/instructor-1.jpg"
                }
              },
              {
                _id: "2",
                title: "Data Structures and Algorithms",
                course_name: "Computer Science Fundamentals",
                date: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString().split('T')[0],
                time: new Date(new Date().setHours(new Date().getHours() + 2)).toTimeString().slice(0, 5),
                meetingLink: "https://zoom.us/j/987654321",
                status: "upcoming",
                participants: 18,
                maxParticipants: 40,
                instructor: {
                  name: "Jane Smith",
                  image: "/assets/images/instructors/instructor-2.jpg"
                }
              }
            ]);
          },
        });
      };

      fetchLiveClasses();
    }
  }, [studentId, getQuery]);

  // Handler for joining a live class
  const handleJoinClass = (liveClass: LiveClass) => {
    // Normalize class properties (API might return different property names)
    const meetLink = liveClass.meet_link || liveClass.meetingLink;
    const classTitle = liveClass.meet_title || liveClass.title;
    
    if (!meetLink) {
      toast.error("Meeting link not available");
      return;
    }

    // Check if class is happening now or about to start within 10 minutes
    const classDate = liveClass.date;
    const classTime = liveClass.time;
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));

    if (minutesDifference > 10) {
      toast.info(`This class will start in ${minutesDifference} minutes. Meeting link will be enabled 10 minutes before start time.`);
      return;
    } else if (minutesDifference < -60) {
      toast.warning("This class has ended.");
      return;
    }

    // Open meeting link in new tab
    window.open(meetLink, "_blank");
    toast.success(`Joining: ${classTitle}`);
  };

  // Filter classes by status and search term
  const filteredClasses = liveClasses.filter(liveClass => {
    const title = liveClass.meet_title || liveClass.title || "";
    const courseName = liveClass.course_name || "";
    const searchMatch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") {
      return searchMatch;
    }
    
    const classDate = liveClass.date;
    const classTime = liveClass.time;
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
    
    if (filterStatus === "live" && minutesDifference >= -60 && minutesDifference <= 10) {
      return searchMatch;
    }
    
    if (filterStatus === "upcoming" && minutesDifference > 10) {
      return searchMatch;
    }
    
    return false;
  });

  // Determine class status
  const getClassStatus = (classDate: string, classTime: string) => {
    const classDateTime = new Date(`${classDate}T${classTime}`);
    const currentTime = new Date();
    
    const minutesDifference = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
    
    if (minutesDifference >= -60 && minutesDifference <= 10) {
      return { status: "live", label: "Live Now", color: "bg-red-500" };
    } else if (minutesDifference > 10) {
      return { status: "upcoming", label: "Upcoming", color: "bg-blue-500" };
    } else {
      return { status: "ended", label: "Ended", color: "bg-gray-500" };
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by class title or course name"
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilterStatus('all')}
          >
            <Filter size={16} />
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'live' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilterStatus('live')}
          >
            <Video size={16} />
            Live Now
          </button>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filterStatus === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilterStatus('upcoming')}
          >
            <CalendarDays size={16} />
            Upcoming
          </button>
        </div>
      </div>

      {/* Live classes list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredClasses.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredClasses.map((liveClass) => {
            const status = getClassStatus(liveClass.date, liveClass.time);
            
            return (
              <motion.div
                key={liveClass._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="relative h-40 bg-gray-200">
                  <Image
                    src={liveClass.courseDetails?.course_image || defaultCourseImage}
                    alt={liveClass.title || liveClass.meet_title || "Class"}
                    className="object-cover"
                    fill
                  />
                  <div className={`absolute top-3 right-3 ${status.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {status.label}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {liveClass.title || liveClass.meet_title || "Untitled Class"}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-1">
                    {liveClass.course_name || "Course"}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(liveClass.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{liveClass.time}</span>
                    </div>
                    {liveClass.instructor && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Instructor: {liveClass.instructor.name}</span>
                      </div>
                    )}
                    {liveClass.participants !== undefined && liveClass.maxParticipants && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{liveClass.participants}/{liveClass.maxParticipants} Participants</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                      status.status === "live" 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : status.status === "upcoming" 
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    onClick={() => handleJoinClass(liveClass)}
                    disabled={status.status === "ended"}
                  >
                    {status.status === "live" ? (
                      <>
                        <Play className="w-4 h-4" />
                        Join Now
                      </>
                    ) : status.status === "upcoming" ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Join When Available
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        Class Ended
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Video className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No live classes found</h3>
          <p className="text-gray-500 max-w-md">
            {searchTerm 
              ? "No classes match your search criteria. Try a different search term."
              : filterStatus !== "all" 
                ? `No ${filterStatus} classes available right now. Check back later or view all classes.`
                : "You don't have any scheduled live classes at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default JoinLiveMain; 