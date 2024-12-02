"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

export default function EducatorFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question:
        "What qualifications do educators need to have to apply for a position at Medh EdTech?",
      answer:
        "The specific qualifications may vary depending on the role and subject being taught. Generally, educators are expected to have a relevant degree in the subject they will teach. Additional certifications, teaching credentials, or prior experience in online teaching may also be preferred.",
    },
    {
      question:
        "Is prior teaching experience necessary to become an educator with Medh EdTech?",
      answer:
        "While prior teaching experience is valuable, it may not always be a strict requirement. The company may consider candidates with a strong passion for education and subject matter expertise, even if they haven’t taught formally before.",
    },
    {
      question: "How can I apply to become an educator with Medh Edtech?",
      answer:
        "To apply, candidates can visit the company’s website or job portals where open positions are advertised. They can submit their application along with a resume, cover letter, and any other required documents.",
    },
    {
      question: "Are educators required to work full-time or part-time?",
      answer:
        "The company has both full-time and part-time educator positions available. The specific work arrangement will be discussed during the interview process.",
    },
    {
      question:
        "What technology or tools will educators need to use for online teaching?",
      answer:
        "Educators will typically need access to a computer or laptop, a stable internet connection, and proficiency in using the company’s chosen virtual classroom platform or other online teaching tools.",
    },
    {
      question:
        "Is training provided to educators before they start teaching online?",
      answer:
        "Yes, we do provide onboarding and training to educators, which may include familiarization with the teaching platform, company policies, and effective online teaching techniques.",
    },
    {
      question: "How are educators evaluated for their performance?",
      answer:
        "Educators may be evaluated based on student feedback, teaching effectiveness, adherence to company standards, and other performance metrics set by the company.",
    },
    {
      question:
        "What professional development opportunities are available for educators?",
      answer:
        "We offer various professional development opportunities, such as workshops, webinars, and resources to help educators enhance their teaching skills and stay up-to-date with the latest educational trends.",
    },
    {
      question:
        "What benefits and compensation packages are offered to educators?",
      answer:
        "The company may provide information about benefits, compensation, and other perks during the interview or offer stage. It could include details about salary, health benefits, and any additional incentives.",
    },
    {
      question: "What are the prerequisites for becoming an educator at Medh?",
      answer:
        "To join MEDH as an educator, you need a relevant qualification in the subject you wish to teach, experience in education or training, and a passion for skill development. Specific requirements may vary depending on the course.",
    },
    {
      question: "What is the structure of the courses at Medh?",
      answer:
        "MEDH offers a variety of skill development courses that range in duration and complexity, tailored to meet the needs of different age groups. Courses are designed to be engaging and interactive, leveraging cutting-edge technology for a superior learning experience.",
    },

    {
      question: "What career prospects are available for Medh educators?",
      answer:
        "Educators at MEDH have the opportunity to advance their careers through continuous professional development, networking with other experts in the field, and contributing to innovative educational projects.",
    },
    {
      question: "What kind of support does Medh provide to its educators?",
      answer:
        "Medh provides extensive support to its educators, including access to teaching resources, ongoing training, and technical support to help you deliver high-quality education.",
    },
    {
      question: "How does MEDH ensure the quality of its courses?",
      answer:
        "Medh maintains high standards through rigorous course development processes, regular updates based on the latest educational research, and feedback from students and educators.",
    },

    {
      question: "What are the benefits of joining Medh as an educator?",
      answer:
        "Joining Medh offers numerous benefits, such as flexible working hours, opportunities for professional growth, and the chance to make a significant impact on learners’ lives through skill development.",
    },
    {
      question: "How does Medh use technology in its courses?",
      answer:
        "Medh leverages the latest in educational technology, including interactive platforms, virtual classrooms, and multimedia content, to create an engaging and effective learning environment.",
    },
    {
      question: "Can I teach multiple courses at Medh?",
      answer:
        "Yes, educators who have the required qualifications and experience can apply to teach multiple courses, which allows for a broader impact and varied teaching experiences.",
    },
    {
      question:
        "How can I get more information or assistance during the application process?",
      answer:
        "If you need any assistance or have additional questions, please contact our support team at support@medh.co or visit our Contact Us page.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[91%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-gray50 text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3 dark:text-gray300 ">
          Find answers to common questions about MEDH’s Corporate Training
          Courses.
        </p>
        <div className="space-y-4 dark:text-gray300">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-md">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold">
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
