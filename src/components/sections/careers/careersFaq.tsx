"use client";
import React, { useState } from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { 
  Users, 
  GraduationCap, 
  Heart, 
  Send, 
  Briefcase,
  MessageCircle,
  Award,
  Building,
  BookOpen
} from "lucide-react";
import { buildAdvancedComponent, layoutPatterns, typography } from "@/utils/designSystem";

const CareerFaq: React.FC = () => {
  // FAQ data with improved color themes and semantic categorization
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#3bac63", // Medh green
      category: "culture",
      question: "What is Medh's work culture like?",
      answer: "At Medh, we foster a collaborative, inclusive, and innovative work culture. We believe in supporting each other, encouraging creativity, and celebrating successes together. Our team values diversity, open communication, and continuous learning in a dynamic EdTech environment.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "development",
      question: "What career development opportunities does Medh offer?",
      answer: "Medh is committed to your professional growth. We offer access to comprehensive training sessions, industry workshops, mentorship programs, and skill development courses. Our employees enjoy opportunities for internal mobility, conference attendance, and continuous learning paths tailored to their career aspirations.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "benefits",
      question: "What benefits can I expect as a Medh employee?",
      answer: "As a Medh employee, you can expect competitive compensation packages, flexible work arrangements (hybrid/remote options), comprehensive health and wellness programs, professional development budget, team building activities, and a supportive work environment that promotes work-life balance.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "application",
      question: "How can I apply for a job at Medh?",
      answer: "To apply, visit our Careers Page and click on the 'Apply Now' button next to the job listing that interests you. Follow the instructions to submit your resume, cover letter, and any required portfolio materials. You can also send us a general application if you don't see a specific role that matches your skills.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "process",
      question: "What is the recruitment process at Medh?",
      answer: "Our recruitment process typically involves an initial application review, followed by a phone/video interview, skills assessment or task related to the role, and a final interview with the team. We strive to make the process smooth, transparent, and efficient for all candidates, usually completing it within 2-3 weeks.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "culture",
      question: "What is the work environment like at Medh?",
      answer: "Our work environment is dynamic, collaborative, and innovation-focused. We maintain modern office spaces with flexible seating, quiet zones for focused work, and collaborative areas for team projects. We also support remote and hybrid work arrangements to accommodate different working styles and life situations.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "development",
      question: "How does Medh recognize and reward employee achievements?",
      answer: "We believe in recognizing outstanding contributions through various programs including performance bonuses, peer recognition systems, employee of the month awards, professional development opportunities, and career advancement paths. We also celebrate team achievements and individual milestones regularly.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "support",
      question: "What support does Medh provide for work-life balance?",
      answer: "Medh prioritizes work-life balance through flexible working hours, remote work options, mental health support programs, wellness initiatives, and generous time-off policies. We understand that our employees perform best when they have a healthy balance between their professional and personal lives.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen px-[50px]">
        {/* FAQ Content */}
      <div className={buildAdvancedComponent.contentCard() + " p-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-none sm:rounded-2xl px-[45px] py-[28px]"}>
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
        {/* Contact Section (unchanged) */}
        <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 text-center">
          <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
            Have more questions about career opportunities at Medh? Contact our HR team at <a href="mailto:care@medh.co" className="text-[#3bac63] underline font-semibold">care@medh.co</a>
          </span>
        </div>
      </div>
    </section>
  );
};

export default CareerFaq;
