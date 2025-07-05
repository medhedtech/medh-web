"use client";
import React, { useState } from "react";
import { BookOpen } from "lucide-react";

const faqs = [
  {
    question: "What is Digital Marketing?",
    answer:
      "Digital marketing encompasses the use of various online channels and platforms to promote products, services, or brands to a targeted audience. It involves leveraging digital technologies and strategies to connect with potential customers, build brand awareness, drive website traffic, and generate leads or sales. Key components of digital marketing include search engine optimization (SEO), social media marketing (SMM), content marketing, email marketing, and online advertising. The goal of digital marketing is to engage and convert prospects into customers, ultimately contributing to the growth and success of businesses in the digital realm.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "What is meant by Data Analytics?",
    answer:
      "Data analytics refers to the process of examining large sets of data to uncover valuable insights, trends, and patterns that can be used to inform decision-making and drive strategic actions. It involves the use of various tools, techniques, and statistical methods to analyze data, identify correlations, and extract meaningful information. Data analytics plays a crucial role in understanding customer behavior, optimizing business processes, predicting future trends, and improving overall performance. By harnessing the power of data analytics, organizations can make informed decisions, enhance operational efficiency, and gain a competitive edge in their respective industries.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Why combine Digital Marketing and Data Analytics in one course?",
    answer:
      "Combining Digital Marketing and Data Analytics in one course offers a holistic approach to understanding and leveraging the symbiotic relationship between the two disciplines. Digital marketing relies on data-driven insights to optimize strategies, target the right audience, and maximize campaign performance. By integrating data analytics into the curriculum, learners gain a comprehensive skill set that is highly relevant in today's digital landscape. This combination equips individuals with the proficiency to create data-informed marketing strategies, enhance customer engagement, and drive impactful business outcomes.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Why Digital Marketing with Data Analytics Online course, and what will I learn from it?",
    answer:
      "The Digital Marketing with Data Analytics Online course is a comprehensive program designed to provide learners with the essential skills and knowledge required to excel in the digital marketing industry. Throughout the course, participants will delve into various facets of digital marketing, including Search Engine Optimization (SEO), Social Media Marketing (SMM), Email Marketing, Content Marketing, and more. Additionally, the course will equip learners with expertise in leveraging data analytics tools to analyze and optimize marketing campaigns for enhanced performance and results.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Is this course suitable for beginners with no prior experience in digital marketing or data analytics?",
    answer:
      "Yes, absolutely! The course is tailored to accommodate learners of all levels, including beginners with no prior experience in digital marketing or data analytics. The curriculum begins with foundational concepts and gradually progresses to more advanced topics, ensuring that all participants can effectively engage and acquire valuable skills irrespective of their background.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "What are the prerequisites for enrolling in the course?",
    answer:
      "There are no strict prerequisites for enrolling in the course. However, having a basic understanding of marketing concepts and a willingness to learn will be beneficial. Familiarity with general computer usage and internet navigation will also facilitate a smoother learning experience.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "What career opportunities are available after completing this course?",
    answer:
      "The course prepares you for various roles, including: Digital Marketing Specialist, Data Marketing Analyst, SEO Analyst/Manager, Social Media Manager, Digital Marketing Manager, Web Analytics Specialist, PPC (Pay-Per-Click) Specialist, Market Research Analyst, Digital Marketing Consultant, Brand Manager, Digital Marketing Strategist, Customer Insights Analyst, etc.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "How long is the course, and can I study at my own pace?",
    answer:
      "The course duration can vary based on the specific curriculum, but it is generally structured for completion within a range of 4 to 12 months (16-48 weeks). This encompasses a weekly commitment of 4-6 hours only, providing the flexibility to align the course pace with your other commitments and schedules.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Will I receive a certificate upon completing the course?",
    answer:
      "Yes, upon successful completion of the Digital Marketing with Data Analytics Online course, you will receive a certificate of completion jointly issued by MEDH and STEM. This esteemed certificate will bolster your resume for job opportunities and can be included in your portfolio. Additionally, you can showcase your newly acquired skills by sharing the certificate on professional networking platforms.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Will I have access to course materials after completing the course?",
    answer:
      "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "How do I enroll in the course, and what are the payment options?",
    answer:
      "To enroll in the course, simply visit our website and find the Digital Marketing with Data Analytics Course page. From there, you can follow the instructions to sign up and make the payment using the available payment options, such as credit/debit cards, online banking, or other supported methods.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Can I interact with other students during the course?",
    answer:
      "Yes, our platform fosters an engaging and collaborative learning environment. You can connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Will I have access to support during the course?",
    answer:
      "Yes, you will have access to: Dedicated Support Forum to Interact with instructors and teaching assistants. Doubts Clarification: Throughout the course. Guidance and Mentorship: Even post completion of the course.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Is there any technical support available if I encounter issues during the course?",
    answer:
      "Absolutely! Our technical support team is available to assist you throughout your learning journey. If you encounter any technical difficulties or have questions related to the course platform, you can reach out to our support team, and they will be happy to help you resolve any issues.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Is the course delivered entirely online?",
    answer:
      "Yes, the course is delivered through a comprehensive online platform, featuring live sessions as well as recordings for convenient access. The online format enables flexibility and accessibility for individuals with diverse schedules and commitments.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Is financial assistance available for the course?",
    answer:
      "Yes, we strive to make our courses accessible to everyone. Financial assistance and/or scholarships may be available based on eligibility. Please reach out to our support team for more information on financial assistance option. Note: If you have any other questions or concerns not covered in the FAQs, please feel free to contact our support team care@medh.co, and we'll be happy to assist you!",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
];

const DigiMarketingFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen px-[50px]">
      <div className="p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-none sm:rounded-2xl px-[45px] py-[28px]">
        <h2 className="text-center font-semibold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 mt-2 sm:mt-4 text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <li key={idx} className="">
              <button
                className={
                  "w-full flex items-start gap-3 py-4 focus:outline-none transition-colors min-h-[44px] " +
                  (openIndex === idx
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                }
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="flex-shrink-0 mt-1">
                  {faq.icon}
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-medium text-sm sm:text-base md:text-lg text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </span>
                </span>
                <svg
                  className={
                    "w-5 h-5 ml-2 transition-transform duration-200 " +
                    (openIndex === idx ? "rotate-180" : "rotate-0")
                  }
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-panel-${idx}`}
                className={
                  "overflow-hidden transition-all duration-300 " +
                  (openIndex === idx ? "max-h-96 py-2" : "max-h-0 py-0")
                }
                aria-hidden={openIndex !== idx}
              >
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {/* Contact Section */}
        <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 text-center">
          <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
            Have more questions about the Digital Marketing with Data Analytics course? Contact our team at <a href="mailto:care@medh.co" className="text-[#3bac63] underline font-semibold">care@medh.co</a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default DigiMarketingFaq;
