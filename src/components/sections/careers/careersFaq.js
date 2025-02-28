"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "What is Medh's work culture like?",
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
      'To apply, visit our Careers Page and click on the "Apply Now" button next to the job listing that interests you. Follow the instructions to submit your resume and cover letter.',
  },
  {
    question: "What is the recruitment process at Medh?",
    answer:
      "Our recruitment process typically involves an initial application review, followed by a phone/video interview, an assessment or task related to the role, and a final interview. We strive to make the process smooth and efficient for all candidates.",
  },
];

const FaqItem = ({ question, answer, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border dark:border-gray600 shadow-md rounded-lg overflow-hidden"
    >
      <button
        className="w-full flex justify-between items-center py-4 px-4 text-[#727695] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <h3 className="md:text-[15px] text-[14px] font-bold dark:text-gray300 text-left">
          {question}
        </h3>
        <span className="text-black dark:text-white">
          {isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            id={`faq-answer-${index}`}
            className="overflow-hidden"
          >
            <p className="text-lightGrey14 pb-4 px-4 md:pr-12 md:text-[15px] text-[14px] dark:text-gray300">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function CareerFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-screen-dark text-lightGrey14 flex justify-center py-10">
      <div className="md:w-[80%] w-[92%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="md:text-3xl text-[22px] font-bold mb-4 dark:text-white text-[#5C6574]">
            Frequently Asked Questions (FAQs)
          </h2>
          <p className="md:text-[15px] text-[14px] md:px-14 dark:text-gray300 px-3">
            Discover answers to common questions about becoming an integral part
            of the MEDH team. Learn about the application process, pre-requisites,
            career opportunities, and more.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
