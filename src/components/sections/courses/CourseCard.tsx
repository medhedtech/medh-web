"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  Play,
  BookOpen,
  Award,
  Tag,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { generateCoursePlaceholder, getCategoryColor, shimmer, toBase64 } from "@/utils/imageUtils";

// Types
interface IPrice {
  _id?: string;
  individual: number;
  batch: number;
  min_batch_size?: number;
  max_batch_size?: number;
  early_bird_discount?: number;
  group_discount?: number;
  is_active?: boolean;
  currency?: string;
}

interface ICourse {
  _id: string;
  course_title: string;
  course_image?: string;
  course_category: string;
  course_description?: string;
  course_fee: number;
  course_grade?: string;
  class_type?: string;
  course_duration?: string;
  course_sessions?: string;
  no_of_Sessions?: number;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  isFree?: boolean;
  prices?: IPrice[];
  original_fee?: number;
  batchPrice?: number;
  effort_hours?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ICourseCardProps {
  course: ICourse;
  viewMode?: "grid" | "list";
  isCompact?: boolean;
  classType?: string;
  preserveClassType?: boolean;
  showDuration?: boolean;
  hidePrice?: boolean;
  hideDescription?: boolean;
  showJobGuarantee?: boolean;
  onShowRelated?: (course: ICourse) => void;
}

// Utility functions
const formatPrice = (fee: number, currency: string = "₹"): string => {
  if (!fee || fee === 0) return "Free";
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "₹" ? "INR" : currency,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(fee);
};

const formatCourseGrade = (grade: string): string => {
  if (grade === "UG - Graduate - Professionals") {
    return "UG/Grad/Pro";
  }
  return grade;
};

const getClassTypeStyles = (classType: string) => {
  const isLive = classType?.toLowerCase().includes("live");
  const isBlended = classType?.toLowerCase().includes("blended");
  
  if (isLive) {
    return {
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      accent: "text-emerald-600 dark:text-emerald-400",
      button: "bg-emerald-500 hover:bg-emerald-600 text-white",
      gradient: "from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900",
    };
  } else if (isBlended) {
    return {
      badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      accent: "text-purple-600 dark:text-purple-400",
      button: "bg-purple-500 hover:bg-purple-600 text-white",
      gradient: "from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-900",
    };
  }
  
  return {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    accent: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
    gradient: "from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900",
  };
};

// Optimized Course Card Component
const CourseCard: React.FC<ICourseCardProps> = ({
  course,
  viewMode = "grid",
  isCompact = false,
  classType = "",
  preserveClassType = false,
  showDuration = true,
  hidePrice = false,
  hideDescription = false,
  showJobGuarantee = false,
  onShowRelated,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<"individual" | "batch">("individual");

  // Memoized values
  const courseClassType = useMemo(() => {
    return preserveClassType ? (classType || course.class_type) : course.class_type;
  }, [preserveClassType, classType, course.class_type]);

  const styles = useMemo(() => getClassTypeStyles(courseClassType || ""), [courseClassType]);

  const isLiveCourse = useMemo(() => {
    return courseClassType?.toLowerCase().includes("live");
  }, [courseClassType]);

  const isFreeCourse = useMemo(() => {
    return course.isFree || course.course_fee === 0;
  }, [course.isFree, course.course_fee]);

  const hasDiscount = useMemo(() => {
    return course.prices && course.prices.length > 0 && course.prices[0].early_bird_discount;
  }, [course.prices]);

  // Get active price object
  const activePrice = useMemo(() => {
    if (!course.prices || course.prices.length === 0) return null;
    return course.prices.find(price => price.is_active) || course.prices[0];
  }, [course.prices]);

  // Calculate pricing values
  const pricingInfo = useMemo(() => {
    if (!activePrice) {
      return {
        individualPrice: course.course_fee || 0,
        batchPrice: course.batchPrice || 0,
        currency: "₹",
        hasValidPricing: false
      };
    }

    const individualPrice = activePrice.individual || 0;
    const batchPrice = activePrice.batch || 0;
    const currency = activePrice.currency || "₹";
    
    // Apply discounts
    const discountedIndividual = activePrice.early_bird_discount 
      ? individualPrice - (individualPrice * activePrice.early_bird_discount / 100)
      : individualPrice;
      
    const discountedBatch = activePrice.group_discount
      ? batchPrice - (batchPrice * activePrice.group_discount / 100)
      : batchPrice;

    return {
      individualPrice: discountedIndividual,
      batchPrice: discountedBatch,
      originalIndividual: individualPrice,
      originalBatch: batchPrice,
      currency,
      hasValidPricing: true,
      minBatchSize: activePrice.min_batch_size || 2,
      individualDiscount: activePrice.early_bird_discount || 0,
      batchDiscount: activePrice.group_discount || 0
    };
  }, [activePrice, course.course_fee, course.batchPrice]);

  // Set default pricing based on course type
  React.useEffect(() => {
    if (isLiveCourse && pricingInfo.hasValidPricing && pricingInfo.batchPrice > 0) {
      setSelectedPricing("batch");
    } else {
      setSelectedPricing("individual");
    }
  }, [isLiveCourse, pricingInfo]);

  // Event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Animation variants
  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 }
  };

