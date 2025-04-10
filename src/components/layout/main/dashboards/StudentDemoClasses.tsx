"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { 
  LucideCalendar, 
  LucideClock, 
  LucideUser, 
  LucideBookOpen,
  LucideFilter,
  LucideBarChart,
  LucideBookmark,
  LucideVideo,
  LucideChevronRight,
  LucideInfo,
  LucideExternalLink,
  LucideCheck,
  LucidePlus
} from "lucide-react";

// Component imports
import LoadingIndicator from "@/components/shared/loaders/LoadingIndicator";
import EmptyState from "@/components/shared/others/EmptyState";
import TabNavigation from "@/components/shared/navigation/TabNavigation";
import SearchBar from "@/components/shared/inputs/SearchBar";
import Badge from "@/components/shared/elements/Badge";
import Button from "@/components/shared/buttons/Button";
import Select from "@/components/shared/inputs/Select";
import Avatar from "@/components/shared/elements/Avatar";
import Card from "@/components/shared/containers/Card";
import Modal from "@/components/shared/modals/Modal";
import LiveDemoClass from "./LiveDemoClass";
import RecordedSessions from "./RecordedSessions";

// Default image for classes without images
import DefaultClassImage from "@/assets/images/courses/image1.png";

// Types
interface DemoClass {
  _id: string;
  meet_title: string;
  date: string;
  time: string;
  meet_link: string;
  meeting_tag: string;
  instructor_name?: string;
  description?: string;
  duration?: string;
  status?: string;
  category?: string;
  participants?: number;
  prerequisites?: string[];
  courseDetails?: {
    course_image: string;
    course_title: string;
  };
}

interface ApiResponse {
  meetings: DemoClass[];
}

