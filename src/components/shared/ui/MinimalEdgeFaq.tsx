import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { IFAQ } from "./CommonFaq";

interface MinimalEdgeFaqProps {
  faqs: IFAQ[];
  title?: string;
  contactText?: string;
  contactEmail?: string;
}

const MinimalEdgeFaq: React.FC<MinimalEdgeFaqProps> = ({
  faqs,
  title = "Frequently Asked Questions",
  contactText = "Have more questions? Contact our team at",
  contactEmail = "care@medh.co",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 px-0 sm:px-8 md:px-[50px] pb-0 mb-0">
      <div className="p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-none sm:shadow-lg rounded-none sm:rounded-2xl px-4 sm:px-6 md:px-[45px] py-6 sm:py-6 md:py-[28px] mb-0 sm:mb-[60px]">
        <h2 className="text-center font-semibold text-xl sm:text-lg md:text-2xl mb-6 sm:mb-6 mt-0 sm:mt-4 text-slate-800 dark:text-slate-100">{title}</h2>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <li key={idx} className="">
              <button
                className={
                  "w-full flex items-start gap-3 py-4 sm:py-4 focus:outline-none transition-colors min-h-[44px] px-2 sm:px-0 " +
                  (openIndex === idx
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                }
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="flex-shrink-0 mt-1">
                  {faq.icon
                    ? React.cloneElement(faq.icon as React.ReactElement, {
                        className: ((faq.icon as React.ReactElement).props.className || "") + " text-[#3bac63]",
                        color: "#3bac63",
                      })
                    : <BookOpen className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#3bac63]" />}
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-medium text-base sm:text-base md:text-lg text-slate-900 dark:text-slate-100">
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
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-sm md:text-base leading-relaxed px-2 sm:px-0">
                  {faq.answer}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 sm:pb-4 text-center px-2 sm:px-0">
          <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
            {contactText} <a href={`mailto:${contactEmail}`} className="text-[#3bac63] underline font-semibold">{contactEmail}</a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default MinimalEdgeFaq; 