"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
import { 
  BookOpen,
  HelpCircle
} from "lucide-react";
import MinimalEdgeFaq from "@/components/shared/ui/MinimalEdgeFaq";

const HireFromMedhFaq: React.FC = () => {
  const faqs: IFAQ[] = [
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "general",
      question: "What is Recruit@Medh?",
      answer: "Recruit@Medh is our dedicated department that facilitates the recruitment of highly skilled and qualified IT professionals for various job roles in the IT industry. We work closely with both our students, professional job-seekers and industry partners to bridge the gap between talent and opportunities.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "hiring",
      question: "What types of IT professionals does Recruit@Medh cater to?",
      answer: "We cater to a wide range of IT professionals, including AI Platform Developers, Web Developers, Data Scientists, Cybersecurity specialists, System administrators, Database administrators, UX/UI designers, and more. We strive to meet the diverse hiring needs of organizations within the IT sector.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "candidates",
      question: "How to hire the right candidate?",
      answer: "We have a pool of trained candidates with hands on experience, and have worked on industry relevant capstones in IT domain. Hiring companies can review, shortlist, assess and interview the candidates based on their requirements and hire the best candidates.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "benefits",
      question: "What is the benefit of hiring employees from Recruit@Medh?",
      answer: "Organisations will get trained and certified IT candidates with hands on experience from Recruit@Medh. We also offer dedicated hiring support so hiring becomes easier.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "collaboration",
      question: "How can my company collaborate with Recruit@Medh for hiring?",
      answer:
        "To collaborate with our Placement Cell, you can reach out to our placement coordinator or contact our placement cell through email or phone. We will understand your specific hiring requirements and work with you to identify suitable candidates from our pool of talented IT professionals.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "hiring",
      question: "Is there any limit to hiring employees from Recruit@Medh?",
      answer:
        "You can hire as many candidates as you want from us. We have an extensive talent pool and can scale our recruitment efforts to meet your organization's needs, whether you're looking for a single specialist or building an entire team.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "locations",
      question: "For which locations can I hire candidates from Recruit@Medh?",
      answer:
        "Candidates are available across India as well as globally. Our talent pool includes professionals ready for remote work, on-site positions, or hybrid arrangements, giving you flexibility in your hiring strategy.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "candidates",
      question: "What sets the candidates from Recruit@Medh apart from others?",
      answer:
        "Our candidates undergo rigorous training and skill development programs. They receive a well-rounded education, gain hands-on experience through real-world projects, and are mentored by experienced professionals. This ensures that our candidates are well-prepared to meet the demands of the IT industry.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "events",
      question: "Are there any opportunities for companies to interact with potential candidates directly?",
      answer:
        "Yes, we regularly organize placement drives, job fairs, and recruitment events where companies can interact with our students and alumni directly. These events provide a platform for companies to showcase their organization and job opportunities while allowing candidates to learn more about the company culture and job roles available.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
      category: "internships",
      question: "Can companies offer internships to IT students through Recruit@Medh?",
      answer:
        "Absolutely! We encourage companies to offer internships to our IT students. Internships are an excellent way for students to gain practical experience and understand the real-world dynamics of the IT industry. It also allows companies to assess the intern's potential for future full-time roles.",
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      iconBg: "#3b82f6",
      iconColor: "#10b981",
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
    <section className="bg-slate-50 dark:bg-slate-900 pt-0 pb-[20px]">
      <MinimalEdgeFaq
        faqs={faqs}
        title="Frequently Asked Questions"
        contactText="Have more questions about hiring? Contact our recruitment team at"
        contactEmail="corporate@medh.co"
        emailLink="https://mail.google.com/mail/?view=cm&fs=1&to=corporate@medh.co"
      />
    </section>
  );
};

export default HireFromMedhFaq;
