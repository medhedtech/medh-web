"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";

function DigiMarketingFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Digital Marketing?",
      answer:
        "Digital marketing encompasses the use of various online channels and platforms to promote products, services, or brands to a targeted audience. It involves leveraging digital technologies and strategies to connect with potential customers, build brand awareness, drive website traffic, and generate leads or sales. Key components of digital marketing include search engine optimization (SEO), social media marketing (SMM), content marketing, email marketing, and online advertising. The goal of digital marketing is to engage and convert prospects into customers, ultimately contributing to the growth and success of businesses in the digital realm.",
    },
    {
      question: "What is meant by Data Analytics?",
      answer:
        "Data analytics refers to the process of examining large sets of data to uncover valuable insights, trends, and patterns that can be used to inform decision-making and drive strategic actions. It involves the use of various tools, techniques, and statistical methods to analyze data, identify correlations, and extract meaningful information. Data analytics plays a crucial role in understanding customer behavior, optimizing business processes, predicting future trends, and improving overall performance. By harnessing the power of data analytics, organizations can make informed decisions, enhance operational efficiency, and gain a competitive edge in their respective industries.",
    },
    {
      question:
        "Why combine Digital Marketing and Data Analytics in one course?",
      answer:
        "Combining Digital Marketing and Data Analytics in one course offers a holistic approach to understanding and leveraging the symbiotic relationship between the two disciplines. Digital marketing relies on data-driven insights to optimize strategies, target the right audience, and maximize campaign performance. By integrating data analytics into the curriculum, learners gain a comprehensive skill set that is highly relevant in today’s digital landscape. This combination equips individuals with the proficiency to create data-informed marketing strategies, enhance customer engagement, and drive impactful business outcomes.",
    },
    {
      question:
        "Why Digital Marketing with Data Analytics Online course, and what will I learn from it?",
      answer:
        "The Digital Marketing with Data Analytics Online course is a comprehensive program designed to provide learners with the essential skills and knowledge required to excel in the digital marketing industry. Throughout the course, participants will delve into various facets of digital marketing, including Search Engine Optimization (SEO), Social Media Marketing (SMM), Email Marketing, Content Marketing, and more. Additionally, the course will equip learners with expertise in leveraging data analytics tools to analyze and optimize marketing campaigns for enhanced performance and results.",
    },
    {
      question:
        "Is this course suitable for beginners with no prior experience in digital marketing or data analytics?",
      answer:
        "Yes, absolutely! The course is tailored to accommodate learners of all levels, including beginners with no prior experience in digital marketing or data analytics. The curriculum begins with foundational concepts and gradually progresses to more advanced topics, ensuring that all participants can effectively engage and acquire valuable skills irrespective of their background.",
    },
    {
      question: "What are the prerequisites for enrolling in the course?",
      answer:
        "There are no strict prerequisites for enrolling in the course. However, having a basic understanding of marketing concepts and a willingness to learn will be beneficial. Familiarity with general computer usage and internet navigation will also facilitate a smoother learning experience.",
    },
    {
      question:
        "What career opportunities are available after completing this course?",
      answer:
        "The course prepares you for various roles, including: Digital Marketing Specialist, Data Marketing Analyst, SEO Analyst/Manager, Social Media Manager, Digital Marketing Manager, Web Analytics Specialist, PPC (Pay-Per-Click) Specialist, Market Research Analyst, Digital Marketing Consultant, Brand Manager, Digital Marketing Strategist, Customer Insights Analyst, etc.",
    },
    {
      question: "How long is the course, and can I study at my own pace?",
      answer:
        "The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 4 to 12 months (16-48 weeks). This encompasses a weekly commitment of 4-6 hours only, providing the flexibility to align the course pace with your other commitments and schedules.",
    },
    {
      question: "Will I receive a certificate upon completing the course?",
      answer:
        "Yes, upon successful completion of the Digital Marketing with Data Analytics Online course, you will receive a certificate of completion jointly issued by MEDH and STEM. This esteemed certificate will bolster your resume for job opportunities and can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms.",
    },
    {
      question:
        "Will I have access to course materials after completing the course?",
      answer:
        "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    },
    {
      question:
        "How do I enroll in the course, and what are the payment options?",
      answer:
        "To enroll in the course, simply visit our website and find the Digital Marketing with Data Analytics Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods.",
    },
    {
      question: "Can I interact with other students during the course?",
      answer:
        "Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
    },
    {
      question: "Will I have access to support during the course?",
      answer:
        "Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course.",
    },
    {
      question:
        "Is there any technical support available if I encounter issues during the course?",
      answer:
        "Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues.",
    },
    {
      question: "Is the course delivered entirely online?",
      answer:
        "Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments.",
    },
    {
      question: "Is financial assistance available for the course?",
      answer:
        "Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option. Note: If you have any other questions or concerns not covered in the FAQs, please feel free to contact our support team care@medh.co, and we’ll be happy to assist you!",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[90%] dark:text-gray-200">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray50">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3">
          Find answers to common questions about MEDH&#39;s Digital Marketing
          with Data Analytics Course. Learn about course structure,
          prerequisites, career prospects, and more.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border dark:border-gray600 shadow-md">
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

export default DigiMarketingFaq;
