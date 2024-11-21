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
    {
      question: "Is this Personality Development Course from Medh is suitable for homemakers / housewives?",
      answer:"Certainly! Our Personality Development Course is well-suited for homemakers and housewives, equipping them with essential life skills, confidence, and interpersonal abilities. It fosters personal growth, enhances communication and leadership skills, and provides valuable tools for managing stress, time, and relationships. Our program aims to boost confidence, improve family life, and empower women in their roles as homemakers, offering practical guidance and support to help them effectively manage their responsibilities and find fulfillment in their daily lives."
    },
    {
      question: "Are there any prerequisites for enrolling in the course?",  
      answer:"There are no specific prerequisites for enrolling in the course. It is open to individuals from all backgrounds and professions. The only requirement is the willingness to learn and grow personally and professionally."
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:"The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 3 to 9 months (12-36 weeks). This encompasses a weekly commitment of 2-3 hours only, providing the flexibility to align the course pace with your other commitments and schedules."
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:"Yes, upon successful completion of the AI with Data Analytics course, you will receive a certificate of completion issued by MEDH. This esteemed certificate can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms."
    },
    {
      question:"Will I have access to course materials after completing the course?",
      answer:"Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed."
    },
    {
      question:"How do I enroll in the course, and what are the payment options?",
      answer:"To enroll in the course, simply visit our website and find the Personality Development Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods."
    },
    {
      question:"Can I interact with other students during the course?",
      answer:"Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience."
    },
    {
      question:"What if I have questions or need additional support during the course?",
      answer:"Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course."
    },
    {
      question:"Is there any technical support available if I encounter issues during the course?",
      answer:"Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues."
    },
    {
      question:"Is the course delivered entirely online?",
      answer:"Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments."
    },
    {
      question:"Is financial assistance available for the course?",
      answer:"Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option."
    }
  ];

  return (
    <div className="bg-white pt-4 sm:pt-12 dark:bg-screen-dark text-lightGrey14 dark:text-gray300 flex justify-center items-center flex-col py-4">
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
