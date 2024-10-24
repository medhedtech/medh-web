"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

export default function CareerFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Medh’s work culture like?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "What career development opportunities does Medh offer?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "What benefits can I expect as a Medh employee?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "What benefits can I expect as a Medh employee?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "How can I apply for a job at Medh?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },

    {
      question: "What is the recruitment process at Medh?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[95%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-white text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 dark:text-gray300 px-3 ">
          Discover answers to common questions about becoming an integral part
          of the MEDH team. Learn about the application process, pre-requisites,
          career opportunities, and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-md">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4 text-[#727695]"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-bold dark:text-gray300 ">
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
                <p className="text-lightGrey14 pb-4 px-2 md:pr-12 sm:px-4 md:text-[15px] text-[14px] ">
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
