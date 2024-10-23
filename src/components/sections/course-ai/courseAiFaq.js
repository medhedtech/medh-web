"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";

function CourseAiFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is This AI and Data Science Course Designed For?",
      answer:
        "The Personality Development Course is designed to help individuals enhance their personal and professional skills through various interactive sessions and practical exercises.",
    },
    {
      question: "What is Data Science?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "What is Artificial Intelligence (AI)?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Why combine AI and Data Science in one course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: "What programming language is used in the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Are there any prerequisites for enrolling in this course?",
      answer:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?",
    },
    {
      question: "How is the course structured?",
      answer:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?",
    },
    {
      question: "Are there any real-world projects included in the course?",
      answer:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?",
    },
    {
      question: "What makes MEDH's AI and Data Science course unique?",
      answer:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?",
    },
  ];

  return (
    <div className="bg-white text-lightGrey14 flex justify-center items-center flex-col py-4">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3">
          Find answers to common questions about MEDH's Personality Development
          Course. Learn about course structure, prerequisites, career prospects,
          and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border shadow-sm">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold">
                  {faq.question}
                </h3>
                <span className="md:text-[15px] text-[14px]">
                  {openIndex === index ? (
                    <Image src={Down} width={25} height={23} alt="Down Icon" />
                  ) : (
                    <Image src={Left} width={30} height={25} alt="Left Icon" />
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
          , and we’ll be happy to assist you!
        </p>
      </div>
    </div>
  );
}

export default CourseAiFaq;
