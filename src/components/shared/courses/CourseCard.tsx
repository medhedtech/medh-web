"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { calculateDiscountPercentage } from "@/utils/priceUtils";
import { useCourseCardSettings } from "@/contexts/CourseCardSettingsContext";

interface Price {
  _id: string;
  individual: number;
  batch: number;
  min_batch_size: number;
  max_batch_size: number;
  early_bird_discount: number;
  group_discount: number;
  is_active: boolean;
  currency: string;
}

interface CourseMeta {
  views?: number;
}

interface CourseBrochure {
  _id: string;
  url: string;
  title: string;
}

interface CourseProps {
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
  prices: Price[];
  brochures?: CourseBrochure[];
  meta?: CourseMeta;
  class_type?: string;
  showDuration?: boolean;
  hidePrice?: boolean;
  hideDescription?: boolean;
}

const formatPrice = (price: number, currency: string): string => {
  if (price === undefined || price === null || isNaN(price)) return "Price not available";
  return `${currency}${price.toLocaleString("en-IN")}`;
};

const getCoursePriceValue = (prices: Price[]): Price | null => {
  if (!prices || prices.length === 0) return null;
  
  // Log the prices array for debugging
  console.log("Prices array:", prices);
  
  try {
    // Find the active price or use the first price
    const activePrice = prices.find((price) => price.is_active) || prices[0];
    
    // Validate the price object
    if (!activePrice || typeof activePrice.individual !== 'number' || typeof activePrice.batch !== 'number') {
      console.error("Invalid price object:", activePrice);
      return null;
    }
    
    // Log the active price for debugging
    console.log("Active price found:", activePrice);
    
    return activePrice;
  } catch (error) {
    console.error("Error processing price data:", error);
    return null;
  }
};

const getMinBatchSize = (prices: Price[]): number => {
  const activePrice = getCoursePriceValue(prices);
  return activePrice?.min_batch_size || 0;
};

