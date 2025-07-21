"use client";
import React from "react";
import { BookOpen } from "lucide-react";
import { IFAQ } from "@/components/shared/ui/CommonFaq";
import MinimalEdgeFaq from "@/components/shared/ui/MinimalEdgeFaq";

const CorporateFaq: React.FC = () => {
  // Streamlined FAQ data with concise, actionable answers
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "courses",
      question: "What training programs do you offer?",
      answer: "Technical skills (AI, Data Science, Cybersecurity, Cloud Computing) and leadership development. All programs are tailored to your industry and business objectives.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "courses",
      question: "How are programs delivered?",
      answer: "Flexible formats: on-site workshops, virtual classrooms, or hybrid models. Standard 6-week programs with bi-weekly sessions designed around your schedule.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "pricing",
      question: "What are the investment options?",
      answer: "Custom pricing based on team size and program scope. Options include bulk discounts, corporate invoicing, and flexible payment plans.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "certification", 
      question: "Do participants receive certifications?",
      answer: "Yes, industry-recognized certifications aligned with professional standards. Digital badges and certificates enhance participant credentials.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "courses",
      question: "Can training be customized for our needs?",
      answer: "Absolutely. We conduct needs assessments and design programs addressing your specific challenges, technologies, and business goals.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "support",
      question: "What support is provided after training?",
      answer: "Ongoing mentorship, learning resource access, follow-up sessions, and professional networking opportunities for continuous development.",
    },
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#3bac63' }} />,
      iconBg: "#3b82f6",
      iconColor: "#3bac63",
      category: "enrollment",
      question: "How do we get started?",
      answer: "Simple 3-step process: consultation call → customized proposal → program launch. Typically 2-4 weeks from initial contact to training start.",
    },
  ];

  return (
    <div className="!mb-0 !pb-0">
      <MinimalEdgeFaq
        faqs={faqs}
        title="Frequently Asked Questions"
        contactText="Have more questions about our corporate training? Contact our team at"
        contactEmail="corporate@medh.co"
        emailLink="https://mail.google.com/mail/u/0/?to=corporate@medh.co&fs=1&tf=cm"
      />
    </div>
  );
};

export default CorporateFaq;
