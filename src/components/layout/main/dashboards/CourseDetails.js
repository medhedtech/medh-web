"use client";
import React from "react";
import CourseHeader from "./CourseHeader";
import WhatYouGet from "./WhatYouGet";
import CurriculumSection from "./Curriculum";
import Review from "./Reviews";
import reviewimg from "@/assets/images/dashbord/review.png";
import Image from "next/image";
import MLBanner from "@/assets/images/dashbord/MLBanner.png";

const CourseDetails = () => {
  const course = {
    title: "Advance Machine Learning for Beginners",
    classes: 21,
    rating: 4.8,
    hour: "42",
    price: "29,000",
    // benefits: [
    //   "20 Video hours",
    //   "Live Sessions",
    //   "Beginner to Advanced Level",
    //   "Lifetime Access",
    //   "100 Quizzes",
    //   "Certificate of Completion",
    // ],

    curriculum: [
      {
        title: "Introduction",
        duration: "60 mins",
        lessons: [
          { title: "Why Machine Learning", duration: "15 mins" },
          { title: "Setup Your IDE", duration: "20 mins" },
          { title: "Fundamentals", duration: "15 mins" },
          { title: "Daily Task With ML", duration: "10 mins" },
        ],
      },
      {
        title: "Application",
        duration: "30 mins",
        lessons: [
          { title: "In House", duration: "10 mins" },
          { title: "Corporate", duration: "10 mins" },
          { title: "Hotels", duration: "5 mins" },
          { title: "Research and Labs", duration: "5 mins" },
        ],
      },
    ],
    reviews: [
      {
        reviewer: "Joy",
        rating: 4.5,
        comment:
          "This course has been very useful. Mentor was well spoken totally loved it.",
        likes: 579,
        date: "2 weeks ago",
        avtar: reviewimg,
      },
      {
        reviewer: "Manik",
        rating: 4.5,
        comment:
          "This course has been very useful. Mentor was well spoken totally loved it.",
        likes: 370,
        date: "2 weeks ago",
        avtar: reviewimg,
      },
      {
        reviewer: "Manik",
        rating: 4.5,
        comment:
          "This course has been very useful. Mentor was well spoken totally loved it.",
        likes: 370,
        date: "2 weeks ago",
        avtar: reviewimg,
      },
      {
        reviewer: "Manik",
        rating: 4.5,
        comment:
          "This course has been very useful. Mentor was well spoken totally loved it.",
        likes: 370,
        date: "2 weeks ago",
        avtar: reviewimg,
      },
      {
        reviewer: "Manik",
        rating: 4.5,
        comment:
          "This course has been very useful. Mentor was well spoken totally loved it.",
        likes: 370,
        date: "2 weeks ago",
        avtar: reviewimg,
      },
    ],
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4">
        <button className="text-blue-500 text-xl">
          <div>
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M31.2623 11.9996C31.2623 12.8868 30.5357 13.6134 29.6485 13.6134H6.08742L13.3888 20.9559C14.0351 21.6022 14.0351 22.6109 13.3888 23.2552C13.1068 23.5392 12.7033 23.6998 12.2587 23.6998C11.8552 23.6998 11.4126 23.5392 11.1306 23.2161L1.08334 13.1296C0.439017 12.4833 0.439017 11.4747 1.08334 10.8695L11.1306 0.783045C11.7749 0.138725 12.7836 0.138725 13.4299 0.783045C14.0743 1.42938 14.0743 2.43803 13.4299 3.08235L6.08742 10.3857H29.6485C30.5357 10.3857 31.2623 11.1124 31.2623 11.9996Z"
                fill="#202244"
              />
            </svg>
          </div>
        </button>
        <h2 className="text-2xl font-Open  text-blackColor dark:text-white">
          Course Details
        </h2>
      </div>
      <div className="mt-6">
        <Image src={MLBanner} alt="banner" className="" />
      </div>
      <div className=" flex gap-12">
        <div className="w-[70%]">
          <CourseHeader
            title={course.title || "Untitled Course"}
            classes={course.classes || "Unknown"}
            rating={course.rating || 0}
            hour={course.hour || "0"}
            price={course.price || 0}
          />
          <h3 className="text-lg font-semibold text-gray-800 mt-8">
            Course Curriculum
          </h3>
          {course.curriculum.map((section, index) => (
            <CurriculumSection
              key={index}
              title={section.title || "No Title"}
              duration={section.duration || "No Duration"}
              lessons={section.lessons || []}
            />
          ))}
        </div>

        <div className="mt-8 ">
          <WhatYouGet />
          <div className="flex justify-between ">
            <h3 className="text-lg font-semibold text-[#202244] font-Open mb-4">
              Reviews
            </h3>

            <span className="text-primaryColor hover:underline cursor-pointer">
              SEE ALL &gt;
            </span>
          </div>
          {course.reviews.map((review, index) => (
            <Review
              key={index}
              reviewer={review.reviewer || "Anonymous"}
              rating={review.rating || 0}
              comment={review.comment || "No comment provided"}
              likes={review.likes || 0}
              date={review.date || "Unknown date"}
              avtar={reviewimg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