const CourseCard: React.FC<CourseProps> = ({
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
  showDuration = true,
  hidePrice = false,
  hideDescription = false,
}) => {
  // Get card settings from context
  const { settings } = useCourseCardSettings();
  const { cardConfig } = settings;
  
  // Initialize selectedPricing based on class_type
  const [selectedPricing, setSelectedPricing] = useState<"individual" | "batch">(
    class_type === "Live" ? "batch" : "individual"
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Apply card config settings or use props as fallback
  const applyShowDuration = cardConfig?.showDuration !== undefined ? cardConfig.showDuration : showDuration;
  const applyHidePrice = cardConfig?.hidePrice !== undefined ? cardConfig.hidePrice : hidePrice;
  const applyHideDescription = cardConfig?.hideDescription !== undefined ? cardConfig.hideDescription : hideDescription;
  const showBrochureButton = cardConfig?.showBrochureButton !== undefined ? cardConfig.showBrochureButton : true;
  const showExploreButton = cardConfig?.showExploreButton !== undefined ? cardConfig.showExploreButton : true;
  const showCategoryTag = cardConfig?.showCategoryTag !== undefined ? cardConfig.showCategoryTag : true;
  const imageHeight = cardConfig?.imageHeight ? `${cardConfig.imageHeight}px` : '12rem';
  const borderRadius = cardConfig?.borderRadius ? `${cardConfig.borderRadius}px` : '0.5rem';
  const shadowIntensity = cardConfig?.shadowIntensity || 1;

  // Check if this is a live course
  const isLiveCourse = class_type?.toLowerCase().includes("live");

  useEffect(() => {
    // Set default pricing based on course type
    if (isLiveCourse) {
      setSelectedPricing("batch");
    } else {
      setSelectedPricing("individual");
    }
  }, [class_type, isLiveCourse]);

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

  // Add debugging logs
  console.log("Course:", course_title);
  console.log("Active Price:", activePrice);
  console.log("Batch Price:", batchPriceValue);
  console.log("Individual Price:", individualPriceValue);
  console.log("Early Bird Discount:", earlyBirdDiscount);
  console.log("Group Discount:", groupDiscount);
  console.log("Discounted Individual Price:", discountedIndividualPrice);
  console.log("Discounted Batch Price:", discountedBatchPrice);
  console.log("Is Free:", isFree);
  console.log("Class Type:", class_type);
  console.log("Is Live Course:", isLiveCourse);
  console.log("Selected Pricing:", selectedPricing);

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
    } finally {
      setIsDownloading(false);
    }
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

  // Get current price based on selected pricing
  const getCurrentPrice = () => {
    if (isTrulyFree) return "Free";
    
    const price = selectedPricing === "individual" ? discountedIndividualPrice : discountedBatchPrice;
    return formatPrice(price, currency);
  };

  // Get original price for strikethrough display
  const getOriginalPrice = () => {
    if (isTrulyFree) return null;
    
    const discount = selectedPricing === "individual" ? individualDiscountPercentage : batchDiscountPercentage;
    if (discount === 0) return null;
    
    const originalPrice = selectedPricing === "individual" ? individualPriceValue : batchPriceValue;
    return formatPrice(originalPrice, currency);
  };

  // Check if pricing toggle should be shown (for live courses with valid batch pricing)
  const shouldShowPricingToggle = isLiveCourse && !isTrulyFree && batchPriceValue > 0 && individualPriceValue > 0;

  return (
    <div 
      className="bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={{
        borderRadius: borderRadius,
        boxShadow: `0 ${shadowIntensity * 2}px ${shadowIntensity * 4}px rgba(0,0,0,${shadowIntensity * 0.05})`,
      }}
    >
      <div className="relative">
        <Link href={`/course-details/${_id}`}>
          <div className="relative w-full" style={{ height: imageHeight }}>
            <Image
              src={course_image}
              alt={course_title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        
        {showCategoryTag && (
          <div className={`absolute top-2 left-2 ${bgColor} px-2 py-1 rounded text-xs font-medium`}>
            {course_category}
          </div>
        )}
        
        {/* Class type badge */}
        {class_type && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            {class_type}
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/course-details/${_id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primaryColor">
            {course_title}
          </h3>
        </Link>

        {!applyHideDescription && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {course_description}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          {applyShowDuration && (
            <div className="flex items-center gap-1">
              <span>Duration:</span>
              <span className="font-medium">{course_duration}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>Sessions:</span>
            <span className="font-medium">{course_sessions}</span>
          </div>
        </div>

        {/* Course features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {is_Certification === "Yes" && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Certification
            </span>
          )}
          {is_Assignments === "Yes" && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Assignments
            </span>
          )}
          {is_Projects === "Yes" && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              Projects
            </span>
          )}
          {is_Quizes === "Yes" && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Quizzes
            </span>
          )}
        </div>

        {/* Pricing section */}
        {!applyHidePrice && !isPriceLoading && !priceError && (
          <div className="mb-4">
            {isTrulyFree ? (
              <div className="mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md text-sm font-medium">
                  Free Course
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pricing toggle for live courses */}
                {shouldShowPricingToggle && (
                  <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <button
                      className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
                        selectedPricing === "individual"
                          ? "bg-primaryColor text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedPricing("individual")}
                    >
                      Individual
                    </button>
                    <button
                      className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
                        selectedPricing === "batch"
                          ? "bg-primaryColor text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedPricing("batch")}
                    >
                      Batch ({actualMinBatchSize}+ students)
                    </button>
                  </div>
                )}

                {/* Price display */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {selectedPricing === "individual" ? "Individual Price" : "Batch Price"}
                    {isLiveCourse && selectedPricing === "batch" && (
                      <span className="text-xs text-gray-500 ml-1">
                        (per student)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-primaryColor">
                      {getCurrentPrice()}
                    </span>
                    {/* Display original price if there's a discount */}
                    {getOriginalPrice() && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {getOriginalPrice()}
                      </span>
                    )}
                    {isLiveCourse && (
                      <span className="text-xs text-gray-500 ml-1">onwards</span>
                    )}
                  </div>
                </div>

                {/* Discount badges */}
                <div className="flex gap-2">
                  {individualDiscountPercentage > 0 && selectedPricing === "individual" && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {individualDiscountPercentage}% off
                    </span>
                  )}
                  {batchDiscountPercentage > 0 && selectedPricing === "batch" && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {batchDiscountPercentage}% off
                    </span>
                  )}
                </div>

                {/* Batch pricing info for live courses */}
                {isLiveCourse && selectedPricing === "batch" && actualMinBatchSize > 0 && (
                  <div className="text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    <strong>Batch Pricing:</strong> Minimum {actualMinBatchSize} students required. 
                    {actualMaxBatchSize > 0 && ` Maximum ${actualMaxBatchSize} students.`}
                    {groupDiscount > 0 && ` Includes ${groupDiscount}% group discount.`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Price loading state */}
        {!applyHidePrice && isPriceLoading && (
          <div className="mb-4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        )}

        {/* Price error state */}
        {!applyHidePrice && !isPriceLoading && priceError && (
          <div className="mb-4 text-sm text-red-500">{priceError}</div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {showExploreButton && (
            <Link
              href={`/course-details/${_id}`}
              className="flex-1 py-2 px-4 bg-primaryColor text-white text-center text-sm font-medium rounded-md hover:bg-primaryColor/90 transition-colors"
            >
              Explore
            </Link>
          )}
          
          {showBrochureButton && brochures && brochures.length > 0 && (
            <button
              onClick={() => setShowBrochureModal(true)}
              className="flex-1 py-2 px-4 border border-primaryColor text-primaryColor text-center text-sm font-medium rounded-md hover:bg-primaryColor/10 transition-colors flex items-center justify-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                "Downloading..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  Brochure
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Brochure download modal */}
      {showBrochureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Download Brochure</h3>
            <p className="text-gray-600 mb-4">
              Download the course brochure for {course_title}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleBrochureDownload}
                className="flex-1 bg-primaryColor text-white py-2 px-4 rounded hover:bg-primaryColor/90"
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download"}
              </button>
              <button
                onClick={() => setShowBrochureModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard; 