import React from "react";
import Image from "next/image";
import AiMl from "@/assets/images/courses/Ai&Ml.jpeg";
import { motion } from "framer-motion";
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
  BrainCircuit
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
  quiz_submissions = []
}) => {
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

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
          {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
        </div>
      </div>

      {/* Live/Self-paced Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
        {isLive ? (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-white">Live</span>
          </>
        ) : (
          <>
            <BookOpen className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">Self-paced</span>
          </>
        )}
      </div>

      {/* Course Image */}
      <div className="relative w-full h-48 group">
        <Image
          src={displayImage}
          alt={title || "Course thumbnail"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = AiMl.src;
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white opacity-75 hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h3>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress === 100 
                  ? 'bg-green-500' 
                  : progress > 50 
                    ? 'bg-primary-500' 
                    : 'bg-yellow-500'
              }`}
            />
          </div>
        </div>

        {/* Course Stats */}
        <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
          {/* Last Accessed */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last accessed: {formatLastAccessed(lastAccessed)}</span>
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-2">
            <CreditCard className={`w-4 h-4 ${getPaymentStatusColor(paymentStatus)}`} />
            <span className={getPaymentStatusColor(paymentStatus)}>
              Payment: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </span>
          </div>

          {/* Remaining Time */}
          {remainingTime && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{remainingTime}</span>
            </div>
          )}

          {/* Enrollment Type & Batch Size */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="capitalize">
              {enrollmentType} {enrollmentType === 'batch' && batchSize ? `(${batchSize} students)` : 'enrollment'}
            </span>
          </div>

          {/* Learning Path */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="capitalize">{learningPath} learning</span>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-2">
            {/* Lessons Progress */}
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{completedLessons.length}/{totalLessons} lessons</span>
            </div>

            {/* Assignments Progress */}
            {completionCriteria?.required_assignments && (
              <div className="flex items-center gap-1">
                <PenTool className="w-4 h-4" />
                <span>{completedAssignments.length} assignments</span>
              </div>
            )}

            {/* Quizzes Progress */}
            {completionCriteria?.required_quizzes && (
              <div className="flex items-center gap-1">
                <BrainCircuit className="w-4 h-4" />
                <span>{completedQuizzes.length} quizzes</span>
              </div>
            )}

            {/* Notes & Bookmarks */}
            <div className="flex items-center gap-1">
              <BookmarkCheck className="w-4 h-4" />
              <span>{notes.length + bookmarks.length} saved items</span>
            </div>
          </div>

          {/* Completion Requirements Alert */}
          {!status === 'completed' && (completionCriteria?.required_assignments || completionCriteria?.required_quizzes) && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">Completion Requirements:</p>
                <ul className="mt-1 list-disc list-inside text-yellow-600 dark:text-yellow-500">
                  {completionCriteria?.required_progress && !hasMetProgress && (
                    <li>Complete {completionCriteria.required_progress}% of course content</li>
                  )}
                  {completionCriteria?.required_assignments && !hasMetAssignments && (
                    <li>Submit required assignments</li>
                  )}
                  {completionCriteria?.required_quizzes && !hasMetQuizzes && (
                    <li>Complete required quizzes</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Continue Learning Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-4 w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            paymentStatus === 'pending'
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : status === 'completed'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
          disabled={paymentStatus === 'pending'}
        >
          {paymentStatus === 'pending' ? (
            <>
              <CreditCard className="w-4 h-4" />
              Complete Payment
            </>
          ) : status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              {is_certified ? 'View Certificate' : 'Review Course'}
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              Continue Learning
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EnrollCoursesCard;
