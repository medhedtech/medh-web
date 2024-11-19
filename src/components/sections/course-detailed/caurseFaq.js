"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";

export default function CaurseFaq({ courseId }) {
  const [openIndex, setOpenIndex] = useState(null);
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: `What are the key highlights of the 3 months Certificate course in ${courseDetails1?.course_title} with Data Analytics?`,
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: `How will this course prepare me for entry-level roles in ${courseDetails1?.course_title} and data analytics?`,
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: `HCan this course serve as a stepping stone for further career development in ${courseDetails1?.course_title} and data analytics?`,
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question:
        "What networking opportunities can participants expect from this program?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: `How does the course address ethical considerations in ${courseDetails1?.course_title} and data analytics?`,
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Is Vedic Math course different from Math tuitions?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question:
        "What practical skills and applications can participants expect to develop during the 3 months Certificate course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: `How does the 3 months Certificate course cater to the needs of professionals seeking foundational knowledge in ${courseDetails1?.course_title} and data analytics?`,
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },

    {
      question: "Is financial assistance available for the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
  ];

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-white dark:bg-[#050622] text-lightGrey14 flex  md:py-10 px-4 md:px-4">
      <div className="lg:w-[62%] w-full lg:ml-[7%] dark:text-gray-300 ">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-gray-50 text-primaryColor">
          FAQs
        </h2>

        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border dark:border-gray-600 shadow-md py-2"
            >
              <div
                className="flex  items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                {/* Icon comes first now */}
                <span className="md:text-[15px] text-[14px]">
                  {openIndex === index ? (
                    <i
                      class="icofont-caret-down"
                      style={{ fontSize: "20px" }}
                    ></i>
                  ) : (
                    <i
                      class="icofont-caret-right"
                      style={{ fontSize: "20px" }}
                    ></i>
                  )}
                </span>
                <h3 className="md:text-[15px] text-[14px] md:pl-3 font-semibold">
                  {faq.question}
                </h3>
              </div>
              {openIndex === index && (
                <p className="text-lightGrey14 dark:bg-[#050622] pb-4 px-2 md:pl-12 sm:px-4 md:text-[15px] text-[14px]">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="text-primaryColor dark:text-[#F6B335] pt-10 pr-5">
          Note: If you have any other questions or concerns not covered in the
          FAQs, please feel free to contact our support team, and we’ll be happy
          to assist you!
        </p>
      </div>
    </div>
  );
}
