"use client";
import React from "react";
import MinimalEdgeFaq from "@/components/shared/ui/MinimalEdgeFaq";
import { CreditCard, AlertCircle, Award, Download, BookOpen, Settings, Clock, Users, Gift, HelpCircle } from "lucide-react";

const MembershipFaq: React.FC = () => {
  // FAQ data with improved color themes and categorization
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "What's the difference between Silver and Gold Memberships?",
      answer: "Silver Membership gives you unlimited access to all courses within one category of your choice, while Gold Membership provides access to all courses across three categories of your choice. Gold also includes additional benefits like exclusive masterclasses and a personal learning advisor.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Can I change my selected category/categories after subscribing?",
      answer: "Yes. Silver members can change their selected category once every 30 days. Gold members can modify their three chosen categories once every 30 days. Changes take effect immediately without affecting your current progress.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "pricing",
      question: "Is there a minimum commitment period for memberships?",
      answer: "No, there is no minimum commitment period. Both memberships operate on a month-to-month basis, and you can cancel anytime. Your access continues until the end of your current billing cycle.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Will I lose my progress if I cancel my membership?",
      answer: "Your progress and completion records are saved indefinitely in our system. If you resubscribe later, you'll regain access to all your previous progress. However, you'll lose access to the course content at the end of your billing cycle after cancellation.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "certification",
      question: "What happens to my certificates if I cancel my membership?",
      answer: "Any certificates you've earned during your membership remain valid permanently. You'll retain access to download your certificates even after cancellation through your Medh profile.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Do memberships include Live Interactive Certification Courses?",
      answer: "No, memberships cover only Blended Self-paced courses. However, Silver members receive a min of 7.50% discount and Gold members receive a 15% discount on all Live Interactive Certification Courses.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "How many courses can I take simultaneously?",
      answer: "There is no limit. With either membership, you can enroll in and progress through as many eligible courses as you wish simultaneously within your selected category/categories.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Can I download course materials for offline access?",
      answer: "Yes, both memberships allow you to download learning materials, worksheets, and resources for personal use. Video content remains accessible only through streaming while your membership is active.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "Are new courses added to the membership program?",
      answer: "Yes, we regularly add new courses to our catalog. As a member, you automatically gain access to any new courses added to your selected category/categories at no additional cost.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "pricing",
      question: "How does the billing cycle work?",
      answer: "Your membership fee is charged on the same date each month. For example, if you subscribe on the 15th, you'll be billed on the 15th of each subsequent month until you cancel.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "pricing",
      question: "Can I upgrade from Silver to Gold membership?",
      answer: "Yes, you can upgrade from Silver to Gold at any time. When upgrading, we'll prorate the remaining days in your current billing cycle, so you only pay the difference for the upgrade.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "enrollment",
      question: "Is there a family or group membership option?",
      answer: "Currently, memberships are individual-based. However, we offer special corporate and educational institution packages for multiple users. Please email our membership team at membership@medh.co for custom group solutions.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "enrollment",
      question: "Can I try before I subscribe?",
      answer: "Yes, we offer a 7-day free trial for both membership tiers. During the trial, you'll have full access to all features of your chosen membership. You can cancel anytime during the trial period without being charged.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "courses",
      question: "How do category-specific memberships work with interdisciplinary courses?",
      answer: "Some courses may appear in multiple categories due to their interdisciplinary nature. As a member, you'll have access to these courses if any of their assigned categories match your selected membership categories.",
    },
  ];

  return (
    <MinimalEdgeFaq
      faqs={faqs}
      title="Frequently Asked Questions"
      contactText="Have more questions about our membership program? Contact our team at"
      contactEmail="care@medh.co"
    />
  );
};

export default MembershipFaq;
