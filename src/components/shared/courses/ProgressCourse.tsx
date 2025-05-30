import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Calendar,
  CreditCard,
  BookOpen,
  ArrowRight,
  Star,
  Award,
  Zap,
  Eye,
  Download
} from "lucide-react";

// TypeScript Interfaces
interface ICompletionCriteria {
  required_progress: number;
  required_assignments: boolean;
  required_quizzes: boolean;
}

interface IProgressCourseProps {
  // Core course data
  courseId: string;
  title: string;
  instructor?: string;
  image?: string;
  
  // Progress and status
  progress?: number;
  status?: 'completed' | 'in_progress' | 'not_started';
  lastAccessed?: string;
  
  // Course metadata
  category?: string;
  duration?: string;
  rating?: number;
  skills?: string[];
  enrollmentType?: string;
  
  // Payment and certification
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  isCertified?: boolean;
  
  // Time management
  remainingTime?: string;
  expiryDate?: string;
  
  // Lesson tracking
  completedLessons?: string[];
  totalLessons?: number;
  completionCriteria?: ICompletionCriteria;
  
  // Interaction handlers
  onClick?: () => void;
  onViewMaterials?: () => void;
  onPayment?: () => void;
  onCertificate?: () => void;
  
  // UI state
  isHovered?: boolean;
  className?: string;
}

/**
 * ProgressCourse - Reusable course card component for enrolled courses
 * Displays course progress, status, and provides action buttons
 */
const ProgressCourse: React.FC<IProgressCourseProps> = ({
  courseId,
  title,
  instructor = "Instructor",
  image,
  progress = 0,
  status = 'not_started',
  lastAccessed,
  category = "General",
  duration = "8-12 weeks",
  rating = 4.5,
  skills = [],
  enrollmentType = "Individual",
  paymentStatus,
  isCertified = false,
  remainingTime,
  expiryDate,
  completedLessons = [],
  totalLessons = 0,
  completionCriteria,
  onClick,
  onViewMaterials,
  onPayment,
  onCertificate,
  isHovered = false,
  className = ""
}) => {
  const router = useRouter();

  // Calculate remaining time from expiry date
  const getRemainingTime = (): string => {
    if (expiryDate) {
      const expiryDateObj = new Date(expiryDate);
      const now = new Date();
      const diffTime = expiryDateObj.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Expired';
      if (diffDays === 0) return 'Expires today';
      if (diffDays === 1) return '1 day left';
      if (diffDays < 30) return `${diffDays} days left`;
      
      const diffMonths = Math.ceil(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} left`;
    }
    return remainingTime || 'No limit';
  };

  const timeRemaining = getRemainingTime();

  // Format last accessed date
  const formatLastAccessed = (date?: string): string => {
    if (!date) return 'Recently';
    const lastAccessedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastAccessedDate.getTime());
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
    return lastAccessedDate.toLocaleDateString();
  };

  // Handle card click
  const handleCardClick = (): void => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation
      router.push(`/integrated-lessons/${courseId}`);
    }
  };

  // Handle button clicks
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, action: 'primary' | 'secondary'): void => {
    e.stopPropagation(); // Prevent card click event from firing
    
    if (action === 'primary') {
      if (paymentStatus === 'pending' && onPayment) {
        onPayment();
      } else if (status === 'completed' && isCertified && onCertificate) {
        onCertificate();
      } else if (onClick) {
        onClick();
      } else {
        router.push(`/integrated-lessons/${courseId}`);
      }
    } else {
      // Secondary action - view materials
      if (onViewMaterials) {
        onViewMaterials();
      } else {
        router.push(`/course-materials/${courseId}`);
      }
    }
  };

  // Generate display skills
  const displaySkills = skills.length > 0 ? skills : [category, enrollmentType];

  // Get appropriate icon for enrollment type
  const getTypeIcon = () => {
    switch (enrollmentType) {
      case 'Live':
        return <Zap className="w-3 h-3 mr-1" />;
      case 'Blended':
        return <BookOpen className="w-3 h-3 mr-1" />;
      case 'Self-Paced':
        return <Clock className="w-3 h-3 mr-1" />;
      default:
        return <BookOpen className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer ${className}`}
      onClick={handleCardClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header Section - Title and Status Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-3 min-h-[4.5rem] sm:min-h-[4.5rem] leading-relaxed">
            {title}
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              by {instructor}
            </p>
            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {status === 'completed' ? 'Completed' : 'Enrolled'} {formatLastAccessed(lastAccessed)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="truncate">{timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0">
          {status === 'completed' ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : status === 'in_progress' ? (
            <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          ) : (
            <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Skills/Tags Section */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-start">
          {displaySkills.map((skill: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full"
            >
              {getTypeIcon()}
              {skill}
            </span>
          ))}
          {isCertified && (
            <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              <Award className="w-3 h-3 mr-1" />
              Certified
            </span>
          )}
          {paymentStatus === 'pending' && (
            <span className="inline-flex items-center px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
              <CreditCard className="w-3 h-3 mr-1" />
              Payment Pending
            </span>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4 min-h-[3.5rem] flex flex-col justify-center">
        {status === 'in_progress' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Progress</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {progress < 25 ? 'Just getting started' : 
               progress < 50 ? 'Making good progress' :
               progress < 75 ? 'More than halfway there' :
               progress < 100 ? 'Almost complete' : 'Completed'}
            </div>
            {totalLessons > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {completedLessons.length} of {totalLessons} lessons completed
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full py-2">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {status === 'completed' ? 'Course Completed' : 'Ready to Begin'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {status === 'completed' ? 'Well done!' : 'Start your learning journey'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating and Status Section */}
      <div className="flex items-center justify-between mb-6 py-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {rating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">rating</span>
        </div>
        <div className={`flex items-center space-x-1 ${
          status === 'completed' 
            ? 'text-green-600 dark:text-green-400'
            : status === 'in_progress'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
        }`}>
          {status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Completed</span>
            </>
          ) : status === 'in_progress' ? (
            <>
              <PlayCircle className="w-4 h-4" />
              <span className="text-sm font-medium">In Progress</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Not Started</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons - Always at bottom */}
      <div className="flex space-x-3 mt-auto">
        <button 
          onClick={(e) => handleButtonClick(e, 'secondary')}
          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          {status === 'completed' ? 'Review' : 'Materials'}
        </button>
        
        <button 
          onClick={(e) => handleButtonClick(e, 'primary')}
          className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
            paymentStatus === 'pending'
              ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm hover:shadow-md'
              : status === 'completed' && isCertified
                ? 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow-md'
                : status === 'completed'
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
          }`}
        >
          {paymentStatus === 'pending' ? (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </>
          ) : status === 'completed' && isCertified ? (
            <>
              <Award className="w-4 h-4 mr-2" />
              Certificate
            </>
          ) : status === 'completed' ? (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProgressCourse; 