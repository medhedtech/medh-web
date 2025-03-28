"use client";
import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Reactimg from "@/assets/images/courses/React.jpeg";
import Preloader from "@/components/shared/others/Preloader";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { LucideBookOpen, LucideCalendar, LucideClock } from "lucide-react";
import { AxiosError } from "axios";

// Types
interface CourseDetails {
  course_image: string;
  course_title: string;
  course_description?: string;
}

interface MainClass {
  id: string;
  meet_title: string;
  meeting_tag: string;
  courseDetails?: CourseDetails;
  date?: string;
  time?: string;
}

interface ApiResponse {
  meetings: MainClass[];
}

// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-6 relative flex flex-col h-full">
    <div className="rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700 h-48 animate-pulse" />
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse" />
    <div className="mt-auto space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-10 px-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg text-center flex flex-col items-center justify-center"
  >
    <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-md mb-6">
      <LucideBookOpen size={60} className="text-blue-500 dark:text-blue-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
      No Main Classes Found
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
      You don't have any main classes scheduled at the moment.
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Your main classes will appear here once they're scheduled.
    </p>
  </motion.div>
);

const MainClassCard: React.FC<{ classItem: MainClass }> = ({ classItem }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-6 relative flex flex-col h-full transition-all duration-300"
  >
    <div className="rounded-xl overflow-hidden mb-4 relative group">
      <Image
        src={classItem.courseDetails?.course_image || Reactimg}
        alt={classItem.meet_title || "Class Image"}
        className="w-full h-48 object-cover rounded-xl transform group-hover:scale-110 transition-all duration-300"
        width={300}
        height={200}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2">
      {`${classItem.courseDetails?.course_title || "No Course Title"} (${
        classItem.meet_title || "No Meeting Title"
      })`}
    </h3>

    {classItem.courseDetails?.course_description && (
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {classItem.courseDetails.course_description}
      </p>
    )}

    {(classItem.date || classItem.time) && (
      <div className="mt-auto space-y-2">
        {classItem.date && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <LucideCalendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{classItem.date}</span>
          </div>
        )}
        {classItem.time && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <LucideClock className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{classItem.time}</span>
          </div>
        )}
      </div>
    )}
  </motion.div>
);

const InstructorMainClasses: React.FC = () => {
  const [classes, setClasses] = useState<MainClass[]>([]);
  const [instructorId, setInstructorId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { getQuery, loading } = useGetQuery();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setInstructorId(storedUserId);
      } else {
        setErrorMessage("No instructor ID found. Please log in again.");
      }
    }
  }, []);

  useEffect(() => {
    if (instructorId) {
      const fetchMainClasses = async () => {
        try {
          await getQuery({
            url: `${apiUrls.onlineMeeting.getMeetingsByInstructorId}/${instructorId}`,
            onSuccess: (res: ApiResponse) => {
              const mainClasses = res.meetings?.filter(
                (classItem) => classItem.meeting_tag === "main"
              ) || [];
              setClasses(mainClasses);
              setErrorMessage("");
              setIsInitialLoad(false);
            },
            onFail: (err) => {
              console.error("Error fetching main classes:", err);
              const axiosError = err as AxiosError<{ message: string }>;
              setErrorMessage(
                axiosError.response?.data?.message ||
                "Failed to fetch main classes. Please try again."
              );
              setIsInitialLoad(false);
            },
          });
        } catch (error) {
          console.error("Error in fetchMainClasses:", error);
          setIsInitialLoad(false);
        }
      };

      fetchMainClasses();
    }
  }, [instructorId, getQuery]);

  if (isInitialLoad) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-6 md:px-10 py-10"
    >
      <div className="flex justify-between items-center pt-4 mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Main Classes
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
          >
            <p className="text-red-600 dark:text-red-400 flex items-center">
              <LucideBookOpen className="w-5 h-5 mr-2" />
              {errorMessage}
            </p>
          </motion.div>
        ) : null}

        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <Suspense fallback={<LoadingSkeleton />}>
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <MainClassCard key={classItem.id} classItem={classItem} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState />
              </div>
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InstructorMainClasses; 