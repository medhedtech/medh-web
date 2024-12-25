"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

function PlacementFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question:
        "What are the prerequisites for enrolling in Medh's 100% Job Guaranteed Courses?",
      answer:
        "To enroll in our 100% Job Guaranteed Courses, you must: Be legally authorized to work in the country where you are seeking employment. Meet any specific prerequisites outlined for the course you are interested in (e.g., prior knowledge, educational background).",
    },
    {
      question: "What is the structure of Medh's 100% Job Guaranteed Courses?",
      answer:
        "Our courses are designed to combine theoretical knowledge with practical application. You will engage in: Hands-on projects, Case studies, Real-world simulations, Corporate internships, Job Readiness Programs",
    },
    {
      question: "How does Medh's Job Guarantee work?",
      answer:
        "Upon successful completion of the course, if you do not receive a job offer in your field, we guarantee: A 100% refund of your tuition fee, Additional job readiness modules to enhance your employability",
    },
    {
      question: "What are the terms and conditions for the Job Guarantee?",
      answer:
        "To qualify for the job guarantee, you must: Complete all course requirements and obtain a Certificate of Completion. Participate in weekly career commitments, including job applications, outreach, and relevant contributions., Engage in corporate internships and industry-aligned certifications as part of the program., Be actively involved in the job search process for a specified period after course completion.",
    },
    {
      question:
        "What happens if I do not get a job after completing the course?",
      answer:
        "If you meet all the program requirements and still do not secure a job, you can apply for a tuition refund. The process includes: Submitting a request for a refund within 30 days of the Termination Date listed in your Job Guarantee agreement., Providing necessary documentation to verify your job search efforts and compliance with the program’s terms.",
    },
    {
      question: "Are there any additional costs involved in the program?",
      answer:
        "No, the tuition fee covers all aspects of the course, including: Course materials, Internship placement, Career support services",
    },
    {
      question: "What kind of support will I receive during the job search?",
      answer:
        "Our dedicated career services team will assist you with: Resume building, Interview preparation, Job application guidance, Networking opportunities",
    },
    {
      question:
        "Can international learners apply for the Job Guaranteed Courses?",
      answer:
        "Currently, the Job Guarantee is available only to learners who are citizens or permanent residents of the country where the job placement is offered.",
    },
    {
      question: "How do I apply for a tuition refund if I don't get a job?",
      answer:
        "To apply for a tuition refund, you must:Ensure you have met all the course requirements and career commitments., Submit a written request for a refund within 30 days of the Termination Date., Provide documentation of your job search efforts and compliance with the program’s terms.",
    },
    {
      question:
        "What is the expected time frame to secure a job after course completion?",
      answer:
        "We expect you to actively engage in the job search process for up to 100 days after course completion. During this period, you should fulfill all career commitments outlined in your Job Guarantee agreement.",
    },
    {
      question: "Transparent Process for Course Fee Refunds",
      answer:
        "By adhering to these guidelines, we ensure a fair and transparent process for all involved, providing you with the confidence and support needed to secure your dream job.",
    },
  ];

  return (
    <div
      className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center items-center flex-col py-4 pb-8"
    >
      <div className="md:w-[80%] w-[94%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-white text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="mt-[-1%]">
          <p className=" w-[96%]  sm:w-[100%] text-[#727695] text-center text-[14px] sm:text-[14.5px] md:text-[15px] lg:text-[15.5px] xl:text-[16px] dark:text-gray300 leading-5 sm:leading-6 md:leading-7 lg:leading-7 font-light pt-1 flex-grow">
            Discover answers to frequently asked questions about Medh&#39;s Job
            Guaranteed Courses.
          </p>
          <p className="text-[#727695] text-center text-[14px] sm:text-[14.5px] md:text-[15px] lg:text-[15.5px] xl:text-[16px] dark:text-gray300 leading-5 sm:leading-6 md:leading-7 lg:leading-7 font-light pt-0 pb-8 flex-grow">
            Learn about the process, prerequisites, career opportunities, refund
            policies, and more.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-sm">
              <div
                className="flex justify-between items-center py-4 cursor-pointer px-2 sm:px-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-[15px] text-[14px] font-semibold dark:text-white">
                  {faq.question}
                </h3>
                <span
                  className={`md:text-[15px] text-[14px] ${
                    openIndex === index ? "text-white" : "text-black"
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
          <div className="flex items-center justify-center mt-4 w-full">
            <p className="sm:w-[70%] w-[96%] mx-auto text-[#727695] text-center text-[14px] sm:text-[14.5px] md:text-[15px] lg:text-[15.5px] xl:text-[16px] dark:text-gray300 leading-5 sm:leading-6 md:leading-7 lg:leading-7 font-light pt-0 py-8">
              Note: If you have any other questions or concerns not covered in
              the FAQs, please feel free to contact our support team at{" "}
              <a
                href="mailto:care@medh.co"
                className="text-blue underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
              >
                care@medh.co
              </a>
              , and we&#39;ll be happy to assist you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacementFaq;
