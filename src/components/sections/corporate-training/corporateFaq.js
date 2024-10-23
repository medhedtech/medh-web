"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

export default function CorporateFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question:
        "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question:
        "What are the delivery methods for MEDH's Corporate Training Courses?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question:
        "What are the pricing and payment options for MEDH's Corporate Training Courses?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question:
        "Are MEDH's Corporate Training Courses certified or accredited?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question:
        "Can MEDH tailor the training courses to specific business needs?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question:
        "What are the qualifications and industry experience of MEDH's instructors?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "What post-training support and resources does MEDH provide?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question:
        "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question:
        "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-white text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3 dark:text-gray-300 ">
          Find answers to common questions about MEDH’s Corporate Training
          Courses.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-sm">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold dark:text-gray300">
                  {faq.question}
                </h3>
                <span
                  className={`md:text-[15px] text-[14px] ${
                    openIndex === index ? "text-black" : "text-black"
                  } dark:text-white`}
                >
                  {openIndex === index ? <DownIcon /> : <LeftIcon />}
                </span>
              </div>
              {openIndex === index && (
                <p className="text-lightGrey14 pb-4 dark:text-gray300 px-2 md:pr-12 sm:px-4 md:text-[15px] text-[14px] ">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10 dark:text-gray300">
          <p>
            Note: If you have any other questions or concerns not covered in the
            FAQs, please feel free to contact our
          </p>
          <p>
            support team{" "}
            <a href="care@medh.co" className="text-[#0000FF]">
              care@medh.co
            </a>{" "}
            , and we’ll be happy to assist you!
          </p>
        </div>
      </div>
    </div>
  );
}
