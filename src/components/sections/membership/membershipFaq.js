"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

export default function MembershipFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is MEDH Membership?",
      answer:
        "MEDH Membership is a program designed to provide members with exclusive access to educational resources, discounts on courses, personalized support, and more. It aims to enhance the learning experience and support the professional development of individuals, students, and educational institutions.",
    },
    {
      question: "What are the benefits of the Silver Membership?",
      answer:
        "You have the flexibility to explore and learn any or all courses within a ‘Single-Course-Category’ of your choice. Additionally, Silver Membership provides exclusive content access, discounts on courses, community engagement opportunities, and a monthly newsletter. It is perfect for those seeking high-quality educational resources and a chance to connect with a like-minded community.",
    },
    {
      question: "What additional benefits does the Gold Membership provide?",
      answer:
        "You have the flexibility to explore and learn any programs within the ‘Three Course Categories’ of your choice. Additionally, the Gold Membership includes all the benefits of the Silver Membership, plus premium content access, personalized support, early access to new courses, and higher discount rates on all MEDH courses and programs. This membership is ideal for those seeking a more personalized and advanced learning experience.",
    },
    {
      question: "How can I join MEDH Membership?",
      answer:
        "To join MEDH Membership, simply visit our Membership Page, choose the membership level that suits your needs (Silver or Gold), and complete the registration process. Once registered, you will gain immediate access to all the benefits of your chosen membership level.",
    },
    {
      question: "Can I upgrade from Silver to Gold Membership?",
      answer:
        "Yes, you can upgrade from Silver to Gold Membership at any time. Simply visit your account settings and select the upgrade option to enjoy the additional benefits of Gold Membership.",
    },
    {
      question: "Are there any discounts for educational institutions?",
      answer:
        "Yes, MEDH offers special discounts and tailored membership plans for educational institutions. Please contact our support team at support@medh.co for more information on institutional memberships and discounts.",
    },
    {
      question: "How often is new content added to the membership library?",
      answer:
        "New content is added to the membership library on a regular basis. Members will receive notifications about new additions through our monthly newsletter and member forums",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-gray50 text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] dark:text-gray300 text-[14px] mb-8 md:px-14 px-3 ">
          Find answers to common questions about MEDH’s Corporate Training
          Courses.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-md">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4 dark:text-gray300"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold ">
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
