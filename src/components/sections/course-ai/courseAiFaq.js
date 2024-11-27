"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import DOMPurify from "dompurify";

function CourseAiFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is this AI and Data Science course designed for?",
      answer: `
        <p>This course is designed for individuals interested in Artificial Intelligence and Data Science. It is suitable for:</p>
        <ul>
          <li><strong>Beginners</strong>: No prior AI or programming experience needed.</li>
          <li><strong>Professionals</strong>: Enhance your skills and knowledge in AI and Data Science.</li>
        </ul>
      `,
    },
    {
      question: "What is Data Science?",
      answer:
        `<p>The duration of the course is typically 6 weeks, with classes held twice a week.</p>`,
    },
    {
      question: "What is Artificial Intelligence (AI)?",
      answer:
        `<p>Yes, the course is suitable for individuals of all ages, from students to professionals.</p>`,
    },
    {
      question: "Why combine AI and Data Science in one course?",
      answer:
        `<p>The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.</p>`,
    },
    {
      question: "What programming language is used in the course?",
      answer:
        `<p>Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.</p>`,
    },
    {
      question: "Are there any prerequisites for enrolling in this course?",
      answer:
        `<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?</p>`,
    },
    {
      question: "How is the course structured?",
      answer:
        `<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?</p>`,
    },
    {
      question: "Are there any real-world projects included in the course?",
      answer:
        `<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?</p>`,
    },
    {
      question: "What makes MEDH's AI and Data Science course unique?",
      answer:
        `<p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quam?</p>`,
    },
  ];

  return (
    <div className="bg-white pt-4 sm:pt-12 dark:bg-screen-dark text-lightGrey14 dark:text-gray300 flex justify-center items-center flex-col py-4">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray-100">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3">
        Find answers to common questions about MEDH’s AI and Data Science Course. Learn about course structure, prerequisites, career prospects, and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-sm">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold">
                  {faq.question}
                </h3>
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
              </div>
              {openIndex === index && (
                <div
                className="text-lightGrey14 pb-4 px-2 md:pr-12 sm:px-4 md:text-[15px] text-[14px] dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(faq.answer),
                }}
              ></div>
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
