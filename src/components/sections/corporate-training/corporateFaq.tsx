"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { Brain, Zap, Award, MessageCircle, Sparkles, Lightbulb } from "lucide-react";

const CorporateFaq: React.FC = () => {
  // FAQ data with improved color themes for light/dark modes
  const faqs: IFAQ[] = [
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500 - Better contrast
      iconColor: "#1e40af", // Blue-800 for better readability
      category: "courses",
      question: "What is the course curriculum and learning objectives?",
      answer: "Our courses cover technical skills (AI, Data Science, Cybersecurity, Cloud Computing) and soft skills (Leadership, Communication, Personality Development). Learning objectives are tailored to equip participants with practical, industry-relevant skills.",
    },
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "What are the delivery methods for training courses?",
      answer: "Flexible 6-week programs with classes twice weekly. We offer online and in-person options with interactive sessions, hands-on workshops, and comprehensive learning materials.",
    },
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500 - Financial/pricing theme
      iconColor: "#047857", // Emerald-700
      category: "pricing",
      question: "What are the pricing and payment options?",
      answer: "Customized pricing based on your organization's needs. Includes per-participant rates, bulk discounts, and tailored packages. Flexible payment options: corporate invoicing, bulk discounts, and installment plans.",
    },
    {
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(245, 158, 11, 0.15)" }} />,
      iconBg: "#f59e0b", // Amber-500 - Achievement/certification theme
      iconColor: "#d97706", // Amber-600
      category: "certification",
      question: "Are the training courses certified or accredited?",
      answer: "Yes, courses are designed with industry standards. Participants receive recognized certifications that validate skills and enhance professional credentials, aligned with industry benchmarks.",
    },
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Can you tailor training to specific business needs?",
      answer: "Absolutely! We create customized programs addressing your organization's unique skill gaps and strategic objectives. Our team develops tailored curriculum aligned with your specific requirements.",
    },
    {
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6", // Violet-500 - Support/communication theme
      iconColor: "#7c3aed", // Violet-600
      category: "support",
      question: "What are the qualifications of your instructors?",
      answer: "Our instructors are seasoned IT professionals with extensive industry experience and proven training track records. They bring real-world insights and practical knowledge, ensuring actionable skills directly applicable to work.",
    },
    {
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6", // Violet-500
      iconColor: "#7c3aed", // Violet-600
      category: "support",
      question: "What post-training support do you provide?",
      answer: "Comprehensive support including learning materials access, follow-up mentorship sessions, career guidance, and professional networking. Ongoing access to our learning platform for continued skill development.",
    },
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "How do your courses compare to competitors?",
      answer: "We stand out through industry-aligned curriculum, experienced instructors, personalized learning, and comprehensive support. Focus on practical, hands-on learning that directly translates to workplace performance.",
    },
    {
      icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(236, 72, 153, 0.15)" }} />,
      iconBg: "#ec4899", // Pink-500 - Enrollment/getting started theme
      iconColor: "#db2777", // Pink-600
      category: "enrollment",
      question: "What is the enrollment process and timeline?",
      answer: "Straightforward process: initial consultation → detailed proposal → training scheduling → participant setup → pre-course materials. Entire process from contact to course start typically takes 2-4 weeks.",
    },
  ];

  // Category definitions for our filter
  const categories = [
    { id: "all", label: "All", count: faqs.length },
    { id: "courses", label: "Courses", count: faqs.filter(f => f.category === "courses").length },
    { id: "pricing", label: "Pricing", count: faqs.filter(f => f.category === "pricing").length },
    { id: "certification", label: "Certification", count: faqs.filter(f => f.category === "certification").length },
    { id: "support", label: "Support", count: faqs.filter(f => f.category === "support").length },
    { id: "enrollment", label: "Enrollment", count: faqs.filter(f => f.category === "enrollment").length }
  ];

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-12">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-4 sm:mb-6 md:mb-8 text-center max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about our corporate training programs
          </p>
        </div>

        {/* Enhanced FAQ Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 max-w-6xl mx-auto">
          <CommonFaq
            title=""
            subtitle=""
            faqs={faqs}
            theme={{
              primaryColor: "#3b82f6", // Blue-500 - Excellent contrast in both themes
              secondaryColor: "#1e40af", // Blue-800 - Strong contrast for text
              accentColor: "#2563eb", // Blue-600 - Perfect balance
              showContactSection: true,
              contactEmail: "care@medh.co",
              contactText: "Have more questions about our corporate training? Contact our team at"
            }}
            showSearch={true}
            showCategories={true}
            defaultCategory="all"
          />
        </div>
      </div>
    </section>
  );
};

export default CorporateFaq; 