interface FilterState {
  category: string;
  status: string;
  instructor: string;
  searchTerm: string;
}

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
    transition: { duration: 0.5 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

/**
 * StudentDemoClasses - Component for displaying and managing demo classes
 */
const StudentDemoClasses: React.FC = () => {
  const router = useRouter();
  const { getQuery, loading } = useGetQuery();
  
  // State management
  const [classes, setClasses] = useState<DemoClass[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedClass, setSelectedClass] = useState<DemoClass | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Filter and search state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    status: "all",
    instructor: "all",
    searchTerm: ""
  });
  
  // Categories and statuses for filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<string[]>([]);
  const statuses = ["all", "upcoming", "live", "completed"];
  
  // Fetch user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);
  
  // Fetch demo classes data
  useEffect(() => {
    if (!userId) return;
    
    const fetchDemoClasses = async () => {
      try {
        getQuery({
          url: `${apiUrls?.onlineMeeting?.getAllMeetings}`,
          onSuccess: (res: ApiResponse) => {
            // Filter only demo classes
            const demoClasses = (res?.meetings || []).filter(
              (classItem) => classItem.meeting_tag === "demo"
            );
            
            setClasses(demoClasses);
            
            // Extract unique categories and instructors for filters
            const uniqueCategories = [...new Set(demoClasses.map(item => item.category || "Uncategorized"))];
            const uniqueInstructors = [...new Set(demoClasses.map(item => item.instructor_name || "Unknown"))];
            
            setCategories(["all", ...uniqueCategories]);
            setInstructors(["all", ...uniqueInstructors]);
            
            setErrorMessage("");
          },
          onFail: (err) => {
            console.error("Error fetching demo classes:", err);
            setErrorMessage("Failed to load demo classes. Please try again later.");
          }
        });
      } catch (error) {
        console.error("Error in demo classes fetch:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    };
    
    fetchDemoClasses();
  }, [userId, getQuery]);
  
  // Format date with user-friendly formatting
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, MMMM do, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Format time to 12-hour format with AM/PM
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(":");
      return format(new Date().setHours(parseInt(hours, 10), parseInt(minutes, 10)), "h:mm a");
    } catch (error) {
      return timeString;
    }
  };
  
  // Function to determine class status
  const getClassStatus = (classItem: DemoClass): string => {
    if (classItem.status) return classItem.status;
    
    const classDate = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    
    // If class is today and within 1 hour window (before or after)
    if (
      classDate.getDate() === now.getDate() &&
      classDate.getMonth() === now.getMonth() &&
      classDate.getFullYear() === now.getFullYear() &&
      Math.abs(classDate.getTime() - now.getTime()) <= 60 * 60 * 1000
    ) {
      return "live";
    }
    
    // If class is in the past
    if (classDate < now) {
      return "completed";
    }
    
    // Otherwise, it's upcoming
    return "upcoming";
  };
  
  // Apply filters to the classes
  const filteredClasses = classes.filter((classItem) => {
    // Filter by active tab (status)
    if (activeTab !== "all" && getClassStatus(classItem) !== activeTab) {
      return false;
    }
    
    // Apply category filter
    if (filters.category !== "all" && classItem.category !== filters.category) {
      return false;
    }
    
    // Apply instructor filter
    if (filters.instructor !== "all" && classItem.instructor_name !== filters.instructor) {
      return false;
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        classItem.meet_title.toLowerCase().includes(searchLower) ||
        (classItem.description || "").toLowerCase().includes(searchLower) ||
        (classItem.instructor_name || "").toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Handle opening the class details modal
  const handleViewDetails = (classItem: DemoClass) => {
    setSelectedClass(classItem);
    setIsDetailsModalOpen(true);
  };
  
  // Handle class registration
  const handleRegister = (classItem: DemoClass) => {
    setSelectedClass(classItem);
    setIsRegistrationModalOpen(true);
  };
  
  // Confirm registration process
  const confirmRegistration = async () => {
    if (!selectedClass) return;
    
    setRegistering(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      // In a real implementation, you would make an API call here
      setIsRegistered(true);
      setRegistering(false);
      
      // Close modal after short delay
      setTimeout(() => {
        setIsRegistrationModalOpen(false);
        
        // Add to calendar option would go here
      }, 1000);
    }, 1500);
  };
  
  // Handle adding to calendar
  const handleAddToCalendar = () => {
    if (!selectedClass) return;
    
    // Create calendar event details
    const startDate = new Date(`${selectedClass.date}T${selectedClass.time}`);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + (parseInt(selectedClass.duration || "60", 10)));
    
    // Format for Google Calendar
    const gcalUrl = encodeURI([
      "https://calendar.google.com/calendar/render",
      "?action=TEMPLATE",
      `&text=${selectedClass.meet_title}`,
      `&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}`,
      `&details=${selectedClass.description || "Demo class"}`,
      "&sprop=&sprop=name:"
    ].join(""));
    
    // Open in new tab
    window.open(gcalUrl, "_blank");
  };
  
  // Join a live class
  const handleJoinClass = () => {
    if (!selectedClass || !selectedClass.meet_link) return;
    
    window.open(selectedClass.meet_link, "_blank");
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Get color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Render a demo class card
  const renderClassCard = (classItem: DemoClass) => {
    const status = getClassStatus(classItem);
    const statusColor = getStatusColor(status);
    
    return (
      <motion.div
        key={classItem._id}
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="relative overflow-hidden">
          <Image
            src={classItem.courseDetails?.course_image || DefaultClassImage}
            alt={classItem.meet_title}
            width={400}
            height={200}
            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
              {status === "live" ? "LIVE NOW" : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {classItem.meet_title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideCalendar className="w-4 h-4 mr-2 text-primary-500" />
              <span>{formatDate(classItem.date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <LucideClock className="w-4 h-4 mr-2 text-primary-500" />
              <span>{formatTime(classItem.time)}</span>
              {classItem.duration && <span className="ml-1">• {classItem.duration} mins</span>}
            </div>
            
            {classItem.instructor_name && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LucideUser className="w-4 h-4 mr-2 text-primary-500" />
                <span>{classItem.instructor_name}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleViewDetails(classItem)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/10 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View Details
            </button>
            
            {status === "live" ? (
              <button
                onClick={() => handleJoinClass()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Join Now
              </button>
            ) : status === "upcoming" ? (
              <button
                onClick={() => handleRegister(classItem)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Register
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboards/student/recorded-sessions")}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                View Recording
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Demo Classes
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore upcoming demo classes, register, and attend live sessions.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <TabNavigation
          tabs={[
            { id: "upcoming", label: "Upcoming" },
            { id: "live", label: "Live Now" },
            { id: "completed", label: "Completed" },
            { id: "all", label: "All Classes" }
          ]}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search demo classes..."
            value={filters.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("searchTerm", e.target.value)}
            onClear={() => handleFilterChange("searchTerm", "")}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            label="Category"
            options={categories.map(cat => ({ value: cat, label: cat === "all" ? "All Categories" : cat }))}
            value={filters.category}
            onChange={(value: string) => handleFilterChange("category", value)}
            className="w-full sm:w-40"
          />
          
          <Select
            label="Instructor"
            options={instructors.map(ins => ({ value: ins, label: ins === "all" ? "All Instructors" : ins }))}
            value={filters.instructor}
            onChange={(value: string) => handleFilterChange("instructor", value)}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <LucideInfo className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Demo Classes Grid */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingIndicator type="spinner" size="lg" color="primary" text="Loading demo classes..." />
        </div>
      ) : filteredClasses.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredClasses.map(renderClassCard)}
        </motion.div>
      ) : (
        <EmptyState
          icon={<LucideBookOpen size={48} />}
          title="No demo classes found"
          description={activeTab === "all" ? "There are no demo classes available right now." : `No ${activeTab} demo classes available.`}
          action={{
            label: "Check again later",
            onClick: () => setActiveTab("all")
          }}
        />
      )}
      
      {/* Class Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedClass && (
          <Modal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title="Demo Class Details"
            size="lg"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={selectedClass.courseDetails?.course_image || DefaultClassImage}
                  alt={selectedClass.meet_title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="absolute top-4 right-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(getClassStatus(selectedClass))}`}>
                    {getClassStatus(selectedClass).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedClass.meet_title}
                </h2>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideCalendar className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{formatDate(selectedClass.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <LucideClock className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{formatTime(selectedClass.time)}</span>
                    {selectedClass.duration && <span className="ml-1">• {selectedClass.duration} mins</span>}
                  </div>
                  
                  {selectedClass.instructor_name && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <LucideUser className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedClass.instructor_name}</span>
                    </div>
                  )}
                  
                  {selectedClass.category && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <LucideBookmark className="w-5 h-5 mr-3 text-primary-500" />
                      <span>{selectedClass.category}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedClass.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedClass.description}
                  </p>
                </div>
              )}
              
              {selectedClass.prerequisites && selectedClass.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Prerequisites</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    {selectedClass.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {getClassStatus(selectedClass) === "live" ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleJoinClass}
                    leftIcon={<LucideVideo size={18} />}
                  >
                    Join Live Class
                  </Button>
                ) : getClassStatus(selectedClass) === "upcoming" ? (
                  <>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        setTimeout(() => handleRegister(selectedClass), 300);
                      }}
                      leftIcon={<LucidePlus size={18} />}
                    >
                      Register for Class
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleAddToCalendar}
                      leftIcon={<LucideCalendar size={18} />}
                    >
                      Add to Calendar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/dashboards/student/recorded-sessions")}
                    leftIcon={<LucideVideo size={18} />}
                  >
                    View Recording
                  </Button>
                )}
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Registration Modal */}
      <AnimatePresence>
        {isRegistrationModalOpen && selectedClass && (
          <Modal
            isOpen={isRegistrationModalOpen}
            onClose={() => !registering && setIsRegistrationModalOpen(false)}
            title="Register for Demo Class"
            size="md"
          >
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {!isRegistered ? (
                <>
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg">
                    <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">
                      {selectedClass.meet_title}
                    </h3>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                      <LucideCalendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span>{formatDate(selectedClass.date)} at {formatTime(selectedClass.time)}</span>
                    </div>
                    {selectedClass.instructor_name && (
                      <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm mt-1">
                        <LucideUser className="w-4 h-4 mr-2 text-primary-500" />
                        <span>Instructor: {selectedClass.instructor_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Would you like to register for this demo class? You'll receive a confirmation email with joining details.
                  </p>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsRegistrationModalOpen(false)}
                      disabled={registering}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmRegistration}
                      loading={registering}
                      loadingText="Registering..."
                    >
                      Confirm Registration
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <LucideCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You've successfully registered for the demo class. A confirmation email has been sent to your registered email address.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={handleAddToCalendar}
                      leftIcon={<LucideCalendar size={18} />}
                    >
                      Add to Calendar
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => setIsRegistrationModalOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDemoClasses; 