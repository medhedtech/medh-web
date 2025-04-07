"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { calculateDiscountPercentage, isFreePrice } from "@/utils/priceUtils";
import * as priceUtils from "@/utils/priceUtils";
import { User, Users, Download } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import DownloadBrochureModal from "@/components/shared/download-broucher";
import { apiBaseUrl } from "@/apis";

// Simple price formatting function to replace useCurrency
const formatPrice = (price, currency = 'INR') => {
  if (price === undefined || price === null) return '';
  
  // Format the price with the currency symbol
  const symbol = currency === 'USD' ? '$' : '₹';
  return `${symbol}${Math.round(Number(price))}`;
};

// Local implementation of the price utility functions
const getCoursePriceValue = (course, isBatch = true) => {
  // If course has prices array, use it
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    // Use the first active price (typically in base currency)
    const activePrice = course.prices.find(p => p.is_active === true);
    
    if (activePrice) {
      return isBatch ? activePrice.batch : activePrice.individual;
    }
  }
  
  // Fall back to price/batchPrice if available
  if (isBatch && course.batchPrice !== undefined) {
    return course.batchPrice;
  }
  
  if (!isBatch && course.price !== undefined) {
    return course.price;
  }
  
  // Fall back to course_fee (with discount applied for batch)
  if (course.course_fee !== undefined) {
    return isBatch ? course.course_fee * 0.75 : course.course_fee;
  }
  
  // Last resort fallbacks
  return isBatch ? 24.00 : 32.00;
};

const getMinBatchSize = (course) => {
  // If course has prices array, use min_batch_size from there
  if (course.prices && Array.isArray(course.prices) && course.prices.length > 0) {
    const activePrice = course.prices.find(p => p.is_active === true);
    
    if (activePrice && activePrice.min_batch_size) {
      return activePrice.min_batch_size;
    }
  }
  
  // Fall back to course.minBatchSize if available
  if (course.minBatchSize !== undefined) {
    return course.minBatchSize;
  }
  
  // Default min batch size
  return 2;
};

