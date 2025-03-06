"use client";
import { useWishlistContext } from "@/contexts/WshlistContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { calculateDiscountPercentage, isFreePrice } from "@/utils/priceUtils";
import { User, Users } from "lucide-react";

let insId = 0;
const CourseCard = ({ course, type }) => {
  const { addProductToWishlist } = useWishlistContext() || {};
  const { convertPrice, formatPrice } = useCurrency();
  const [selectedPricing, setSelectedPricing] = useState("individual");

  const {
    id,
    title,
    lesson,
    duration,
    image,
    price,
    batchPrice,
    minBatchSize = 2,
    isFree,
    insName,
    insImg,
    categories,
    filterOption,
    isActive,
    isCompleted,
    completedParchent,
  } = course;
  
  const defaultBatchPrice = batchPrice || (price ? price * 0.75 : 0);
  const currentPrice = price ? convertPrice(price) : convertPrice(32.00);
  const currentBatchPrice = defaultBatchPrice ? convertPrice(defaultBatchPrice) : convertPrice(24.00);
  const originalPrice = price ? convertPrice(price * 2.1) : convertPrice(67.00);
  
  const discountPercentage = calculateDiscountPercentage(originalPrice, currentPrice);
  const batchDiscountPercentage = price ? Math.round(((price - defaultBatchPrice) / price) * 100) : 25;
  
  const depBgs = [
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
      category: "Art & Design",
      bg: "bg-yellow",
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
    ({ category: category1 }) => category1 === categories
  )?.bg;
  insId = id;
  insId = insId % 6 ? insId % 6 : 6;

  return (
    <div
      className={`group  ${
        type === "primary" || type === "primaryMd"
          ? ""
          : `w-full sm:w-1/2 lg:w-1/3 grid-item ${
              type === "lg" ? "xl:w-1/4" : ""
            }`
      } ${filterOption ? filterOption : ""}`}
    >
      <div className={`  ${type === "primaryMd" ? "" : "sm:px-15px  mb-30px"}`}>
        <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
          {/* card image */}
          <div className="relative mb-2">
            <Link
              href={`/courses/${id}`}
              className="w-full overflow-hidden rounded"
            >
              <Image
                src={image}
                alt=""
                priority={true}
                className="w-full transition-all duration-300 group-hover:scale-110"
              />
            </Link>
            <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
              <div>
                <p
                  className={`text-xs text-whiteColor px-4 py-[3px]  rounded font-semibold ${cardBg}`}
                >
                  {categories}
                </p>
              </div>
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
          {/* card content */}
          <div>
            <div className="grid grid-cols-2 mb-3">
              <div className="flex items-center">
                <div>
                  <i className="icofont-book-alt pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {lesson}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <i className="icofont-clock-time pr-5px text-primaryColor text-lg"></i>
                </div>
                <div>
                  <span className="text-sm text-black dark:text-blackColor-dark">
                    {duration}
                  </span>
                </div>
              </div>
            </div>
            <h5 className={`${type === "primaryMd" ? "text-lg " : "text-xl "}`}>
              <Link
                href={`/courses/${id}`}
                className={`font-semibold text-blackColor mb-10px dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor ${
                  type === "primaryMd" ? "leading-25px" : "leading-27px "
                } `}
              >
                {title}
              </Link>
            </h5>
            {/* price with batch/individual toggle */}
            <div className="mb-4">
              {isFree ? (
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
                      <User size={12} className="mr-1" /> Individual
                    </button>
                    <button
                      onClick={() => setSelectedPricing("batch")}
                      className={`flex items-center ${
                        selectedPricing === "batch"
                          ? "text-primaryColor font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      <Users size={12} className="mr-1" /> Batch ({minBatchSize}+)
                    </button>
                  </div>
                  
                  {/* Price display */}
                  <div className="text-lg font-semibold text-primaryColor">
                    {selectedPricing === "individual" ? (
                      <>
                        {formatPrice(currentPrice)}
                        <del className="text-sm text-lightGrey4 font-semibold ml-1">
                          / {formatPrice(originalPrice)}
                        </del>
                        {discountPercentage > 0 && (
                          <span className="ml-2 text-xs bg-secondaryColor3 text-white px-2 py-1 rounded-full">
                            {discountPercentage}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {formatPrice(currentBatchPrice)}
                        <span className="text-xs text-gray-500 ml-1">/student</span>
                        <span className="block text-xs text-green-600">
                          Save {batchDiscountPercentage}% vs individual price
                        </span>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* author and rating--> */}
            <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
              <div>
                <h6>
                  <Link
                    href={`/instructors/${insId}`}
                    className="text-base font-bold  flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                  >
                    <Image
                      className="w-[30px] h-[30px] rounded-full mr-15px"
                      src={insImg}
                      alt=""
                      placeholder="blur"
                    />
                    <span className="whitespace-nowrap">{insName}</span>
                  </Link>
                </h6>
              </div>
              <div className="text-start md:text-end space-x-1">
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                <i className="icofont-star text-size-15 text-yellow"></i>
                {type === "primaryMd" ? (
                  ""
                ) : (
                  <i className="icofont-star text-size-15 text-yellow"></i>
                )}
                <span className="text-xs text-lightGrey6">(44)</span>
              </div>
            </div>
            {isCompleted || isActive ? (
              <div>
                <div className="h-25px w-full bg-blue-x-light rounded-md relative mt-5 mb-15px">
                  <div
                    className={`text-center bg-primaryColor absolute top-0 left-0  rounded-md leading-25px `}
                    style={{
                      width: isActive ? completedParchent + "%" : "100%",
                      height: "100%",
                    }}
                  >
                    <span className="text-size-10 text-whiteColor block leading-25px">
                      {isActive ? completedParchent : 100}% Complete
                    </span>
                  </div>
                </div>
                {isCompleted ? (
                  <div>
                    <Link
                      href="/dashboards/create-course"
                      className="text-size-15 text-whiteColor bg-secondaryColor w-full px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor rounded group text-nowrap text-center"
                    >
                      Download Certificate
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link
                      href={`/dashboards/my-courses/${id}`}
                      className="text-size-15 text-whiteColor w-full bg-secondaryColor px-25px py-10px border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor rounded inline-block text-center"
                    >
                      Continue Learning
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
