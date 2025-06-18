"use client";
import React, { useEffect, useState } from "react";
import WhatYouGet from "./WhatYouGet";
import Review from "./Reviews";
import reviewimg from "@/assets/images/dashbord/review.png";
import Image from "next/image";
import MLBanner from "@/assets/images/dashbord/MLBanner.png";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import usePostQuery from "@/hooks/postQuery.hook";
import CoorporateCourseHeader from "./CoorporateCourse_Header";

const CoorporateCourseDetails = () => {
  const courseId = useParams().id;
  const coorporateId = localStorage.getItem("userId");
  const [courseDetails, setCourseDetails] = useState(null);
  const { getQuery } = useGetQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseIsFreeOrPr, setCourseIsFreeOrPr] = useState(false);

  // Extract 'isFreeCourse' from URL search parameters
  const isFreeCourse = searchParams.get("isFreeCourse") === "true";

  const handlePlayVideo = (videoUrl, id) => {
    if (isEnrolled || courseIsFreeOrPr) {
      if (id) {
        getQuery({
          url: `${apiUrls.CoorporateEnrollCourse.watchCoorporateModule}?id=${id}`,
          onSuccess: () => {
            setSelectedVideo(videoUrl);
            setIsPlaying(true);
            console.log("Playing video:", videoUrl);
          },
        });
      } else {
        setSelectedVideo(videoUrl);
        setIsPlaying(true);
        console.log("Playing video:", videoUrl);
      }
    } else {
      showToast.error("Enroll to access course curriculum.");
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    const fetchCourseDetailsById = () => {
      getQuery({
        url: `${apiUrls?.courses?.getCoorporateCourseByid}/${courseId}?coorporateId=${coorporateId}`,
        onSuccess: (res) => {
          setCourseDetails(res);
          const status =
            res?.course_tag?.toLowerCase() === "pre-recorded" ||
            (res?.course_fee === 0 && res?.isFree === true);
          setCourseIsFreeOrPr(status);
          console.log(res);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
        },
      });
    };
    fetchCourseDetailsById();

    const getEnrollmentStatus = () => {
      getQuery({
        url: `${apiUrls?.Subscription?.getCoorporateEnrollmentsStatus}?coorporateId=${coorporateId}&courseId=${courseId}`,
        onSuccess: (res) => {
          setIsEnrolled(res.enrolled);
          console.log(res);
        },
        onFail: (err) => {
          console.error("Error fetching enrollment status:", err);
        },
      });
    };
    getEnrollmentStatus();
  }, [courseId]);

  const handleGoBack = () => {
    router.back();
  };

  const course = {
    title: "Advance Machine Learning for Beginners",
    classes: 21,
    rating: 4.8,
    hour: "42",
    price: "29,000",
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

  console.log("kjasdhgvda", isFreeCourse);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4">
        <button className="text-blue-500 text-xl" onClick={handleGoBack}>
          <div>
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
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
        <Image
          src={courseDetails?.course_image || MLBanner}
          alt="banner"
          width={1200}
          height={0}
          className="w-full h-[50vh] object-cover rounded-2xl"
        />
      </div>
      <div className=" flex gap-12">
        <div className="w-[70%]">
          <CoorporateCourseHeader
            id={courseId}
            isEnrolled={isEnrolled}
            title={courseDetails?.course_title || "Untitled Course"}
            classes={courseDetails?.no_of_Sessions || "Unknown"}
            category={courseDetails?.course_category || "Tech"}
            tag={courseDetails?.course_tag}
            rating={course.rating || 0}
            hour={courseDetails?.session_duration || "- hours"}
            price={courseDetails?.course_fee || 0}
            desc={courseDetails?.course_description || "No Description"}
          />
          <h3 className="text-lg font-semibold text-gray-800 mt-8">
            Course Curriculum
          </h3>
          {/* {course.curriculum.map((section, index) => (
            <CurriculumSection
              key={index}
              title={section.title || "No Title"}
              duration={section.duration || "No Duration"}
              lessons={section.lessons || []}
            />
          ))} */}
          {/* <ul>
            {courseDetails?.enrolled_module.map((video, index) => (
              <li
                key={index}
                className="flex justify-between items-center w-1/2 border-b border-gray-200 py-3 text-[#202244] "
              >
                <div className="flex items-center space-x-3 ">
                  <span className="w-8 h-8 flex bg-slate-200 items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-base font-medium">Video {index + 1}</p>
                  </div>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handlePlayVideo(video.video_url, video._id)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.2 13.05V4.95L12.6 9L7.2 13.05ZM9 0C4.02705 0 0 4.02705 0 9C0 13.9729 4.02705 18 9 18C13.9729 18 18 13.9729 18 9C18 4.02705 13.9729 0 9 0Z"
                      fill="#7ECA9D"
                    />
                  </svg>
                </div>
              </li>
            ))}
            {courseDetails?.course_videos.length === 0 && (
              <p className="text-[#202244] pt-1">No Videos available</p>
            )}
          </ul> */}

          <ul>
            {isFreeCourse
              ? courseDetails?.course_videos.map((video, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center w-1/2 border-b border-gray-200 py-3 text-[#202244] "
                  >
                    <div className="flex items-center space-x-3 ">
                      <span className="w-8 h-8 flex bg-slate-200 items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-base font-medium">
                          Video {index + 1}
                        </p>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handlePlayVideo(video)
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.2 13.05V4.95L12.6 9L7.2 13.05ZM9 0C4.02705 0 0 4.02705 0 9C0 13.9729 4.02705 18 9 18C13.9729 18 18 13.9729 18 9C18 4.02705 13.9729 0 9 0Z"
                          fill="#7ECA9D"
                        />
                      </svg>
                    </div>
                  </li>
                ))
              : courseDetails?.enrolled_module.map((video, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center w-1/2 border-b border-gray-200 py-3 text-[#202244] "
                  >
                    <div className="flex items-center space-x-3 ">
                      <span className="w-8 h-8 flex bg-slate-200 items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-base font-medium">
                          Video {index + 1}
                        </p>
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handlePlayVideo(video.video_url, video._id)
                      }
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.2 13.05V4.95L12.6 9L7.2 13.05ZM9 0C4.02705 0 0 4.02705 0 9C0 13.9729 4.02705 18 9 18C13.9729 18 18 13.9729 18 9C18 4.02705 13.9729 0 9 0Z"
                          fill="#7ECA9D"
                        />
                      </svg>
                    </div>
                  </li>
                ))}
            {courseDetails?.course_videos.length === 0 && (
              <p className="text-[#202244] pt-1">No Videos available</p>
            )}
          </ul>
        </div>

        {/* Video Player */}
        {isPlaying && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] max-w-3xl relative">
              <button
                onClick={handleCloseVideo}
                className="absolute -top-3 -right-3 text-gray-600 hover:text-gray-800 bg-red-200 hover:bg-red-300 rounded-full p-2 focus:outline-none shadow-lg transition duration-200 ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* <video
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
                src={selectedVideo}
              /> */}
              <ReactPlayer
                url={selectedVideo}
                controls
                width="100%"
                height="70vh"
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload", // Prevent downloads
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

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

export default CoorporateCourseDetails;
