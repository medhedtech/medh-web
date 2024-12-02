"use client";
import React, { useState } from "react";
import Image from "next/image";
import Left from "@/assets/images/personality/left.svg";
import Down from "@/assets/images/personality/down.svg";
import { DownIcon, LeftIcon } from "@/assets/images/icon/FaqIcon";

export default function SchoolFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question:
        "What is the process for schools/institutes to partner with Medh?",
      answer:
        "To partner with Medh, visit our Collaboration Page, fill out the partnership inquiry form, and our team will get in touch to discuss the details and tailor a collaboration plan that fits your institution’s needs.",
    },
    {
      question: "What are the key benefits of partnering with Medh?",
      answer:
        "Partnering with Medh offers numerous benefits including enhanced curriculum, diversified skill sets, access to specialized expertise, integration of advanced technology, cost-effective solutions, scalability, increased student engagement, data-driven insights, teacher empowerment, and better preparation for future careers.",
    },
    {
      question: "How does Medh enhance the existing curriculum?",
      answer:
        "MEDH enriches the existing curriculum by integrating cutting-edge technologies and innovative teaching methods, making learning more engaging, interactive, and effective for students.",
    },
    {
      question: "What kind of skill development programs does Medh offer?",
      answer:
        "MEDH offers a diverse range of skill development programs that prepare students for a rapidly evolving job market, equipping them with a broader range of competencies tailored to specific skills and industries.",
    },
    {
      question: "How does Medh ensure the quality of its courses?",
      answer:
        "Our subject matter experts design and deliver specialized courses, ensuring that students receive high-quality education tailored to specific skills and industries. We also provide regular updates based on the latest educational research and feedback from students and educators.",
    },
    {
      question: "How does Medh integrate technology into teaching methods?",
      answer:
        "Medh collaborates with institutions to integrate state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students’ digital literacy and technological proficiency.",
    },
    {
      question: "Is partnering with Medh cost-effective?",
      answer:
        "Yes, collaborating with Medh provides cost-effective alternatives compared to developing in-house skill development courses, offering a broader range of skill development opportunities without straining budgets.",
    },
    {
      question: "Can Medh's solutions accommodate a large number of students?",
      answer:
        "Yes, Medh’s solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education. Additionally, these courses can be tailored to suit various academic schedules.",
    },
    {
      question: "How does Medh increase student engagement and motivation?",
      answer:
        "Medh uses gamified learning, interactive quizzes, and real-time progress tracking to make the learning process more enjoyable and encourage active participation and motivation among students.",
    },
    {
      question:
        "What kind of data-driven insights does Medh provide to educators?",
      answer:
        "We provide comprehensive data analytics and insights to educators, enabling them to track students’ progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
    },
    {
      question: "How does Medh empower teachers?",
      answer:
        "Skill development collaboration with Medh empowers teachers by providing them with training and resources to implement modern teaching methodologies, boosting their confidence and teaching abilities, ultimately benefiting the students.",
    },
    {
      question: "How does Medh prepare students for future careers?",
      answer:
        "Medh prepares students for future careers by aligning the curriculum with industry demands, ensuring that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
    },
    {
      question: "What makes Medh’s approach to education innovative?",
      answer:
        "Medh’s approach to education promotes independence, enhances creativity, encourages teamwork, develops social skills, improves communication skills, and prepares students to think on their feet and take calculated risks.",
    },
    {
      question: "How can we get started with Medh?",
      answer:
        "To get started with Medh, visit our Collaboration Page or contact our support team at support@medh.co. We look forward to collaborating with you to bring innovative and effective education solutions to your institution.",
    },
  ];

  return (
    <div className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[92%]">
        <h2 className="md:text-3xl text-[22px] font-bold mb-4 text-center text-[#5C6574] dark:text-gray50">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-center md:text-[15px] text-[14px] mb-8 md:px-14 px-3 dark:text-gray300 ">
          Explore answers to common questions about partnering with MEDH. Learn
          about the partnership process, benefits, prerequisites, and more for
          schools and institutes.
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
                <p className="text-lightGrey14 pb-4 px-2 md:pr-12 sm:px-4 md:text-[15px] text-[14px] dark:text-gray-400 ">
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
