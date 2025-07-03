"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { HelpCircle, Users, DollarSign, Award, HeadphonesIcon, UserCheck, BookOpen } from "lucide-react";
import { buildAdvancedComponent, typography } from "@/utils/designSystem";

const CorporateFaq: React.FC = () => {
  // Streamlined FAQ data with concise, actionable answers
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "What training programs do you offer?",
      answer: "Technical skills (AI, Data Science, Cybersecurity, Cloud Computing) and leadership development. All programs are tailored to your industry and business objectives.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "How are programs delivered?",
      answer: "Flexible formats: on-site workshops, virtual classrooms, or hybrid models. Standard 6-week programs with bi-weekly sessions designed around your schedule.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "pricing",
      question: "What are the investment options?",
      answer: "Custom pricing based on team size and program scope. Options include bulk discounts, corporate invoicing, and flexible payment plans.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "certification", 
      question: "Do participants receive certifications?",
      answer: "Yes, industry-recognized certifications aligned with professional standards. Digital badges and certificates enhance participant credentials.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Can training be customized for our needs?",
      answer: "Absolutely. We conduct needs assessments and design programs addressing your specific challenges, technologies, and business goals.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "support",
      question: "What support is provided after training?",
      answer: "Ongoing mentorship, learning resource access, follow-up sessions, and professional networking opportunities for continuous development.",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "enrollment",
      question: "How do we get started?",
      answer: "Simple 3-step process: consultation call → customized proposal → program launch. Typically 2-4 weeks from initial contact to training start.",
    },
  ];

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 py-12 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-blue-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* FAQ Content */}
        <div className="mt-8">
          <div className={buildAdvancedComponent.glassCard({ variant: 'primary', padding: 'desktop', hover: false })}>
            {/* Unified Header Section */}
            <div className="text-center mb-12">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-500 dark:from-violet-400 dark:to-blue-300 inline-block mb-4">
                  Explore FAQs
                </h1>
                <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-violet-600 to-blue-500 dark:from-violet-400 dark:to-blue-300"></div>
                <div className="max-w-3xl mx-auto">
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    Quick answers to help you understand our 
                    <span className="font-semibold text-slate-800 dark:text-slate-200"> corporate training programs</span>
                  </p>
                </div>
              </div>
            </div>
            {/* FAQ Content */}
            <CommonFaq
              title=""
              subtitle=""
              faqs={faqs}
              theme={{
                primaryColor: "#3b82f6",
                secondaryColor: "#1e40af", 
                accentColor: "#2563eb",
                showContactSection: true,
                contactEmail: "care@medh.co",
                contactText: "Have more questions? Our team is here to help"
              }}
              showSearch={false}
              showCategories={true}
              defaultCategory="all"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateFaq;
