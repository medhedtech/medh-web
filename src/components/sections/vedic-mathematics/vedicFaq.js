import React, { useState } from "react";
import { BookOpen } from "lucide-react";

const faqs = [
  {
    question: "What is Vedic Math?",
    answer:
      "Vedic Math is an ancient Indian system of mathematics, also known as 'Veda Ganita.' It's based on a collection of sutras (aphorisms) and sub-sutras (corollaries) that provide efficient and quick methods for arithmetic and algebraic calculations. Vedic Math emphasizes mental math techniques to perform calculations with ease and speed.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Who can take the Vedic Maths Course?",
    answer:
      "The duration of the course is typically 6 weeks, with classes held twice a week.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "How long does the course usually last?",
    answer:
      "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Can Vedic Math be used in everyday life?",
    answer:
      "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Will Vedic Math classes complement a students academic performance?",
    answer:
      "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Is Vedic Math course different from Math tuitions?",
    answer: `It is an (after-school) math-learning program. Unlike home-based tuition that primarily focuses on the school syllabus and test preparation, Vedic Math is a skill development program aimed at enhancing a child's ability to perform calculations. This proficiency not only benefits their performance in school mathematics but also in math Olympiads. \nImportantly, Vedic Mathematics should not be seen as a replacement for traditional math but rather as a valuable complement to it. While some of the techniques may be intriguing and advantageous for certain calculations, a thorough grasp of the fundamental concepts of regular mathematics remains essential for a comprehensive understanding of the subject.`,
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "How long is the course, and can I study at my own pace?",
    answer:
      "The duration of the course is typically 6 weeks, with classes held twice a week.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "How long does the course usually last?",
    answer:
      "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Will I receive a certificate upon completing the course?",
    answer:
      "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Will I have access to course materials after completing the course?",
    answer:
      "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Can I interact with other students during the course?",
    answer:
      "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Will I have access to support during the course?",
    answer:
      "Yes, you will retain lifetime access to the course materials even after completing the course. You can refer back to the content for future review or to refresh your knowledge as needed.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question:
      "Is there any technical support available if I encounter issues during the course?",
    answer:
      "The duration of the course is typically 6 weeks, with classes held twice a week.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Is the course delivered entirely online?",
    answer:
      "Yes, the course is suitable for individuals of all ages, from students to professionals.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Will I receive a certificate upon completing the course?",
    answer:
      "The course covers various topics such as communication skills, leadership, teamwork, and self-awareness.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
  {
    question: "Is financial assistance available for the course?",
    answer:
      "Absolutely! The skills learned in this course are highly beneficial for career growth and personal development.",
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />
  },
];

const VedicFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen px-4 sm:px-[50px]">
      <div className="p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-none sm:rounded-2xl px-4 sm:px-[45px] py-[28px]">
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
            Have more questions about the Vedic Mathematics course? Contact our team at <a href="mailto:care@medh.co" className="text-[#3bac63] underline font-semibold">care@medh.co</a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default VedicFaq;
