"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { 
  Users, 
  Building, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2,
  MapPin,
  Award,
  UserPlus,
  Calendar,
  HeartHandshake
} from "lucide-react";

const HireFromMedhFaq: React.FC = () => {
  const faqs: IFAQ[] = [
    {
      icon: <Users strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(59, 130, 246, 0.15)" }} />,
      iconBg: "#3b82f6",
      iconColor: "#1e40af",
      category: "general",
      question: "What is Recruit@Medh?",
      answer: "Recruit@Medh is our dedicated department that facilitates the recruitment of highly skilled and qualified IT professionals for various job roles in the IT industry. We work closely with both our students, professional job-seekers and industry partners to bridge the gap between talent and opportunities.",
    },
    {
      icon: <Building strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(16, 185, 129, 0.15)" }} />,
      iconBg: "#10b981",
      iconColor: "#047857",
      category: "hiring",
      question: "What types of IT professionals does Recruit@Medh cater to?",
      answer: "We cater to a wide range of IT professionals, including AI Platform Developers, Web Developers, Data Scientists, Cybersecurity specialists, System administrators, Database administrators, UX/UI designers, and more. We strive to meet the diverse hiring needs of organizations within the IT sector.",
    },
    {
      icon: <GraduationCap strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(245, 158, 11, 0.15)" }} />,
      iconBg: "#f59e0b",
      iconColor: "#d97706",
      category: "candidates",
      question: "How to hire the right candidate?",
      answer: "We have a pool of trained candidates with hands on experience, and have worked on industry relevant capstones in IT domain. Hiring companies can review, shortlist, assess and interview the candidates based on their requirements and hire the best candidates.",
    },
    {
      icon: <Briefcase strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6",
      iconColor: "#7c3aed",
      category: "benefits",
      question: "What is the benefit of hiring employees from Recruit@Medh?",
      answer: "Organisations will get trained and certified IT candidates with hands on experience from Recruit@Medh. We also offer dedicated hiring support so hiring becomes easier.",
    },
    {
      icon: <HeartHandshake strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(236, 72, 153, 0.15)" }} />,
      iconBg: "#ec4899",
      iconColor: "#db2777",
      category: "collaboration",
      question: "How can my company collaborate with Recruit@Medh for hiring?",
      answer:
        "To collaborate with our Placement Cell, you can reach out to our placement coordinator or contact our placement cell through email or phone. We will understand your specific hiring requirements and work with you to identify suitable candidates from our pool of talented IT professionals.",
    },
    {
      icon: <CheckCircle2 strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(22, 163, 74, 0.15)" }} />,
      iconBg: "#16a34a",
      iconColor: "#15803d",
      category: "hiring",
      question: "Is there any limit to hiring employees from Recruit@Medh?",
      answer:
        "You can hire as many candidates as you want from us. We have an extensive talent pool and can scale our recruitment efforts to meet your organization's needs, whether you're looking for a single specialist or building an entire team.",
    },
    {
      icon: <MapPin strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(220, 38, 38, 0.15)" }} />,
      iconBg: "#dc2626",
      iconColor: "#b91c1c",
      category: "locations",
      question: "For which locations can I hire candidates from Recruit@Medh?",
      answer:
        "Candidates are available across India as well as globally. Our talent pool includes professionals ready for remote work, on-site positions, or hybrid arrangements, giving you flexibility in your hiring strategy.",
    },
    {
      icon: <Award strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(251, 191, 36, 0.15)" }} />,
      iconBg: "#fbbf24",
      iconColor: "#f59e0b",
      category: "candidates",
      question: "What sets the candidates from Recruit@Medh apart from others?",
      answer:
        "Our candidates undergo rigorous training and skill development programs. They receive a well-rounded education, gain hands-on experience through real-world projects, and are mentored by experienced professionals. This ensures that our candidates are well-prepared to meet the demands of the IT industry.",
    },
    {
      icon: <UserPlus strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(6, 182, 212, 0.15)" }} />,
      iconBg: "#06b6d4",
      iconColor: "#0891b2",
      category: "events",
      question: "Are there any opportunities for companies to interact with potential candidates directly?",
      answer:
        "Yes, we regularly organize placement drives, job fairs, and recruitment events where companies can interact with our students and alumni directly. These events provide a platform for companies to showcase their organization and job opportunities while allowing candidates to learn more about the company culture and job roles available.",
    },
    {
      icon: <Calendar strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(168, 85, 247, 0.15)" }} />,
      iconBg: "#a855f7",
      iconColor: "#9333ea",
      category: "internships",
      question: "Can companies offer internships to IT students through Recruit@Medh?",
      answer:
        "Absolutely! We encourage companies to offer internships to our IT students. Internships are an excellent way for students to gain practical experience and understand the real-world dynamics of the IT industry. It also allows companies to assess the intern's potential for future full-time roles.",
    },
    {
      icon: <HeartHandshake strokeWidth={1.75} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ fill: "rgba(139, 92, 246, 0.15)" }} />,
      iconBg: "#8b5cf6",
      iconColor: "#7c3aed",
      category: "support",
      question: "What support does Recruit@Medh provide during the recruitment process?",
      answer:
        "We offer end-to-end support during the recruitment process. We assist with job postings, candidate shortlisting, scheduling interviews, coordinating with candidates and companies, and facilitating the final selection process. We act as a bridge between the company and the candidates to ensure a smooth hiring experience for both parties.",
    },
  ];

  // Category definitions for our filter
  const categories = [
    { id: "all", label: "All", count: faqs.length },
    { id: "general", label: "General", count: faqs.filter(f => f.category === "general").length },
    { id: "hiring", label: "Hiring Process", count: faqs.filter(f => f.category === "hiring").length },
    { id: "candidates", label: "Candidates", count: faqs.filter(f => f.category === "candidates").length },
    { id: "benefits", label: "Benefits", count: faqs.filter(f => f.category === "benefits").length },
    { id: "collaboration", label: "Collaboration", count: faqs.filter(f => f.category === "collaboration").length },
    { id: "support", label: "Support", count: faqs.filter(f => f.category === "support").length }
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header with Badge */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-full border border-emerald-200 dark:border-emerald-700/50 mb-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Hiring Questions Answered</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
            Got Questions?
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about hiring through Recruit@Medh
          </p>
        </div>

        {/* Edge-to-Edge FAQ Content with Glass Effect */}
        <div className="bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-600/40 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12 lg:p-16">
            <CommonFaq
              title=""
              subtitle=""
              faqs={faqs}
              theme={{
                primaryColor: "#10b981", // Emerald-500 - Perfect for hiring/recruitment theme
                secondaryColor: "#047857", // Emerald-700 - Strong contrast for text
                accentColor: "#059669", // Emerald-600 - Perfect balance
                showContactSection: true,
                contactEmail: "care@medh.co",
                contactText: "Have more questions about hiring? Contact our recruitment team at"
              }}
              showSearch={true}
              showCategories={true}
              defaultCategory="all"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HireFromMedhFaq;
