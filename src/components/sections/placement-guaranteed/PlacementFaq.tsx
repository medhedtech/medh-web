import React, { useState } from "react";
import { BookOpen } from "lucide-react";

// FAQ item interface
export interface IFAQ {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

export const PlacementFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: IFAQ[] = [
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
        "If you meet all the program requirements and still do not secure a job, you can apply for a tuition refund. The process includes: Submitting a request for a refund within 30 days of the Termination Date listed in your Job Guarantee agreement., Providing necessary documentation to verify your job search efforts and compliance with the program's terms.",
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
        "To apply for a tuition refund, you must:Ensure you have met all the course requirements and career commitments., Submit a written request for a refund within 30 days of the Termination Date., Provide documentation of your job search efforts and compliance with the program's terms.",
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

  const title = "Frequently Asked Questions";
  const contactText = "Have more questions? Contact our support team at";
  const contactEmail = "care@medh.co";

  return (
    <section className="bg-slate-50 dark:bg-slate-900 px-0 sm:px-[50px] pb-0 mb-0">
      <div className="p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-none sm:shadow-lg rounded-none sm:rounded-2xl px-4 sm:px-[45px] py-6 sm:py-[28px]">
        <h2 className="text-center font-semibold text-xl sm:text-lg md:text-2xl mb-6 sm:mb-4 md:mb-6 mt-0 sm:mt-2 md:mt-4 text-slate-800 dark:text-slate-100">{title}</h2>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <li key={idx} className="">
              <button
                className={
                  "w-full flex items-start gap-3 py-4 focus:outline-none transition-colors min-h-[44px] px-2 sm:px-0 " +
                  (openIndex === idx
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                }
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="flex-shrink-0 mt-1">
                  {faq.icon ? faq.icon : <BookOpen className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" style={{ color: '#3bac63' }} />}
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-medium text-base sm:text-sm md:text-base lg:text-lg text-slate-900 dark:text-slate-100">
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
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-xs md:text-sm lg:text-base leading-relaxed px-2 sm:px-0">
                  {faq.answer}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 sm:mt-6 md:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-4 md:pt-6 pb-4 text-center px-2 sm:px-0">
          <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-sm md:text-base font-medium">
            {contactText} <a href={`mailto:${contactEmail}`} className="text-[#3bac63] underline font-semibold">{contactEmail}</a>
          </span>
        </div>
      </div>
    </section>
  );
}; 