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
        "At Medh, we foster a collaborative, inclusive, and innovative work culture. We believe in supporting each other, encouraging creativity, and celebrating successes together.",
    },
    {
      question: "What career development opportunities does Medh offer?",
      answer:
        "Medh is committed to your professional growth. We offer access to training sessions, workshops, and mentorship programs to help you advance in your career.",
    },
    {
      question: "What benefits can I expect as a Medh employee?",
      answer:
        "As a Medh employee, you can expect competitive compensation, flexible work arrangements, comprehensive health and wellness programs, and a supportive work environment.",
    },
    {
      question: "How can I apply for a job at Medh?",
      answer:
        "To apply, visit our Careers Page and click on the “Apply Now” button next to the job listing that interests you. Follow the instructions to submit your resume and cover letter.",
    },
    {
      question: "What is the recruitment process at Medh?",
      answer:
        "Our recruitment process typically involves an initial application review, followed by a phone/video interview, an assessment or task related to the role, and a final interview. We strive to make the process smooth and efficient for all candidates.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[92%]">
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
