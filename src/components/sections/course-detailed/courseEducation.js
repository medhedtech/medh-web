"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Education from "@/assets/images/course-detailed/education.svg";
import Emi from "@/assets/images/course-detailed/emi-card.svg";
import Cer from "@/assets/images/course-detailed/certificate.png";
import Efforts from "@/assets/images/course-detailed/efforts.png";
import Assignments from "@/assets/images/course-detailed/assignment.png";
import Quizzes from "@/assets/images/course-detailed/quizzes.png";
import Mode from "@/assets/images/course-detailed/mode.svg";
import Course from "@/assets/images/course-detailed/course.svg";
import Session from "@/assets/images/course-detailed/session.svg";
import Classes from "@/assets/images/course-detailed/classes.svg";
import Projects from "@/assets/images/course-detailed/project.svg";
import Couresegray from "@/assets/images/course-detailed/course-gray.svg";
import Modegray from "@/assets/images/course-detailed/mode-gray.svg";
import Sessiongray from "@/assets/images/course-detailed/session-gray.svg";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import { notFound } from "next/navigation";
import Preloader from "@/components/shared/others/Preloader";
import {
  FaCertificate,
  FaClock,
  FaChalkboardTeacher,
  FaProjectDiagram,
} from "react-icons/fa";

function CourseEducation({ courseId }) {
  const { getQuery, loading } = useGetQuery();
  const [courseDetails1, setCourseDetails1] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      notFound();
    }
  }, []);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          setCourseDetails1(data);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };

  // JSON data for course details
  const courseDetails = [
    { label: "EMI Options", value: "Yes", icon: Emi },
    { label: "Certification", value: "Yes", icon: Cer },
    { label: "Mode", value: "Live Online", icon: Mode },
    {
      label: "Duration",
      value: courseDetails1?.course_duration || "4 months / 16 weeks",
      icon: Course,
    },
    {
      label: "Online Sessions",
      value: courseDetails1?.session_duration || "(90-120 min each)",
      icon: Session,
    },
    { label: "Efforts", value: "4-6 hours per week", icon: Efforts },
    { label: "Classes", value: "Weekends / Weekdays", icon: Classes },
    { label: "Assignments", value: "Yes", icon: Assignments },
    { label: "Quizzes", value: "Yes", icon: Quizzes },
    { label: "Projects", value: "No", icon: Projects },
  ];

  // Simplified block details
  const courseInfo = [
    {
      label: "DURATION",
      value: courseDetails1?.course_duration || "4 months / 16 weeks",
      icon: Couresegray,
    },
    {
      label: "ONLINE SESSIONS",
      value: courseDetails1?.session_duration || "(90-120 min each)",
      icon: Modegray,
    },
    {
      label: "MODE",
      value: courseDetails1?.course_category + " " + "Online",
      icon: Sessiongray,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }
    if (courseDetails1) {
      const options = {
        key: "rzp_test_Rz8NSLJbl4LBA5",
        amount: 59500,
        currency: "INR",
        name: courseDetails1?.course_title,
        description: `Payment for ${courseDetails1?.course_title}`,
        image: Education,
        handler: function (response) {
          alert(
            "Payment Successful! Payment ID: " + response.razorpay_payment_id
          );
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Razorpay address",
        },
        theme: {
          color: "#FCA400",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex flex-wrap justify-between bg-white dark:bg-[#050622] w-full lg:space-x-8">
      {/* Left Section */}
      <div className="lg:w-[60%] w-full md:px-4 dark:pt-12 ">
        <div className="relative lg:bottom-12 bottom-5">
          <Image
            src={Education}
            alt="Education"
            width={730}
            height={400}
            className="rounded-md"
          />
        </div>
        <div className="lg:ml-[11%] px-5 lg:p-0 lg:mt-10 mt-6">
          <h1 className="lg:text-3xl text-[22px] font-bold text-[#5C6574] mb-2 lg:w-[70%] w-full dark:text-gray-50">
            {/* Digital Marketing with Data Analytics Foundation Certificate */}
            {courseDetails1?.course_title ||
              "Digital Marketing with Data Analytics Foundation Certificate"}
          </h1>
          <div className="flex space-x-0 lg:text-sm text-[12px] text-gray-500 mb-4 lg:space-x-12">
            {courseInfo.map((info, index) => (
              <div key={index} className="flex space-x-8 lg:space-x-12">
                <div className="flex justify-center items-center">
                  <Image src={info.icon} width={20} alt={info.label} />
                  <div className="lg:ml-4 ml-2">
                    <h4 className="font-semibold text-primaryColor">
                      {info.label}
                    </h4>
                    <p className="dark:text-gray-300">{info.value}</p>
                  </div>
                </div>
                {index !== courseInfo.length - 1 && (
                  <span className="border-r-2 lg:pr-10 pr-0"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-[35%] w-full flex justify-center items-center flex-col lg:mr-6 mt-10 dark:text-gray-200 ">
        <div className="bg-gray-50  dark:bg-[#050622]  lg:w-[70%] w-full rounded-md shadow-sm border-2 border-gray-200 dark:border-gray-600  ">
          <div className="bg-[#F5F2FF]  dark:bg-[#050622] p-4 border-b-2 border-gray-200 dark:border-gray-600 md:px-4">
            <div className="flex justify-between items-center">
              <div className="mb-2">
                <p className="text-[1rem] font-normal font-Popins leading-6 text-[#41454F] dark:text-gray-200">
                  {courseDetails1?.course_duration || "4 Months Course"}
                </p>
                <h3 className="text-2xl font-bold text-[#5C6574] dark:text-gray-50">
                  USD $595.00
                </h3>
              </div>
              <div className="text-right text-gray-500">
                <button className="text-[#FCA400]">Share</button>
              </div>
            </div>
            <div className="flex gap-4 my-2 text-sm  md:text-[16px]">
              <button
                onClick={handleBuyNow}
                className="bg-[#FCA400] text-white px-8 py-2 rounded-[30px] hover:bg-[#F6B335]"
              >
                BUY NOW
              </button>
              <button className="bg-inherit text-[#FCA400] border border-[#FCA400] px-5 py-1 rounded-[30px] hover:bg-[#F6B335] hover:text-white">
                WISHLIST
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-200">
              Enrollment validity: Lifetime
            </p>
          </div>

          {/* Dynamically Render Course Details */}
          <div className="text-sm px-4 md:px-8 ">
            {courseDetails.map((detail, index) => (
              <div
                key={index}
                className="flex justify-between my-[6px] pb-2 border-b border-dashed"
              >
                <div className="flex items-center">
                  {/* Display Font Awesome icons properly */}
                  {detail.icon && React.isValidElement(detail.icon) ? (
                    <detail.icon size={24} className="text-primaryColor" />
                  ) : (
                    <Image
                      src={detail.icon}
                      width={24}
                      height={24}
                      alt={detail.label}
                    />
                  )}
                  <span className="ml-2">{detail.label}:</span>
                </div>
                <div>
                  <span>{detail.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseEducation;
