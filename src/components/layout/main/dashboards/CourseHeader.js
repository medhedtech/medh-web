"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StarIcon from "@/assets/images/icon/StarIcon";
import { isFreePrice } from "@/utils/priceUtils";
import { Users, User } from "lucide-react";

const CourseHeader = ({
  id,
  isEnrolled,
  title,
  classes,
  category,
  tag,
  rating,
  hour,
  price,
  desc,
  batchPrice,
  minBatchSize = 2,
  individualPrice,
}) => {
  const router = useRouter();
  const courseId = id;
  const showEnroll =
    tag?.toLowerCase() !== "pre-recorded" && tag?.toLowerCase() !== "free";
    
  const [selectedPricing, setSelectedPricing] = useState("individual");
  
  const defaultIndividualPrice = individualPrice || price;
  const defaultBatchPrice = batchPrice || (price ? price * 0.75 : 0);
  
  const convertedIndividualPrice = defaultIndividualPrice;
  const convertedBatchPrice = defaultBatchPrice;
  const formattedIndividualPrice = `$${convertedIndividualPrice}`;
  const formattedBatchPrice = `$${convertedBatchPrice}`;
  
  const courseIsFree = isFreePrice(price) && isFreePrice(individualPrice) && isFreePrice(batchPrice);

  const savingsPercentage = defaultIndividualPrice > 0 
    ? Math.round(((defaultIndividualPrice - defaultBatchPrice) / defaultIndividualPrice) * 100) 
    : 0;

  return (
    <div className="justify-between items-start md:items-center mt-6 w-full max-w-[550px]">
      <div>
        <div className="">
          <div className="flex justify-between ">
            <div className="text-[#FF6B00] font-bold text-size-12">
              {category}
            </div>
            <div className="text-yellow-500 text-sm flex gap-0.5">
              <span className="my-auto">
                <StarIcon />
              </span>
              {rating}
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 w-[396px]">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2 my-4">
          <span className="text-gray-500 text-sm flex gap-2">
            <div>
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.99184 1.67033C5.23975 1.67033 6.2534 2.68532 6.2534 3.93188C6.2534 5.17872 5.23975 6.19343 3.99184 6.19343C2.74528 6.19343 1.73137 5.17872 1.73137 3.93188C1.73137 2.68532 2.74528 1.67033 3.99184 1.67033ZM3.99184 7.26806C5.8316 7.26806 7.32802 5.77164 7.32802 3.93188C7.32802 2.09239 5.8316 0.595703 3.99184 0.595703C2.15342 0.595703 0.656738 2.09239 0.656738 3.93188C0.656738 5.77164 2.15235 7.26806 3.99184 7.26806Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.78184 3.93187L2.78104 3.86068C2.77996 3.83032 2.77996 3.83032 2.78614 3.79459C2.81355 3.64871 2.7179 3.50793 2.5731 3.4808C2.42722 3.45339 2.28671 3.54796 2.25823 3.69384C2.24453 3.75456 2.2405 3.81662 2.24373 3.87841L2.24453 3.93187C2.24883 4.07668 2.36731 4.1922 2.51319 4.1922C2.65826 4.1922 2.77674 4.07775 2.78184 3.93187Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.76205 3.37777C2.85231 3.37777 2.9364 3.33371 2.98557 3.25822C3.21016 2.9224 3.5879 2.72091 3.99196 2.72091C4.14106 2.72091 4.26061 2.60109 4.26061 2.45225C4.26061 2.30422 4.14106 2.18359 3.99196 2.18359C3.4087 2.18359 2.86387 2.47428 2.5396 2.95894C2.48506 3.04195 2.47969 3.1478 2.5259 3.23512C2.57211 3.32324 2.66345 3.37777 2.76205 3.37777Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5144 1.67033C12.7623 1.67033 13.776 2.68532 13.776 3.93188C13.776 5.17872 12.7623 6.19343 11.5144 6.19343C10.2676 6.19343 9.25285 5.17872 9.25285 3.93188C9.25366 2.68532 10.2676 1.67033 11.5144 1.67033ZM11.5144 7.26806C13.3542 7.26806 14.8506 5.77164 14.8506 3.93188C14.8506 2.09239 13.3542 0.595703 11.5144 0.595703C9.67464 0.595703 8.17822 2.09239 8.17822 3.93188C8.17903 5.77164 9.67572 7.26806 11.5144 7.26806Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2846 3.37777C10.3748 3.37777 10.4587 3.33371 10.5081 3.25822C10.7327 2.9224 11.1104 2.72091 11.5145 2.72091C11.6636 2.72091 11.7831 2.60109 11.7831 2.45225C11.7831 2.30422 11.6636 2.18359 11.5145 2.18359C10.931 2.18359 10.3864 2.47428 10.0621 2.95894C10.0065 3.04195 10.0011 3.1478 10.0484 3.23512C10.0946 3.32324 10.186 3.37777 10.2846 3.37777Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.2255 16.7613C17.151 16.7447 17.0713 16.7194 17.0156 16.7017C13.4014 14.799 13.2754 14.7958 13.1158 14.7958C12.9678 14.7958 12.8262 14.8504 12.7244 14.9584C12.6226 15.0656 12.5702 15.1967 12.5796 15.3447L12.6583 16.6439C12.651 17.0606 12.3077 17.3293 11.8711 17.3293H1.8943C1.43785 17.3293 1.07463 17.1361 1.07463 16.7194V9.69645C1.07463 9.24215 1.47439 8.73332 1.8943 8.73332V8.73224H11.8711C12.2932 8.73224 12.65 9.15403 12.6583 9.59168L12.5796 10.7512C12.5691 10.9003 12.6215 11.047 12.7222 11.1563C12.8241 11.2654 12.9667 11.3275 13.1158 11.3275C13.291 11.3275 13.3383 11.3275 17.0481 9.34183C17.1215 9.30717 17.1771 9.28621 17.2182 9.27466C17.2244 9.32302 17.2287 9.39341 17.2265 9.49926L17.2255 16.7613ZM17.961 8.45821C17.7848 8.27875 17.5656 8.1823 17.298 8.1823C17.0807 8.1823 16.8467 8.24006 16.5621 8.37735C15.6167 8.88215 14.6689 9.38078 13.7192 9.87592L13.7319 9.67442C13.7329 9.66206 13.734 9.62203 13.734 9.60833C13.734 8.56326 12.8987 7.65869 11.8711 7.65869H1.8943C0.884687 7.65869 0 8.65138 0 9.69645V16.7194C0 17.7247 0.85003 18.4039 1.8943 18.4039H11.8711C12.9071 18.4039 13.7192 17.6662 13.7329 16.6522C13.7319 16.6544 13.7319 16.6552 13.7319 16.6533L13.7047 16.2063C14.4183 16.5641 15.5276 17.1393 16.5549 17.6807C16.5842 17.6962 16.6116 17.7102 16.643 17.7196C16.9232 17.8056 17.1457 17.8655 17.3609 17.8666C17.744 17.8633 17.9758 17.6766 18.0881 17.5203C18.2224 17.3354 18.2687 17.0961 18.2687 16.7729V9.51618C18.2687 9.30206 18.2958 8.79833 17.961 8.45821Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.7319 16.6534L13.733 16.6367C13.733 16.6429 13.7319 16.648 13.7319 16.6534Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.3683 17.8678L17.3611 17.8667L17.3525 17.8678H17.3683Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.86737 9.26953H2.58594C2.04648 9.26953 1.61206 9.93473 1.61206 10.4323V11.7976C1.61206 11.9456 1.73161 12.0649 1.88072 12.0649C2.02875 12.0649 2.14937 11.9456 2.14937 11.7962V10.4309C2.14937 10.1814 2.38982 9.80792 2.58594 9.80792H4.86737C5.01648 9.80792 5.13603 9.68702 5.13603 9.53819C5.13603 9.39016 5.01648 9.26953 4.86737 9.26953Z"
                  fill="#1D1D1B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21065 9.27051H5.942C5.79397 9.27051 5.67334 9.39006 5.67334 9.53916C5.67334 9.68693 5.79397 9.80782 5.942 9.80782H6.21065C6.35976 9.80782 6.47931 9.68693 6.47931 9.53916C6.47931 9.39006 6.35976 9.27051 6.21065 9.27051Z"
                  fill="#1D1D1B"
                />
              </svg>
            </div>{" "}
            {classes} sessions
          </span>
          <span className="text-gray-500 text-sm flex gap-2">
            |{" "}
            <div>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.26929 1.83333C4.58729 1.83333 1.60262 4.818 1.60262 8.5C1.60262 12.182 4.58729 15.1667 8.26929 15.1667C11.9513 15.1667 14.936 12.182 14.936 8.5C14.936 4.818 11.9513 1.83333 8.26929 1.83333ZM8.26929 16.5C3.84995 16.5 0.269287 12.9193 0.269287 8.5C0.269287 4.08067 3.84995 0.5 8.26929 0.5C12.6886 0.5 16.2693 4.08067 16.2693 8.5C16.2693 12.9193 12.6886 16.5 8.26929 16.5Z"
                  fill="#111224"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.6025 12.1667C11.4385 12.1667 11.2772 12.104 11.1545 11.992L7.82121 8.992C7.68321 8.86733 7.60254 8.68733 7.60254 8.5V5.16667C7.60254 4.79933 7.90187 4.5 8.26921 4.5C8.63654 4.5 8.93587 4.79933 8.93587 5.16667V8.20067L12.0505 11C12.2585 11.1847 12.3292 11.4793 12.2299 11.7393C12.1312 11.9973 11.8812 12.1693 11.6025 12.1667Z"
                  fill="#111224"
                />
              </svg>
            </div>{" "}
            {hour.split(" ")[0]} hours
          </span>
        </div>
      </div>
      
      {showEnroll && !isEnrolled && !courseIsFree && (
        <div className="mt-4 mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Pricing Options</h3>
          
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              className={`flex items-center px-4 py-2 border-b-2 ${
                selectedPricing === "individual" 
                  ? "border-primaryColor text-primaryColor font-medium" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedPricing("individual")}
            >
              <User size={16} className="mr-2" />
              Individual
            </button>
            <button
              className={`flex items-center px-4 py-2 border-b-2 ${
                selectedPricing === "batch" 
                  ? "border-primaryColor text-primaryColor font-medium" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedPricing("batch")}
            >
              <Users size={16} className="mr-2" />
              Batch ({minBatchSize}+ students)
            </button>
          </div>
          
          <div className={selectedPricing === "individual" ? "block" : "hidden"}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-medium">Individual Enrollment</p>
                <p className="text-sm text-gray-500">Enroll as a single student</p>
              </div>
              <div className="text-xl font-bold text-primaryColor">
                {formattedIndividualPrice}
              </div>
            </div>
          </div>
          
          <div className={selectedPricing === "batch" ? "block" : "hidden"}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-medium">Batch Enrollment</p>
                <p className="text-sm text-gray-500">Per student in a group of {minBatchSize}+</p>
                {savingsPercentage > 0 && (
                  <p className="text-sm text-green-600">Save {savingsPercentage}% per student</p>
                )}
              </div>
              <div className="text-xl font-bold text-primaryColor">
                {formattedBatchPrice}
                <span className="block text-xs text-gray-500 text-right">per student</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showEnroll && (
        <button
          className={`${
            isEnrolled
              ? "mt-4 md:mt-0 px-4 py-2 rounded-[150px] bg-primaryColor w-full md:w-[450px] lg:w-[530px] text-white font-semibold cursor-not-allowed opacity-50"
              : "mt-4 md:mt-0 px-4 py-2 rounded-[150px] bg-primaryColor w-full md:w-[450px] lg:w-[530px] text-white font-semibold hover:bg-green-600"
          }`}
          disabled={isEnrolled}
          onClick={() => {
            if (!isEnrolled) {
              router.push(
                `/dashboards/billing-details/${courseId}?pricingOption=${selectedPricing}`
              );
            }
          }}
        >
          {isEnrolled 
            ? "Enrolled" 
            : courseIsFree 
              ? "Enroll for Free" 
              : `Enroll Now for ${selectedPricing === "batch" ? formattedBatchPrice : formattedIndividualPrice}`
          }
        </button>
      )}

      <div className="mt-6">
        <h2>About Course</h2>
        <div className="border-t-4 text-[#565656] w-full md:w-[450px] lg:w-[530px] text-size-11">
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
