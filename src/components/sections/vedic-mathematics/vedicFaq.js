"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";

function VedicFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Vedic Math?",
      answer:
        "Vedic Math is an ancient Indian system of mathematics, also known as “Veda Ganita.” It’s based on a collection of sutras (aphorisms) and sub-sutras (corollaries) that provide efficient and quick methods for arithmetic and algebraic calculations. Vedic Math emphasizes mental math techniques to perform calculations with ease and speed.",
    },
    {
      question: "Who can take the Vedic Maths Course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "How long does the course usually last?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Can Vedic Math be used in everyday life?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question:
        "Will Vedic Math classes complement a students academic performance?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Is Vedic Math course different from Math tuitions?",
      answer: `It is an (after-school) math-learning program. Unlike home-based tuition that primarily focuses on the school syllabus and test preparation, Vedic Math is a skill development program aimed at enhancing a child’s ability to perform calculations. This proficiency not only benefits their performance in school mathematics but also in math Olympiads. \nImportantly, Vedic Mathematics should not be seen as a replacement for traditional math but rather as a valuable complement to it. While some of the techniques may be intriguing and advantageous for certain calculations, a thorough grasp of the fundamental concepts of regular mathematics remains essential for a comprehensive understanding of the subject.`,
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "How long does the course usually last?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question:
        "Will I have access to course materials after completing the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Can I interact with other students during the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
    {
      question: "Will I have access to support during the course?",
      answer:
        "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    },
    {
      question:
        "Is there any technical support available if I encounter issues during the course?",
      answer:
        "The duration of the course is typically 6 weeks, with classes held twice a week.",
    },
    {
      question: "Is the course delivered entirely online?",
      answer:
        "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    },
    {
      question: "Is financial assistance available for the course?",
      answer:
        "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    },
  ];

  return (
    <div className="bg-white  dark:bg-screen-dark text-lightGrey14 flex justify-center py-10 ">
      <div className="md:w-[80%] w-[90%] dark:text-gray-300">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray50">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3">
          Find answers to common questions about MEDH&#39;s Vedic Maths Course.
          Learn about course structure, prerequisites, certifications, and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray-600 shadow-sm ">
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
                <p className="text-lightGrey14 pb-4 px-2 md:pr-12 sm:px-4 md:text-[15px] text-[14px] ">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VedicFaq;
