"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { CreditCard, AlertCircle, Award, Download, BookOpen, Settings, Clock, Users, Gift, HelpCircle } from "lucide-react";

const MembershipFaq: React.FC = () => {
  // FAQ data with improved color themes and categorization
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500 - Courses theme
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "What's the difference between Silver and Gold Memberships?",
      answer: "Silver Membership gives you unlimited access to all courses within one category of your choice, while Gold Membership provides access to all courses across three categories of your choice. Gold also includes additional benefits like exclusive masterclasses and a personal learning advisor.",
    },
    {
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Can I change my selected category/categories after subscribing?",
      answer: "Yes. Silver members can change their selected category once every 30 days. Gold members can modify their three chosen categories once every 30 days. Changes take effect immediately without affecting your current progress.",
    },
    {
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500 - Pricing/commitment theme
      iconColor: "#047857", // Emerald-700
      category: "pricing",
      question: "Is there a minimum commitment period for memberships?",
      answer: "No, there is no minimum commitment period. Both memberships operate on a month-to-month basis, and you can cancel anytime. Your access continues until the end of your current billing cycle.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Will I lose my progress if I cancel my membership?",
      answer: "Your progress and completion records are saved indefinitely in our system. If you resubscribe later, you'll regain access to all your previous progress. However, you'll lose access to the course content at the end of your billing cycle after cancellation.",
    },
    {
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(245, 158, 11, 0.15)" }} />,
      iconBg: "#f59e0b", // Amber-500 - Certification theme
      iconColor: "#d97706", // Amber-600
      category: "certification",
      question: "What happens to my certificates if I cancel my membership?",
      answer: "Any certificates you've earned during your membership remain valid permanently. You'll retain access to download your certificates even after cancellation through your Medh profile.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Do memberships include Live Interactive Certification Courses?",
      answer: "No, memberships cover only Blended Self-paced courses. However, Silver members receive a min of 7.50% discount and Gold members receive a 15% discount on all Live Interactive Certification Courses.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "How many courses can I take simultaneously?",
      answer: "There is no limit. With either membership, you can enroll in and progress through as many eligible courses as you wish simultaneously within your selected category/categories.",
    },
    {
      icon: <Download className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Can I download course materials for offline access?",
      answer: "Yes, both memberships allow you to download learning materials, worksheets, and resources for personal use. Video content remains accessible only through streaming while your membership is active.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "Are new courses added to the membership program?",
      answer: "Yes, we regularly add new courses to our catalog. As a member, you automatically gain access to any new courses added to your selected category/categories at no additional cost.",
    },
    {
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500 - Pricing theme
      iconColor: "#047857", // Emerald-700
      category: "pricing",
      question: "How does the billing cycle work?",
      answer: "Your membership fee is charged on the same date each month. For example, if you subscribe on the 15th, you'll be billed on the 15th of each subsequent month until you cancel.",
    },
    {
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500
      iconColor: "#047857", // Emerald-700
      category: "pricing",
      question: "Can I upgrade from Silver to Gold membership?",
      answer: "Yes, you can upgrade from Silver to Gold at any time. When upgrading, we'll prorate the remaining days in your current billing cycle, so you only pay the difference for the upgrade.",
    },
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(236, 72, 153, 0.15)" }} />,
      iconBg: "#ec4899", // Pink-500 - Enrollment theme
      iconColor: "#db2777", // Pink-600
      category: "enrollment",
      question: "Is there a family or group membership option?",
      answer: "Currently, memberships are individual-based. However, we offer special corporate and educational institution packages for multiple users. Please email our membership team at membership@medh.co for custom group solutions.",
    },
    {
      icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(236, 72, 153, 0.15)" }} />,
      iconBg: "#ec4899", // Pink-500
      iconColor: "#db2777", // Pink-600
      category: "enrollment",
      question: "Can I try before I subscribe?",
      answer: "Yes, we offer a 7-day free trial for both membership tiers. During the trial, you'll have full access to all features of your chosen membership. You can cancel anytime during the trial period without being charged.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500
      iconColor: "#1e40af", // Blue-800
      category: "courses",
      question: "How do category-specific memberships work with interdisciplinary courses?",
      answer: "Some courses may appear in multiple categories due to their interdisciplinary nature. As a member, you'll have access to these courses if any of their assigned categories match your selected membership categories.",
    },
  ];

  return (
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-4 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-4 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-12">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-4 sm:mb-6 md:mb-8 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight">
            Membership FAQ
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about MEDH's membership program
          </p>
        </div>

        {/* Enhanced FAQ Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50">
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
              contactText: "Have more questions about our membership program? Contact our team at"
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

export default MembershipFaq; 