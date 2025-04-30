"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Edit, Trash2, Eye, Pencil, CheckSquare } from "lucide-react";
import { calculateDiscountPercentage } from "@/utils/priceUtils";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import { CoursePrice, CourseBrochure, ICourse } from "@/types/course";

interface EditableCourseCardProps {
  _id: string;
  course_title: string;
  course_image: string;
  course_category: string;
  course_description: string;
  course_duration: string;
  course_sessions: string;
  is_Certification: "Yes" | "No";
  is_Assignments: "Yes" | "No";
  is_Projects: "Yes" | "No";
  is_Quizes: "Yes" | "No";
  isFree: boolean;
  prices: CoursePrice[];
  brochures?: CourseBrochure[];
  meta?: { views?: number };
  class_type?: string;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const formatPrice = (price: number, currency: string): string => {
  if (price === undefined || price === null || isNaN(price)) return "Price not available";
  return `${currency}${price.toLocaleString("en-IN")}`;
};

const getCoursePriceValue = (prices: CoursePrice[]): CoursePrice | null => {
  if (!prices || prices.length === 0) return null;
  
  try {
    // Find the active price or use the first price
    const activePrice = prices.find((price) => price.is_active) || prices[0];
    
    // Validate the price object
    if (!activePrice || typeof activePrice.individual !== 'number' || typeof activePrice.batch !== 'number') {
      console.error("Invalid price object:", activePrice);
      return null;
    }
    
    return activePrice;
  } catch (error) {
    console.error("Error processing price data:", error);
    return null;
  }
};

const getMinBatchSize = (prices: CoursePrice[]): number => {
  const activePrice = getCoursePriceValue(prices);
  return activePrice?.min_batch_size || 0;
};

const EditableCourseCard: React.FC<EditableCourseCardProps> = ({
  _id,
  course_title,
  course_image,
  course_category,
  course_description,
  course_duration,
  course_sessions,
  is_Certification,
  is_Assignments,
  is_Projects,
  is_Quizes,
  isFree,
  prices = [],
  brochures,
  meta,
  class_type = "Blended",
  isAdmin = false,
  onEdit,
  onDelete,
  onView
}) => {
  const [selectedPricing, setSelectedPricing] = useState<"individual" | "batch">(
    class_type === "Live" ? "batch" : "individual"
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setSelectedPricing(class_type === "Live" ? "batch" : "individual");
  }, [class_type]);

  useEffect(() => {
    // Simulate price loading state
    setIsPriceLoading(true);
    setPriceError(null);
    
    // Check if prices are valid
    if (!prices || prices.length === 0) {
      setPriceError("No pricing information available");
      setIsPriceLoading(false);
      return;
    }
    
    // Validate price data
    try {
      const activePrice = getCoursePriceValue(prices);
      if (!activePrice) {
        setPriceError("Invalid pricing data");
      }
    } catch (error) {
      setPriceError("Error loading pricing information");
      console.error("Price validation error:", error);
    } finally {
      setIsPriceLoading(false);
    }
  }, [prices]);

  const activePrice = getCoursePriceValue(prices);
  
  // Extract price values with proper fallbacks
  const batchPriceValue = activePrice?.batch || 0;
  const individualPriceValue = activePrice?.individual || 0;
  const actualMinBatchSize = activePrice?.min_batch_size || 0;
  const actualMaxBatchSize = activePrice?.max_batch_size || 0;
  const earlyBirdDiscount = activePrice?.early_bird_discount || 0;
  const groupDiscount = activePrice?.group_discount || 0;
  const currency = activePrice?.currency || "₹";

  // Calculate discounted prices
  const discountedIndividualPrice = earlyBirdDiscount > 0 
    ? individualPriceValue - (individualPriceValue * earlyBirdDiscount / 100) 
    : individualPriceValue;
    
  const discountedBatchPrice = groupDiscount > 0 
    ? batchPriceValue - (batchPriceValue * groupDiscount / 100) 
    : batchPriceValue;

  // Calculate discount percentages for display
  const individualDiscountPercentage = earlyBirdDiscount;
  const batchDiscountPercentage = groupDiscount;

  const handleBrochureDownload = async (): Promise<void> => {
    if (!brochures?.[0]) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(brochures[0].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = brochures[0].title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading brochure:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(_id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(_id);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) onView(_id);
  };

  const categoryColors: Record<string, string> = {
    "Data Science": "bg-blue-100",
    "Web Development": "bg-green-100",
    "Mobile Development": "bg-purple-100",
    "Cloud Computing": "bg-yellow-100",
    "Cybersecurity": "bg-red-100",
    "AI/ML": "bg-pink-100",
    "Blockchain": "bg-indigo-100",
    "DevOps": "bg-orange-100",
  };

  const bgColor = categoryColors[course_category] || "bg-gray-100";

  // Determine if the course is truly free
  const isTrulyFree = isFree || (individualPriceValue === 0 && batchPriceValue === 0);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={isAdmin ? "#" : `/course-details/${_id}`}>
          <div className="relative h-48 w-full">
            <Image
              src={course_image}
              alt={course_title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className={`absolute top-2 left-2 ${bgColor} px-2 py-1 rounded text-xs font-medium`}>
          {course_category}
        </div>
        
        {/* Admin Overlay */}
        {isAdmin && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-3">
            <button 
              onClick={handleViewClick}
              className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
              title="View Course"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={handleEditClick}
              className="p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors"
              title="Edit Course"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              title="Delete Course"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={isAdmin ? "#" : `/course-details/${_id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primaryColor">
            {course_title}
          </h3>
        </Link>

        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {course_description}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <span>Duration:</span>
            <span className="font-medium">{course_duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Sessions:</span>
            <span className="font-medium">{course_sessions}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {isPriceLoading ? (
              <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
            ) : priceError ? (
              <p className="text-sm text-red-500">{priceError}</p>
            ) : isTrulyFree ? (
              <div className="text-lg font-bold text-green-600">Free</div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  {/* Current price */}
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(
                      selectedPricing === "individual" 
                        ? discountedIndividualPrice 
                        : discountedBatchPrice,
                      currency
                    )}
                  </span>
                  
                  {/* Original price if discounted */}
                  {(selectedPricing === "individual" && individualDiscountPercentage > 0) || 
                   (selectedPricing === "batch" && batchDiscountPercentage > 0) ? (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(
                        selectedPricing === "individual" 
                          ? individualPriceValue 
                          : batchPriceValue,
                        currency
                      )}
                    </span>
                  ) : null}
                </div>
                
                {/* Display discount percentage */}
                {((selectedPricing === "individual" && individualDiscountPercentage > 0) || 
                  (selectedPricing === "batch" && batchDiscountPercentage > 0)) && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    Save {selectedPricing === "individual" 
                      ? individualDiscountPercentage 
                      : batchDiscountPercentage}%
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Brochure download button */}
          {brochures && brochures.length > 0 && (
            <button
              onClick={() => setShowBrochureModal(true)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Download size={14} />
              <span>Brochure</span>
            </button>
          )}
        </div>

        {/* Admin quick actions when not hovered */}
        {isAdmin && !isHovered && (
          <div className="flex mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 justify-between">
            <div className="flex gap-2">
              <button 
                onClick={handleEditClick}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={handleViewClick}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                View
              </button>
            </div>
            <button 
              onClick={handleDeleteClick}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Brochure modal */}
      {showBrochureModal && (
        <DownloadBrochureModal 
          isOpen={showBrochureModal} 
          onClose={() => setShowBrochureModal(false)}
          courseId={_id}
          courseTitle={course_title}
        />
      )}
    </div>
  );
};

export default EditableCourseCard; 