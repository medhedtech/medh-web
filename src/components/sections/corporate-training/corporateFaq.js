"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CorporateFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
      answer: "Our courses are designed to cover a wide range of topics, from technical skills such as AI, Data Science, Cybersecurity, and Cloud Computing to soft skills like Leadership, Communication and Personality Development Courses. The learning objectives are tailored to equip participants with practical, industry-relevant skills and knowledge.",
    },
    {
      question: "What are the delivery methods for MEDH's Corporate Training Courses?",
      answer: "Our courses are typically delivered through a flexible 6-week program with classes held twice a week. We offer both online and in-person training options, with interactive sessions, hands-on workshops, and comprehensive learning materials.",
    },
    {
      question: "What are the pricing and payment options for MEDH's Corporate Training Courses?",
      answer: "We offer customized pricing based on the specific needs of your organization. Our pricing models include per-participant rates, bulk enrollment discounts, and tailored corporate packages. We provide flexible payment options including corporate invoicing, bulk payment discounts, and installment plans.",
    },
    {
      question: "Are MEDH's Corporate Training Courses certified or accredited?",
      answer: "Yes, our courses are designed with industry standards in mind. Upon completion, participants receive a recognized certification that validates their newly acquired skills. Our certifications are aligned with industry benchmarks and can enhance professional credentials.",
    },
    {
      question: "Can MEDH tailor the training courses to specific business needs?",
      answer: "Absolutely! We specialize in creating customized training programs that address your organization's unique skill gaps and strategic objectives. Our team works closely with you to develop a tailored curriculum that aligns with your specific business requirements.",
    },
    {
      question: "What are the qualifications and industry experience of MEDH's instructors?",
      answer: "Our instructors are seasoned IT professionals with extensive industry experience and a proven track record of providing high-quality training. They bring real-world insights and practical knowledge to the training sessions, ensuring participants gain actionable skills directly applicable to their work.",
    },
    {
      question: "What post-training support and resources does MEDH provide?",
      answer: "We offer comprehensive post-training support including access to learning materials, follow-up mentorship sessions, career guidance, and a professional network. Participants also receive ongoing access to our learning platform and resources for continued skill development.",
    },
    {
      question: "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
      answer: "Our courses stand out through our industry-aligned curriculum, experienced instructors, personalized learning approach, and comprehensive support. We focus on practical, hands-on learning that directly translates to workplace performance, setting us apart from traditional training providers.",
    },
    {
      question: "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
      answer: "Our enrollment process is straightforward. After an initial consultation to understand your needs, we provide a detailed proposal. Once agreed, we help you schedule the training, set up participant accounts, and provide pre-course materials. The entire process from initial contact to course commencement typically takes 2-4 weeks.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-screen-dark text-gray-800 dark:text-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-[#7ECA9D]">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Find answers to common questions about MEDH's Corporate Training Courses. 
            Can't find what you're looking for? We're here to help!
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-[#7ECA9D]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-gray-700 dark:text-gray-300"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Have a question that isn't answered here?
            </p>
            <p>
              Contact our support team at{" "}
              <a 
                href="mailto:care@medh.co" 
                className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200 font-semibold"
              >
                care@medh.co
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
