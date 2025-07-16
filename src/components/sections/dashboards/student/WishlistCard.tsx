"use client";
import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  Users,
  Star,
  GraduationCap,
  Play,
  Heart,
  X,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Eye,
  Award,
  BookOpen,
  ChevronRight,
  Bell,
  BellOff
} from "lucide-react";
import OptimizedImage from '@/components/shared/OptimizedImage';

// Types
interface WishlistCourse {
  id: string;
  title: string;
  category: string;
  image: string;
  duration: string;
  sessions: number;
  class_type: string;
  category_type: string;
  status: string;
  description: string;
  pricing: {
    currency: string;
    individual: number;
    batch: number;
  };
  meta: {
    views: number;
    ratings: {
      average: number;
      count: number;
    };
    enrollments: number;
  };
  wishlist_info: {
    addedAt: string;
    notificationPreference: {
      priceDrops: boolean;
      startDate: boolean;
    };
  };
}

interface WishlistCardProps {
  course: WishlistCourse;
  onRemove: (courseId: string) => void;
  onToggleNotifications: (courseId: string, type: 'priceDrops' | 'startDate') => void;
  isRemoving?: boolean;
  index?: number;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  course,
  onRemove,
  onToggleNotifications,
  isRemoving = false,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isNavigating, setIsNavigating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Determine course type and styling
  const getCourseTypeInfo = () => {
    const classType = course.class_type?.toLowerCase() || '';
    const categoryType = course.category_type?.toLowerCase() || '';
    
    if (classType.includes('blended')) {
      return {
        type: 'blended',
        badge: 'Blended Learning',
        icon: <BookOpen className="w-3 h-3" />,
        gradient: 'from-purple-500 to-indigo-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-700/50'
      };
    } else if (classType.includes('live')) {
      return {
        type: 'live',
        badge: 'Live Course',
        icon: <Users className="w-3 h-3" />,
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-200 dark:border-emerald-700/50'
      };
    } else {
      return {
        type: 'self-paced',
        badge: 'Self-Paced',
        icon: <Play className="w-3 h-3" />,
        gradient: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-700/50'
      };
    }
  };

  const courseTypeInfo = getCourseTypeInfo();

  // Format functions
  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return `${currency} ${price.toLocaleString()}`;
  };

  const formatAddedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Added today';
    if (diffDays <= 7) return `Added ${diffDays} days ago`;
    return `Added on ${date.toLocaleDateString()}`;
  };

  // Event handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const handleNavigate = useCallback(async () => {
    setIsNavigating(true);
    try {
      await router.push(`/course-details/${course.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setTimeout(() => setIsNavigating(false), 1000);
    }
  }, [course.id, router]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(course.id);
  }, [course.id, onRemove]);

  const handleToggleNotification = useCallback((e: React.MouseEvent, type: 'priceDrops' | 'startDate') => {
    e.stopPropagation();
    onToggleNotifications(course.id, type);
  }, [course.id, onToggleNotifications]);

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden
        border border-gray-200 dark:border-gray-700 
        shadow-sm hover:shadow-md
        transition-all duration-200 ease-out cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleNavigate}
    >
      {/* Image Section */}
      <div className="relative h-32 sm:h-36 overflow-hidden">
        <OptimizedImage
          src={course.image}
          alt={course.title}
          fill={true}
          className="object-cover transition-all duration-300 ease-out group-hover:scale-105"
          quality={index < 2 ? 95 : 85}
          priority={index < 2}
          loading={index < 2 ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30" />
        
        {/* Course type badge */}
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-medium
          bg-gradient-to-r ${courseTypeInfo.gradient} text-white`}>
          <div className="flex items-center gap-1">
            {courseTypeInfo.icon}
            <span className="font-semibold">{courseTypeInfo.badge}</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className={`absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded text-xs font-medium
          ${course.status === 'Published' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'}`}>
          {course.status}
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className={`absolute top-8 right-2 z-20 p-1.5 rounded-full
            ${isRemoving ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'} 
            text-white shadow-md transition-all duration-200 ease-out
            opacity-0 group-hover:opacity-100
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Remove from wishlist"
        >
          {isRemoving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Title and Category */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
            {course.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <Award className="w-3 h-3" />
            <span>{course.category}</span>
          </div>
        </div>

        {/* Course Info - Simplified */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            <span>{course.sessions} Sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{course.meta.ratings.average || 'N/A'}</span>
          </div>
        </div>

        {/* Price and Date */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(course.pricing.individual, course.pricing.currency)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatAddedDate(course.wishlist_info.addedAt)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Simplified notification toggles */}
            <button
              onClick={(e) => handleToggleNotification(e, 'priceDrops')}
              className={`p-1 rounded transition-colors ${
                course.wishlist_info.notificationPreference.priceDrops
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
              title="Price drop notifications"
            >
              {course.wishlist_info.notificationPreference.priceDrops ? (
                <Bell className="w-3 h-3" />
              ) : (
                <BellOff className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={(e) => handleToggleNotification(e, 'startDate')}
              className={`p-1 rounded transition-colors ${
                course.wishlist_info.notificationPreference.startDate
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
              title="Start date notifications"
            >
              <Calendar className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>


      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30 rounded-lg">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default WishlistCard;