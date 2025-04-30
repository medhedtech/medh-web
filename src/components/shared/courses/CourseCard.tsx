"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { calculateDiscountPercentage } from "@/utils/priceUtils";
import DownloadBrochureModal from "@/components/shared/download-broucher";

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
  const [selectedPricing, setSelectedPricing] = useState<"individual" | "batch">(
    class_type === "Live" ? "batch" : "individual"
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link href={`/course-details/${_id}`}>
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
        
        {/* Price badge on top right */}
        {!hidePrice && !isPriceLoading && !priceError && !isTrulyFree && (
          <div className="absolute top-2 right-2 bg-primaryColor text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(
              selectedPricing === "individual" ? discountedIndividualPrice : discountedBatchPrice,
              currency
            )}
          </div>
        )}
        
        {/* Free badge for free courses */}
        {!hidePrice && !isPriceLoading && !priceError && isTrulyFree && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Free
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/course-details/${_id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primaryColor">
            {course_title}
          </h3>
        </Link>

        {!hideDescription && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {course_description}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          {showDuration && (
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

        {!hidePrice && (
          <div className="mb-4 border-t border-gray-200 pt-3">
            {isPriceLoading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : priceError ? (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {priceError}
              </div>
            ) : isTrulyFree ? (
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">Free</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">No Cost</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700">Pricing Options:</span>
                  <div className="flex">
                    <button
                      onClick={() => setSelectedPricing("individual")}
                      className={`px-3 py-1 rounded-l-full text-xs ${
                        selectedPricing === "individual"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setSelectedPricing("batch")}
                      className={`px-3 py-1 rounded-r-full text-xs ${
                        selectedPricing === "batch"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Batch
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {/* Price display */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primaryColor">
                        {formatPrice(
                          selectedPricing === "individual" ? discountedIndividualPrice : discountedBatchPrice,
                          currency
                        )}
                      </span>
                      
                      {/* Show original price if there's a discount */}
                      {(selectedPricing === "individual" && earlyBirdDiscount > 0) && (
                        <span className="text-sm line-through text-gray-500">
                          {formatPrice(individualPriceValue, currency)}
                        </span>
                      )}
                      {(selectedPricing === "batch" && groupDiscount > 0) && (
                        <span className="text-sm line-through text-gray-500">
                          {formatPrice(batchPriceValue, currency)}
                        </span>
                      )}
                    </div>
                    
                    {/* Discount badge */}
                    {selectedPricing === "individual" && individualDiscountPercentage > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {individualDiscountPercentage}% off
                      </span>
                    )}
                    {selectedPricing === "batch" && batchDiscountPercentage > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {batchDiscountPercentage}% off
                      </span>
                    )}
                  </div>
                  
                  {/* Additional pricing information */}
                  {selectedPricing === "batch" && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Batch details:</span> 
                      {actualMinBatchSize > 0 && ` Min ${actualMinBatchSize} students`}
                      {actualMaxBatchSize > 0 && ` · Max ${actualMaxBatchSize} students`}
                      {/* Per student price calculation */}
                      {actualMinBatchSize > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Per student:</span> 
                          {formatPrice(discountedBatchPrice / Math.max(actualMinBatchSize, 1), currency)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedPricing === "individual" && earlyBirdDiscount > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">Early bird discount:</span> Save {earlyBirdDiscount}% 
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {is_Certification === "Yes" && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Certification
            </span>
          )}
          {is_Assignments === "Yes" && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Assignments
            </span>
          )}
          {is_Projects === "Yes" && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Projects
            </span>
          )}
          {is_Quizes === "Yes" && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Quizzes
            </span>
          )}
        </div>

        <div className="mb-3 sm:hidden">
          {brochures?.[0] && (
            <button
              onClick={handleBrochureDownload}
              disabled={isDownloading}
              className="w-full text-xs flex items-center justify-center gap-1 text-primaryColor border border-primaryColor py-1 px-2 rounded hover:bg-primaryColor hover:text-white transition-colors"
            >
              <Download size={12} />
              {isDownloading ? "Downloading..." : "Download Brochure"}
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {meta?.views ? `${meta.views.toLocaleString()} views` : ""}
        </div>
      </div>

      <DownloadBrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
        courseTitle={course_title}
        courseId={_id}
        brochureId={brochures?.[0]?._id || ""}
      >
        {/* Empty children to fix the linter error */}
      </DownloadBrochureModal>
    </div>
  );
};

export default CourseCard; 