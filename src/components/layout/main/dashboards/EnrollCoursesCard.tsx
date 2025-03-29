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
  ChevronRight,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Zap
} from "lucide-react";
import { ReactNode } from "react";

interface CompletionCriteria {
  required_progress: number;
  required_assignments: boolean;
  required_quizzes: boolean;
}

interface EnrollCoursesCardProps {
  title?: string;
  image?: string;
  isLive?: boolean;
  progress?: number;
  lastAccessed?: string;
  status?: 'completed' | 'in_progress' | 'not_started';
  onClick?: () => void;
  isHovered?: boolean;
  paymentStatus?: string;
  remainingTime?: string;
  completionCriteria?: CompletionCriteria;
  completedLessons?: string[];
  totalLessons?: number;
  enrollmentType?: string;
  learningPath?: string;
  batchSize?: number;
  completedAssignments?: string[];
  completedQuizzes?: string[];
  is_certified?: boolean;
  notes?: any[];
  bookmarks?: any[];
  assignment_submissions?: any[];
  quiz_submissions?: any[];
  courseId?: string;
  typeIcon?: ReactNode;
}

const EnrollCoursesCard: React.FC<EnrollCoursesCardProps> = ({ 
  title = "Untitled Course", 
  image, 
  isLive, 
  progress = 0, 
  lastAccessed, 
  status = 'not_started', 
  onClick,
  paymentStatus = 'completed',
  remainingTime = 'No limit',
  completionCriteria,
  completedLessons = [],
  totalLessons = 0,
  enrollmentType = 'Self-paced',
  courseId,
  typeIcon,
  is_certified
}) => {
  const router = useRouter();
  const displayImage = image || AiMl;

  const formatLastAccessed = (date?: string): string => {
    if (!date) return 'Not started yet';
    const lastAccessed = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastAccessed.getTime());
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

  // Handle click on the card
  const handleCardClick = (): void => {
    if (onClick) {
      onClick();
    }
  };

  // Handle click on the button
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Prevent card click event from firing
    
    const id = courseId || (onClick && onClick.toString().match(/\/([^\/]+)'\)/) ? onClick.toString().match(/\/([^\/]+)'\)/)?.[1] : null);
    
    if (id) {
      if (paymentStatus === 'pending') {
        router.push(`/payment/${id}`);
      } else if (status === 'completed' && is_certified) {
        router.push(`/certificate/${id}`);
      } else {
        router.push(`/integrated-lessons/${id}`);
      }
    }
  };

  // Custom status display component
  const StatusBadge = () => {
    if (status === 'completed') {
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-gradient-to-r from-green-500/80 to-emerald-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Completed</span>
        </div>
      );
    } else if (status === 'in_progress') {
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute animate-ping"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white relative"></div>
          </div>
          <span>In Progress</span>
        </div>
      );
    } else {
      return (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-gradient-to-r from-gray-600/80 to-gray-700/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Not Started</span>
        </div>
      );
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="group relative bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden h-full border border-gray-100/50 dark:border-gray-700/30 shadow-md hover:shadow-xl transition-all duration-500"
    >
      {/* Decorative elements */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-primary-600/10 rounded-full blur-2xl transform transition-all duration-500 group-hover:scale-150 group-hover:opacity-70 z-0"></div>
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-gradient-to-tr from-indigo-400/10 to-blue-600/5 rounded-full blur-2xl transform transition-all duration-500 group-hover:scale-150 group-hover:opacity-70 z-0"></div>
      
      {/* Course Image Container */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={displayImage}
          alt={title || "Course thumbnail"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-110"
          onError={(e) => {
            e.currentTarget.src = AiMl.src;
          }}
        />
        
        {/* Image overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-80" />
        
        <StatusBadge />

        {/* Live/Enrollment Type Badge */}
        <div className="absolute top-4 left-4 z-10">
          {isLive ? (
            <div className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-gradient-to-r from-red-500/80 to-rose-600/80 text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping absolute"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full relative"></span>
              <span>LIVE</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-gradient-to-r from-gray-900/90 to-gray-800/90 text-white border border-white/10 flex items-center gap-2 shadow-sm">
              {typeIcon || <BookOpen className="w-3 h-3" />}
              <span>{enrollmentType}</span>
            </div>
          )}
        </div>

        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 tracking-tight group-hover:text-primary-200 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-5 relative z-10">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
            <span className="font-bold text-primary-600 dark:text-primary-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress === 100 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-primary-400 to-primary-600'
              }`}
            />
          </div>
        </div>

        {/* Course Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Lessons Progress */}
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100/80 dark:border-gray-700/30 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-primary-500" />
              <span>Lessons</span>
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-white">
              {completedLessons.length}/{totalLessons}
            </p>
          </div>

          {/* Time Remaining */}
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/30 rounded-xl p-3 border border-gray-100/80 dark:border-gray-700/30 shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              <span>Remaining</span>
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">
              {remainingTime || 'No limit'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleButtonClick}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md transition-all duration-300 ${
            paymentStatus === 'pending'
              ? 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' 
              : status === 'completed' 
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' 
                : status === 'in_progress'
                  ? 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 border border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
          }`}
        >
          {paymentStatus === 'pending' ? (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Complete Payment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </>
          ) : status === 'completed' ? (
            <>
              {is_certified ? <Award className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{is_certified ? 'View Certificate' : 'Review Course'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </>
          ) : status === 'in_progress' ? (
            <>
              <Zap className="w-4 h-4" />
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-0 group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        {/* Last accessed indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1 group-hover:text-primary-500 transition-colors duration-300">
          <Clock className="w-3 h-3 mr-1" />
          <span>Last accessed: {formatLastAccessed(lastAccessed)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollCoursesCard;