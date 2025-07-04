"use client";
import React from "react";
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

  // Category definitions for our filter
  const categories = [
    { id: "all", label: "All", count: faqs.length },
    { id: "culture", label: "Culture", count: faqs.filter(f => f.category === "culture").length },
    { id: "development", label: "Development", count: faqs.filter(f => f.category === "development").length },
    { id: "benefits", label: "Benefits", count: faqs.filter(f => f.category === "benefits").length },
    { id: "application", label: "Application", count: faqs.filter(f => f.category === "application").length },
    { id: "process", label: "Process", count: faqs.filter(f => f.category === "process").length },
    { id: "support", label: "Support", count: faqs.filter(f => f.category === "support").length }
  ];

  return (
    <section className={layoutPatterns.sectionWrapper}>
      <div className={layoutPatterns.containerWrapper}>
        {/* FAQ Content */}
        <div className={buildAdvancedComponent.contentCard()}>
          <CommonFaq
            title=""
            subtitle=""
            faqs={faqs}
            theme={{
              primaryColor: "#8b5cf6", // Violet-500 - Career theme
              secondaryColor: "#7c3aed", // Violet-600 - Strong contrast
              accentColor: "#a855f7", // Violet-500 - Perfect balance
              showContactSection: true,
              contactEmail: "care@medh.co",
              contactText: "Have more questions about career opportunities at Medh? Contact our HR team at"
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

export default CareerFaq;