  // Get current price to display
  const getCurrentPrice = () => {
    if (isFreeCourse) return "Free";
    
    if (pricingInfo.hasValidPricing) {
      const price = selectedPricing === "batch" ? pricingInfo.batchPrice : pricingInfo.individualPrice;
      return formatPrice(price, pricingInfo.currency);
    }
    
    return formatPrice(course.course_fee, "₹");
  };

  // Get original price for strikethrough
  const getOriginalPrice = () => {
    if (!pricingInfo.hasValidPricing) return null;
    
    const currentDiscount = selectedPricing === "batch" ? (pricingInfo.batchDiscount || 0) : (pricingInfo.individualDiscount || 0);
    if (currentDiscount === 0) return null;
    
    const originalPrice = selectedPricing === "batch" ? (pricingInfo.originalBatch || 0) : (pricingInfo.originalIndividual || 0);
    return formatPrice(originalPrice, pricingInfo.currency);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial="rest"
        animate="rest"
        whileHover="hover"
      >
        {/* Image */}
        <div className="relative w-52 h-36 flex-shrink-0">
          <Image
            src={course.course_image || generateCoursePlaceholder(208, 144)}
            alt={course.course_title}
            fill
            className="object-cover rounded-l-xl"
            sizes="208px"
            quality={85}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(208, 144))}`}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-l-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          )}
          
          {/* Category indicator for list view */}
          <div 
            className="absolute top-2 left-2 w-3 h-3 rounded-full shadow-sm border border-white/50"
            style={{ backgroundColor: getCategoryColor(course.course_category) }}
            title={course.course_category}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {courseClassType && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${styles.badge}`}>
                {courseClassType}
              </span>
            )}
            <Link href={`/course-details/${course._id}`}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                {course.course_title}
              </h3>
            </Link>
            {!hideDescription && course.course_description && (
              <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {course.course_description}
              </p>
            )}
            {course.course_grade && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {formatCourseGrade(course.course_grade)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-base text-gray-500">
              {showDuration && course.course_duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.course_duration}
                </div>
              )}
              {course.no_of_Sessions && (
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.no_of_Sessions} sessions
                </div>
              )}
            </div>

            {!hidePrice && (
              <div className="text-right">
                {isFreeCourse ? (
                  <span className="text-2xl font-bold text-green-600">Free</span>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className={`text-2xl font-bold ${styles.accent}`}>
                      {getCurrentPrice()}
                    </span>
                    {isLiveCourse && (
                      <span className="text-xs text-gray-500">onwards</span>
                    )}
                    {getOriginalPrice() && (
                      <span className="text-sm text-gray-500 line-through">
                        {getOriginalPrice()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden ${
        isCompact ? "h-80" : "h-[26rem]"
      }`}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className={`relative ${isCompact ? "h-40" : "h-44"} overflow-hidden`}>
        <motion.div variants={imageVariants} className="relative w-full h-full">
          <Image
            src={course.course_image || generateCoursePlaceholder()}
            alt={course.course_title}
            fill
            className="object-cover"
            sizes="307px"
            quality={85}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(307, isCompact ? 160 : 176))}`}
            onLoad={handleImageLoad}
            priority={false}
          />
        </motion.div>

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        )}

        {/* Overlay */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 bg-black/20"
        />

        {/* Course Type Badge */}
        {courseClassType && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 ${styles.badge}`}>
              {isLiveCourse && <Play className="w-3 h-3 mr-1" />}
              {courseClassType}
            </span>
          </div>
        )}

        {/* Category Color Indicator - positioned at bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full shadow-sm border border-white/50"
            style={{ backgroundColor: getCategoryColor(course.course_category) }}
            title={course.course_category}
          />
          <span className="text-xs text-white/80 font-medium bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
            {course.course_category}
          </span>
        </div>

        {/* Job Guarantee Badge */}
        {showJobGuarantee && (
          <div className="absolute top-3 right-3 z-30">
            <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white rounded-lg shadow-xl border border-white/20 backdrop-blur-sm">
              <div className="px-2.5 py-1.5 text-center">
                <div className="text-[10px] font-extrabold tracking-wide leading-tight">100%</div>
                <div className="text-[8px] font-semibold leading-tight">
                  <div className="font-medium">JOB</div>
                  <div className="font-medium -mt-0.5">GUARANTEE</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg pointer-events-none"></div>
            </div>
          </div>
        )}

        {/* Price Badge */}
        {!hidePrice && !showJobGuarantee && (
          <div className="absolute top-3 right-3">
            {isFreeCourse ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100/90 text-green-700 dark:bg-green-900/50 dark:text-green-400 backdrop-blur-sm border border-green-200/50">
                <Sparkles className="w-3 h-3 mr-1" />
                Free
              </span>
            ) : hasDiscount ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100/90 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400 backdrop-blur-sm border border-orange-200/50">
                <Tag className="w-3 h-3 mr-1" />
                {selectedPricing === "batch" ? (pricingInfo.batchDiscount || 0) : (pricingInfo.individualDiscount || 0)}% off
              </span>
            ) : null}
          </div>
        )}

        {/* Hover Overlay with Actions */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
        >
          <Link href={`/course-details/${course._id}`}>
            <motion.button
              className={`px-6 py-2 rounded-lg font-medium transition-all ${styles.button} shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1 inline" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/course-details/${course._id}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2 mb-3 group-hover:text-blue-600">
            {course.course_title}
          </h3>
        </Link>

        {/* Description */}
        {!hideDescription && course.course_description && !isCompact && (
          <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
            {course.course_description}
          </p>
        )}

        {/* Course Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.course_grade && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
              <Users className="w-3 h-3 mr-1" />
              {formatCourseGrade(course.course_grade)}
            </span>
          )}
          {course.is_Certification === "Yes" && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
              <Award className="w-3 h-3 mr-1" />
              Certificate
            </span>
          )}
          {course.is_Projects === "Yes" && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Projects
            </span>
          )}
          {course.is_Assignments === "Yes" && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              Assignments
            </span>
          )}
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-base text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-3">
            {showDuration && course.course_duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.course_duration}
              </div>
            )}
            {course.no_of_Sessions && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.no_of_Sessions}
              </div>
            )}
          </div>

          {/* Star Rating Placeholder */}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs">4.5</span>
          </div>
        </div>

        {/* Pricing Section */}
        {!hidePrice && (
          <div className="mt-auto">
            {isFreeCourse ? (
              <div className="text-2xl font-bold text-green-600">Free</div>
            ) : (
              <div className="space-y-3">
                {/* Pricing Toggle for Live Courses with Valid Pricing */}
                {isLiveCourse && pricingInfo.hasValidPricing && pricingInfo.batchPrice > 0 && (
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-xs">
                    <button
                      className={`flex-1 py-2 px-3 font-medium transition-colors ${
                        selectedPricing === "individual"
                          ? `${styles.button}`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedPricing("individual")}
                    >
                      Individual
                    </button>
                    <button
                      className={`flex-1 py-2 px-3 font-medium transition-colors ${
                        selectedPricing === "batch"
                          ? `${styles.button}`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedPricing("batch")}
                    >
                      Batch ({pricingInfo.minBatchSize}+)
                    </button>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className={`text-2xl font-bold ${styles.accent}`}>
                      {getCurrentPrice()}
                    </span>
                    {getOriginalPrice() && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {getOriginalPrice()}
                      </span>
                    )}
                  </div>
                  {isLiveCourse && (
                    <span className="text-xs text-gray-500">onwards</span>
                  )}
                </div>

                {/* Discount Badge */}
                {pricingInfo.hasValidPricing && (
                  <div className="flex gap-2">
                                         {selectedPricing === "individual" && (pricingInfo.individualDiscount || 0) > 0 && (
                       <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                         {pricingInfo.individualDiscount || 0}% off
                       </span>
                     )}
                     {selectedPricing === "batch" && (pricingInfo.batchDiscount || 0) > 0 && (
                       <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                         {pricingInfo.batchDiscount || 0}% off
                       </span>
                     )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(CourseCard); 