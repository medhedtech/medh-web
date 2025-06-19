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
  Building
} from "lucide-react";

const CareerFaq: React.FC = () => {
  // FAQ data with improved color themes and semantic categorization
  const faqs: IFAQ[] = [
    {
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6", // Violet-500 - Culture/team theme
      iconColor: "#7c3aed", // Violet-600
      category: "culture",
      question: "What is Medh's work culture like?",
      answer: "At Medh, we foster a collaborative, inclusive, and innovative work culture. We believe in supporting each other, encouraging creativity, and celebrating successes together. Our team values diversity, open communication, and continuous learning in a dynamic EdTech environment.",
    },
    {
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500 - Career/development theme
      iconColor: "#1e40af", // Blue-800
      category: "development",
      question: "What career development opportunities does Medh offer?",
      answer: "Medh is committed to your professional growth. We offer access to comprehensive training sessions, industry workshops, mentorship programs, and skill development courses. Our employees enjoy opportunities for internal mobility, conference attendance, and continuous learning paths tailored to their career aspirations.",
    },
    {
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500 - Benefits/wellness theme
      iconColor: "#047857", // Emerald-700
      category: "benefits",
      question: "What benefits can I expect as a Medh employee?",
      answer: "As a Medh employee, you can expect competitive compensation packages, flexible work arrangements (hybrid/remote options), comprehensive health and wellness programs, professional development budget, team building activities, and a supportive work environment that promotes work-life balance.",
    },
    {
      icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(236, 72, 153, 0.15)" }} />,
      iconBg: "#ec4899", // Pink-500 - Application/process theme
      iconColor: "#db2777", // Pink-600
      category: "application",
      question: "How can I apply for a job at Medh?",
      answer: "To apply, visit our Careers Page and click on the 'Apply Now' button next to the job listing that interests you. Follow the instructions to submit your resume, cover letter, and any required portfolio materials. You can also send us a general application if you don't see a specific role that matches your skills.",
    },
    {
      icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(245, 158, 11, 0.15)" }} />,
      iconBg: "#f59e0b", // Amber-500 - Process/recruitment theme
      iconColor: "#d97706", // Amber-600
      category: "process",
      question: "What is the recruitment process at Medh?",
      answer: "Our recruitment process typically involves an initial application review, followed by a phone/video interview, skills assessment or task related to the role, and a final interview with the team. We strive to make the process smooth, transparent, and efficient for all candidates, usually completing it within 2-3 weeks.",
    },
    {
      icon: <Building className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6", // Violet-500 - Work environment theme
      iconColor: "#7c3aed", // Violet-600
      category: "culture",
      question: "What is the work environment like at Medh?",
      answer: "Our work environment is dynamic, collaborative, and innovation-focused. We maintain modern office spaces with flexible seating, quiet zones for focused work, and collaborative areas for team projects. We also support remote and hybrid work arrangements to accommodate different working styles and life situations.",
    },
    {
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6", // Blue-500 - Growth/recognition theme
      iconColor: "#1e40af", // Blue-800
      category: "development",
      question: "How does Medh recognize and reward employee achievements?",
      answer: "We believe in recognizing outstanding contributions through various programs including performance bonuses, peer recognition systems, employee of the month awards, professional development opportunities, and career advancement paths. We also celebrate team achievements and individual milestones regularly.",
    },
    {
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981", // Emerald-500 - Support/communication theme
      iconColor: "#047857", // Emerald-700
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
    <section className="relative bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-pink-50/50 dark:from-violet-950/20 dark:via-transparent dark:to-pink-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-12">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-4 sm:mb-6 md:mb-8 text-center max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2 sm:mb-3 leading-tight">
            Career Opportunities FAQ
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about joining the Medh team and building your career with us
          </p>
        </div>

        {/* Enhanced FAQ Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 max-w-6xl mx-auto">
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