let insId = 0;
const CourseCard = ({ course, type }) => {
  const { addProductToWishlist } = useWishlistContext() || {};
  const { user, isAuthenticated } = useAuth();
  const [selectedPricing, setSelectedPricing] = useState("batch");
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    _id,
    course_title,
    course_description,
    course_duration,
    course_image,
    course_category,
    no_of_Sessions,
    prices,
    isFree,
    status,
    is_Certification,
    is_Assignments,
    is_Projects,
    is_Quizes,
    category_type,
    course_grade,
    brochures,
    meta
  } = course;
  
  // Get actual batch and individual prices using utility functions
  const activePrice = prices && prices.length > 0 ? prices[0] : null;
  console.log('Active Price:', activePrice);
  
  // Ensure we have valid price values
  const batchPriceValue = activePrice && typeof activePrice.batch === 'number' ? activePrice.batch : 0;
  const individualPriceValue = activePrice && typeof activePrice.individual === 'number' ? activePrice.individual : 0;
  console.log('Batch Price:', batchPriceValue, 'Individual Price:', individualPriceValue);
  
  const actualMinBatchSize = activePrice?.min_batch_size || 2;
  const currency = activePrice?.currency || 'INR';
  
  // Calculate discount percentages
  const discountPercentage = calculateDiscountPercentage(individualPriceValue, batchPriceValue);
  const batchDiscountPercentage = calculateDiscountPercentage(individualPriceValue, batchPriceValue);
  
  console.log('Discount Percentage:', discountPercentage);
  console.log('Batch Discount Percentage:', batchDiscountPercentage);
  console.log('Is Free:', isFree);
  console.log('Selected Pricing:', selectedPricing);
  
  // Function to handle brochure download
  const handleBrochureDownload = async () => {
    if (brochures?.[0]) {
      setShowBrochureModal(true);
    }
  };

  const depBgs = [
    {
      category: "Technical Skills",
      bg: "bg-blue",
    },
    {
      category: "Art & Design",
      bg: "bg-secondaryColor",
    },
    {
      category: "Development",
      bg: "bg-blue",
    },
    {
      category: "Lifestyle",
      bg: "bg-secondaryColor2",
    },
    {
      category: "Web Design",
      bg: "bg-greencolor2",
    },
    {
      category: "Business",
      bg: "bg-orange",
    },
    {
      category: "Personal Development",
      bg: "bg-secondaryColor",
    },
    {
      category: "Marketing",
      bg: "bg-blue",
    },
    {
      category: "Photography",
      bg: "bg-secondaryColor2",
    },
    {
      category: "Data Science",
      bg: "bg-greencolor2",
    },
    {
      category: "Health & Fitness",
      bg: "bg-orange",
    },
    {
      category: "Mobile Application",
      bg: "bg-yellow",
    },
  ];

  const cardBg = depBgs?.find(
    ({ category }) => category === course_category
  )?.bg || 'bg-blue';
  insId = _id;
  insId = insId % 6 ? insId % 6 : 6;

  return (
    <div
      className={`group ${
        type === "primary" || type === "primaryMd"
          ? ""
          : `w-full sm:w-1/2 lg:w-1/3 grid-item ${
              type === "lg" ? "xl:w-1/4" : ""
            }`
      }`}
    >
      <div className={`${type === "primaryMd" ? "" : "sm:px-15px mb-30px"}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
          {/* card image */}
          <div className="relative mb-2">
            <Link
              href={`/courses/${_id}`}
              className="w-full overflow-hidden rounded"
            >
              <Image
                src={course_image}
                alt={course_title}
                width={400}
                height={225}
                className="w-full transition-all duration-300 group-hover:scale-110"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                <p className={`text-xs text-whiteColor px-4 py-[3px] rounded font-semibold ${cardBg}`}>
                  {course_category}
                </p>
              </div>
              <div className="flex gap-1">
                {brochures?.[0] && (
                  <button
                    onClick={handleBrochureDownload}
                    disabled={isDownloading}
                    className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                  >
                    <Download size={16} className="py-1 px-1" />
                  </button>
                )}
                <button
                  onClick={() =>
                    addProductToWishlist &&
                    addProductToWishlist({
                      ...course,
                      isCourse: true,
                      quantity: 1,
                    })
                  }
                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                >
                  <i className="icofont-heart-alt text-base py-1 px-2"></i>
                </button>
              </div>
            </div>
          </div>
          {/* card content */}
          <div>
            <div className="grid grid-cols-2 mb-3">
              <div className="flex items-center">
                <div>
                  <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {no_of_Sessions} Sessions
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {course_duration}
                  </span>
                </div>
              </div>
            </div>
            <h5 className={`${type === "primaryMd" ? "text-lg" : "text-xl"}`}>
              <Link
                href={`/courses/${_id}`}
                className={`font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor ${
                  type === "primaryMd" ? "leading-25px" : "leading-27px"
                }`}
              >
                {course_title}
              </Link>
            </h5>
            {/* price with batch/individual toggle */}
            <div className="mb-4">
              {isFree === true || (individualPriceValue === 0 && batchPriceValue === 0) ? (
                <span className="text-lg font-semibold text-green-600">Free</span>
              ) : (
                <>
                  {/* Pricing toggle */}
                  <div className="flex space-x-2 mb-1 text-xs border-b border-gray-200 pb-1">
                    <button
                      onClick={() => setSelectedPricing("individual")}
                      className={`flex items-center ${
                        selectedPricing === "individual"
                          ? "text-primaryColor font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setSelectedPricing("batch")}
                      className={`flex items-center ${
                        selectedPricing === "batch"
                          ? "text-primaryColor font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Batch
                    </button>
                  </div>
                  {/* Price display */}
                  <div className="text-lg font-semibold text-primaryColor">
                    {selectedPricing === "individual" ? (
                      <>
                        {formatPrice(individualPriceValue, currency)}
                        {discountPercentage > 0 && !isNaN(discountPercentage) && (
                          <span className="ml-2 text-xs bg-secondaryColor3 text-white px-2 py-1 rounded-full">
                            {discountPercentage}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {formatPrice(batchPriceValue, currency)}
                        <span className="text-xs text-gray-500 ml-1">/student</span>
                        {batchDiscountPercentage > 0 && !isNaN(batchDiscountPercentage) && (
                          <span className="block text-xs text-green-600">
                            Save {batchDiscountPercentage}% vs individual price
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {selectedPricing === "batch" && (
                    <div className="text-sm text-gray-500">
                      Min. {actualMinBatchSize}+ students
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Features */}
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
            {/* Download brochure section for small screens */}
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
            {/* Views count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {meta?.views ? `${meta.views.toLocaleString()} views` : ""}
            </div>
          </div>
        </div>
      </div>
      
      {/* Brochure download modal */}
      <DownloadBrochureModal
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
        courseTitle={course_title}
        courseId={_id}
      />
    </div>
  );
};

export default CourseCard;
