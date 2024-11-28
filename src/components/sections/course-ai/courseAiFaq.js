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
      answer: `<p>Data science is a cross-disciplinary field focused on extracting useful knowledge from data. It combines:</p>
          <ul>
            <li><strong>Statistics and Machine Learning: </strong> To analyze and interpret data.</li>
            <li><strong>Computational Techniques: </strong> For handling large-scale data.</li>
            <li><strong>Application Areas: </strong> Biology, healthcare, business, finance, and internet data.</li>
          </ul>
        `,
    },
    {
      question: "What is Artificial Intelligence (AI)?",
      answer: `<p>AI involves building intelligent systems that can perform complex tasks without explicit programming. Key areas include:</p>
          <ul>
            <li>- Machine Translation</li>
            <li>- Computer Vision</li>
            <li>- Game Playing</li>
            <li>- Self-Driving Vehicles, etc.</li>
          </ul>
        `,
    },
    {
      question: "Why combine AI and Data Science in one course?",
      answer: `<p>Combining AI and Data Science provides a comprehensive skill set that:</p>
        <ul>
            <li><strong>Integrates Analysis and AI Model Building: </strong> For deriving valuable insights.</li>
            <li><strong>Interdisciplinary Approach: </strong> Enhances understanding of real-world data problems.</li>
            <li><strong>Meets Industry Demand: </strong> Prepares students for roles requiring both AI and Data Science expertise.</li>
          </ul>`,
    },
    {
      question: "What programming language is used in the course?",
      answer: `<p>The course primarily uses Python for implementing AI and Data Science concepts. Python is widely used in the industry due to its extensive libraries and ease of use, making it an ideal language for AI and Data Science applications.</p>`,
    },
    {
      question: "Are there any prerequisites for enrolling in this course?",
      answer: `<p>While there are no strict prerequisites, having a basic understanding of programming concepts and familiarity with mathematics (algebra, calculus, and probability) will be beneficial. Basic programming knowledge, preferably in Python, is recommended but not mandatory.</p>`,
    },
    {
      question: "How is the course structured?",
      answer: `<p>The course spans 16 to 48 weeks, with 3-4 hours of content per week. It includes:</p> 
          <ul>
            <li>- Online Classes and Video Lectures</li>
            <li>- Hands-on Exercises and Quizzes</li>
            <li>- <strong>Capstone Project: </strong> In the final week.</li>
          </ul>`,
    },
    {
      question: "Are there any real-world projects included in the course?",
      answer: `<p>Yes, the course includes:</p>
          <ul>
            <li>- Capstone Project(s)</li>
            <li>- <strong>Practical Experience: </strong> Apply knowledge to hands-on AI and Data Science projects.</li>
          </ul>`,
    },
    {
      question: "What makes MEDH's AI and Data Science course unique?",
      answer: `<p>MEDH's AI and Data Science course stands out for its:</p>
          <ul>
            <li><strong>Comprehensive Curriculum: </strong> Covering both AI and Data Science in-depth.</li>
            <li><strong>Expert Instructors: </strong> With extensive industry experience.</li>
            <li><strong>Hands-on Projects: </strong> Ensuring practical experience.</li>
            <li><strong>Flexible Learning: </strong> Access course materials anytime, anywhere.</li>
            <li><strong>Career Support: </strong> Assisting you beyond course completion.</li>
          </ul>`,
    },
  ];

  return (
    <div className="bg-white pt-4 sm:pt-12 dark:bg-screen-dark text-lightGrey14 dark:text-gray300 flex justify-center items-center flex-col py-4">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray-100">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3">
          Find answers to common questions about MEDH’s AI and Data Science
          Course. Learn about course structure, prerequisites, career prospects,
          and more.
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
