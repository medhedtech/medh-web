"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { Brain, Zap, Award, MessageCircle, Sparkles, Lightbulb } from "lucide-react";

const CorporateFaq: React.FC = () => {
  // FAQ data - converted to IFAQ format
  const faqs: IFAQ[] = [
    {
      icon: <Brain className="w-5 h-5" style={{ fill: "rgba(124, 58, 237, 0.1)" }} />,
      iconBg: "#7c3aed", // Violet
      iconColor: "#7c3aed",
      category: "courses",
      question: "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
      answer: "Our courses are designed to cover a wide range of topics, from technical skills such as AI, Data Science, Cybersecurity, and Cloud Computing to soft skills like Leadership, Communication and Personality Development Courses. The learning objectives are tailored to equip participants with practical, industry-relevant skills and knowledge.",
    },
    {
      icon: <Brain className="w-5 h-5" style={{ fill: "rgba(124, 58, 237, 0.1)" }} />,
      iconBg: "#7c3aed", // Violet
      iconColor: "#7c3aed",
      category: "courses",
      question: "What are the delivery methods for MEDH's Corporate Training Courses?",
      answer: "Our courses are typically delivered through a flexible 6-week program with classes held twice a week. We offer both online and in-person training options, with interactive sessions, hands-on workshops, and comprehensive learning materials.",
    },
    {
      icon: <Zap className="w-5 h-5" style={{ fill: "rgba(245, 158, 11, 0.1)" }} />,
      iconBg: "#f59e0b", // Amber
      iconColor: "#f59e0b",
      category: "pricing",
      question: "What are the pricing and payment options for MEDH's Corporate Training Courses?",
      answer: "We offer customized pricing based on the specific needs of your organization. Our pricing models include per-participant rates, bulk enrollment discounts, and tailored corporate packages. We provide flexible payment options including corporate invoicing, bulk payment discounts, and installment plans.",
    },
    {
      icon: <Award className="w-5 h-5" style={{ fill: "rgba(16, 185, 129, 0.1)" }} />,
      iconBg: "#10b981", // Emerald
      iconColor: "#10b981",
      category: "certification",
      question: "Are MEDH's Corporate Training Courses certified or accredited?",
      answer: "Yes, our courses are designed with industry standards in mind. Upon completion, participants receive a recognized certification that validates their newly acquired skills. Our certifications are aligned with industry benchmarks and can enhance professional credentials.",
    },
    {
      icon: <Brain className="w-5 h-5" style={{ fill: "rgba(124, 58, 237, 0.1)" }} />,
      iconBg: "#7c3aed", // Violet
      iconColor: "#7c3aed",
      category: "courses",
      question: "Can MEDH tailor the training courses to specific business needs?",
      answer: "Absolutely! We specialize in creating customized training programs that address your organization's unique skill gaps and strategic objectives. Our team works closely with you to develop a tailored curriculum that aligns with your specific business requirements.",
    },
    {
      icon: <MessageCircle className="w-5 h-5" style={{ fill: "rgba(59, 130, 246, 0.1)" }} />,
      iconBg: "#3b82f6", // Blue
      iconColor: "#3b82f6",
      category: "support",
      question: "What are the qualifications and industry experience of MEDH's instructors?",
      answer: "Our instructors are seasoned IT professionals with extensive industry experience and a proven track record of providing high-quality training. They bring real-world insights and practical knowledge to the training sessions, ensuring participants gain actionable skills directly applicable to their work.",
    },
    {
      icon: <MessageCircle className="w-5 h-5" style={{ fill: "rgba(59, 130, 246, 0.1)" }} />,
      iconBg: "#3b82f6", // Blue
      iconColor: "#3b82f6",
      category: "support",
      question: "What post-training support and resources does MEDH provide?",
      answer: "We offer comprehensive post-training support including access to learning materials, follow-up mentorship sessions, career guidance, and a professional network. Participants also receive ongoing access to our learning platform and resources for continued skill development.",
    },
    {
      icon: <Brain className="w-5 h-5" style={{ fill: "rgba(124, 58, 237, 0.1)" }} />,
      iconBg: "#7c3aed", // Violet
      iconColor: "#7c3aed",
      category: "courses",
      question: "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
      answer: "Our courses stand out through our industry-aligned curriculum, experienced instructors, personalized learning approach, and comprehensive support. We focus on practical, hands-on learning that directly translates to workplace performance, setting us apart from traditional training providers.",
    },
    {
      icon: <Sparkles className="w-5 h-5" style={{ fill: "rgba(236, 72, 153, 0.1)" }} />,
      iconBg: "#ec4899", // Pink
      iconColor: "#ec4899",
      category: "enrollment",
      question: "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
      answer: "Our enrollment process is straightforward. After an initial consultation to understand your needs, we provide a detailed proposal. Once agreed, we help you schedule the training, set up participant accounts, and provide pre-course materials. The entire process from initial contact to course commencement typically takes 2-4 weeks.",
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
    <div className="px-1 sm:px-2 md:px-4">
      <CommonFaq
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our corporate training programs"
        faqs={faqs}
        theme={{
          primaryColor: "#379392", // Primary teal color from original component
          secondaryColor: "#7c3aed", // Violet
          accentColor: "#f59e0b", // Amber
          showContactSection: true,
          contactEmail: "corporate@medh.co",
          contactText: "Have more questions about our corporate training? Contact our team at"
        }}
        showSearch={true}
        showCategories={true}
        defaultCategory="all"
      />
    </div>
  );
};

export default CorporateFaq; 