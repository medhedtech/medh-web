"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

function HireFromMedhFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Recruit@Medh?",
      answer:
        "Recruit@Medh is our dedicated department that facilitates the recruitment of highly skilled and qualified IT professionals for various job roles in the IT industry. We work closely with both our students, professional job-seekers and industry partners to bridge the gap between talent and opportunities.",
    },
    {
      question: "What types of IT professionals does Recruit@Medh cater to?",
      answer:
        "We cater to a wide range of IT professionals, including AI Platform Developers, Web Developers, Data Scientists, Cybersecurity specialists, System administrators, Database administrators, UX/UI designers, and more. We strive to meet the diverse hiring needs of organizations within the IT sector.",
    },
    {
      question: "How to hire the right candidate?",
      answer:
        "We have a pool of trained candidates with hands on experience, and have worked on industry relevant capstones in IT domain. Hiring companies can review, shortlist, assess and interview the candidates based on their requirements and hire the best candidates.",
    },
    {
      question: "What is the benefit of hiring employees from Recruit@Medh?",
      answer:
        "Organisations will get trained and certified IT candidates with hands on experience from Recruit@Medh. We also offer dedicated hiring support so hiring becomes easier.",
    },
    {
      question: "How can my company collaborate with Recruit@Medh for hiring?",
      answer:
        "To collaborate with our Placement Cell, you can reach out to our placement coordinator or contact our placement cell through email or phone. We will understand your specific hiring requirements and work with you to identify suitable candidates from our pool of talented IT professionals.",
    },
    {
      question: "Is there any limit to hiring employees from Recruit@Medh?",
      answer:
        "You can hire as many candidates as you want from us.",
    },
    {
      question: "For which locations can I hire candidates from Recruit@Medh?",
      answer:
        "Candidates are available across India as well as globally.",
    },
    {
      question: "What sets the candidates from Recruit@Medh apart from others?",
      answer:
        "Our candidates undergo rigorous training and skill development. They receive a well-rounded education, gain hands-on experience through projects, and are mentored by experienced professionals. This ensures that our candidates are well-prepared to meet the demands of the IT industry.",
    },
    {
      question: "Are there any opportunities for companies to interact with potential candidates directly?",
      answer:
        "Yes, we regularly organize placement drives, job fairs, and recruitment events where companies can interact with our students and alumni directly. These events provide a platform for companies to showcase their organization and job opportunities while allowing candidates to learn more about the company culture and job roles available.",
    },
    {
      question: "Can companies offer internships to IT students through Recruit@Medh?",
      answer:
        "Absolutely! We encourage companies to offer internships to our IT students. Internships are an excellent way for students to gain practical experience and understand the real-world dynamics of the IT industry. It also allows companies to assess the intern’s potential for future full-time roles.",
    },
    {
      question: "What support does Recruit@Medh provide during the recruitment process?",
      answer:
        "We offer end-to-end support during the recruitment process. We assist with job postings, candidate shortlisting, scheduling interviews, coordinating with candidates and companies, and facilitating the final selection process. We act as a bridge between the company and the candidates to ensure a smooth hiring experience for both parties.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center items-center flex-col py-4 pb-8">
      <div className="md:w-[80%] w-[90%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center dark:text-white text-[#5C6574]">
          Frequently Asked Questions (FAQs)
        </h2>
        
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
        </div>
      </div>
    </div>
  );
}

export default HireFromMedhFaq;
