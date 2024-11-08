"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";

function PersonalityFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the Personality Development Course?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "What is the duration of the Personality Development Course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question:
        "Is the Personality Development Course suitable for all age groups?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "What are the key topics covered in the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: "Will the course help in career advancement?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 dark:text-gray300 flex justify-center items-center flex-col py-4">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray50">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-35 px-3">
          Find answers to common questions about MEDH&#39;s Personality Development
          Course. Learn about course structure, prerequisites, career prospects,
          and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray-600 shadow-sm">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4 "
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold">
                  {faq.question}
                </h3>
                <span className="md:text-[15px] text-[14px]">
                  {openIndex === index ? (
                    <i class="icofont-caret-down" style={{ fontSize: '20px'  }}></i>
                   
                  ) : (
                    <i class="icofont-caret-right" style={{ fontSize: '20px' }}></i>
                  )}
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
      </div>
      <div className="text-center mt-12 px-4">
        <p>
          Note: If you have any other questions or concerns not covered in the
          FAQs, please feel free to contact our
        </p>
        <p>
          support team{" "}
          <a href="" className="text-[#0000FF] font-semibold">
            care@medh.co
          </a>
          , and we&#39;ll be happy to assist you!
        </p>
      </div>
    </div>
  );
}

export default PersonalityFaq;
