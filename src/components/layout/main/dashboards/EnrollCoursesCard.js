import React from "react";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Calendar,
  CreditCard,
  BookOpen,
  GraduationCap,
  Users,
  AlertCircle,
  BookmarkCheck,
  PenTool,
  BrainCircuit,
  ChevronRight
} from "lucide-react";

const EnrollCoursesCard = ({ 
  title, 
  image, 
  isLive, 
  progress, 
  lastAccessed, 
  status, 
  onClick,
  isHovered,
  paymentStatus,
  remainingTime,
  completionCriteria,
  completedLessons = [],
  totalLessons = 0,
  enrollmentType,
  learningPath,
  batchSize,
  completedAssignments = [],
  completedQuizzes = [],
  is_certified,
  notes = [],
  bookmarks = [],
  assignment_submissions = [],
  quiz_submissions = [],
  courseId
}) => {
  const router = useRouter();
  const displayImage = image || AiMl;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'not_started':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatLastAccessed = (date) => {
    if (!date) return 'Not started yet';
    const lastAccessed = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - lastAccessed);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return lastAccessed.toLocaleDateString();
  };

  // Calculate completion requirements
  const hasMetProgress = progress >= (completionCriteria?.required_progress || 100);
  const hasMetAssignments = !completionCriteria?.required_assignments || 
    (completedAssignments && completedAssignments.length > 0);
  const hasMetQuizzes = !completionCriteria?.required_quizzes || 
    (completedQuizzes && completedQuizzes.length > 0);

  // Handle click on the card
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Handle click on the button
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    
    const id = courseId || (onClick && onClick.toString().match(/\/([^\/]+)'\)/) ? onClick.toString().match(/\/([^\/]+)'\)/)[1] : null);
    
    if (id) {
      if (paymentStatus === 'pending') {
        // Navigate to payment completion page
        router.push(`/payment/${id}`);
      } else if (status === 'completed' && is_certified) {
        // Navigate to certificate view
        router.push(`/certificate/${id}`);
      } else {
        // Navigate to integrated lessons page
        router.push(`/integrated-lessons/${id}`);
      }
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50"
    >
      {/* Course Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={displayImage}
          alt={title || "Course thumbnail"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = AiMl.src;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-2 ${
            status === 'completed' 
              ? 'bg-green-500/90 text-white' 
              : status === 'in_progress' 
                ? 'bg-primary-500/90 text-white' 
                : 'bg-gray-500/90 text-white'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              status === 'completed' 
                ? 'bg-white' 
                : status === 'in_progress'
                  ? 'bg-white animate-pulse'
                  : 'bg-white'
            }`} />
            {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
          </div>
        </div>

        {/* Live/Self-paced Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-black/50 text-white flex items-center gap-2">
            {isLive ? (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></span>
                <span className="w-2 h-2 bg-red-500 rounded-full relative"></span>
                <span>Live Course</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3 h-3" />
                <span>Self-paced</span>
              </>
            )}
          </div>
        </div>

        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-200 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Course Progress</span>
            <span className="font-semibold text-primary-500">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress === 100 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : 'bg-gradient-to-r from-primary-400 to-primary-500'
              }`}
            />
          </div>
        </div>

        {/* Course Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lessons Progress */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <BookOpen className="w-4 h-4 text-primary-500" />
              <span>Lessons</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {completedLessons.length}/{totalLessons}
            </p>
          </div>

          {/* Time Remaining */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>Remaining</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
              {remainingTime || 'No limit'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleButtonClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
            paymentStatus === 'pending'
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-500/25'
              : status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25'
          }`}
        >
          {paymentStatus === 'pending' ? (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Complete Payment</span>
              <ChevronRight className="w-5 h-5" />
            </>
          ) : status === 'completed' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>{is_certified ? 'View Certificate' : 'Review Course'}</span>
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              <span>Continue Learning</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EnrollCoursesCard;
