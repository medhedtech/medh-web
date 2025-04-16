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
      icon: <Users strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(79, 70, 229, 0.2)" }} />,
      iconBg: "#4F46E5",
      iconColor: "#4F46E5",
      question: "What is Recruit@Medh?",
      answer: "Recruit@Medh is our dedicated department that facilitates the recruitment of highly skilled and qualified IT professionals for various job roles in the IT industry. We work closely with both our students, professional job-seekers and industry partners to bridge the gap between talent and opportunities.",
    },
    {
      icon: <Building strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(8, 145, 178, 0.2)" }} />,
      iconBg: "#0891B2",
      iconColor: "#0891B2",
      question: "What types of IT professionals does Recruit@Medh cater to?",
      answer: "We cater to a wide range of IT professionals, including AI Platform Developers, Web Developers, Data Scientists, Cybersecurity specialists, System administrators, Database administrators, UX/UI designers, and more. We strive to meet the diverse hiring needs of organizations within the IT sector.",
    },
    {
      icon: <GraduationCap strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(13, 148, 136, 0.2)" }} />,
      iconBg: "#0D9488",
      iconColor: "#0D9488",
      question: "How to hire the right candidate?",
      answer: "We have a pool of trained candidates with hands on experience, and have worked on industry relevant capstones in IT domain. Hiring companies can review, shortlist, assess and interview the candidates based on their requirements and hire the best candidates.",
    },
    {
      icon: <Briefcase strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(234, 88, 12, 0.2)" }} />,
      iconBg: "#EA580C",
      iconColor: "#EA580C",
      question: "What is the benefit of hiring employees from Recruit@Medh?",
      answer: "Organisations will get trained and certified IT candidates with hands on experience from Recruit@Medh. We also offer dedicated hiring support so hiring becomes easier.",
    },
    {
      icon: <HeartHandshake strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(147, 51, 234, 0.2)" }} />,
      iconBg: "#9333EA",
      iconColor: "#9333EA",
      question: "How can my company collaborate with Recruit@Medh for hiring?",
      answer:
        "To collaborate with our Placement Cell, you can reach out to our placement coordinator or contact our placement cell through email or phone. We will understand your specific hiring requirements and work with you to identify suitable candidates from our pool of talented IT professionals.",
    },
    {
      icon: <CheckCircle2 strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(22, 163, 74, 0.2)" }} />,
      iconBg: "#16A34A",
      iconColor: "#16A34A",
      question: "Is there any limit to hiring employees from Recruit@Medh?",
      answer:
        "You can hire as many candidates as you want from us.",
    },
    {
      icon: <MapPin strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(220, 38, 38, 0.2)" }} />,
      iconBg: "#DC2626",
      iconColor: "#DC2626",
      question: "For which locations can I hire candidates from Recruit@Medh?",
      answer:
        "Candidates are available across India as well as globally.",
    },
    {
      icon: <Award strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(246, 179, 53, 0.2)" }} />,
      iconBg: "#F6B335",
      iconColor: "#F6B335",
      question: "What sets the candidates from Recruit@Medh apart from others?",
      answer:
        "Our candidates undergo rigorous training and skill development. They receive a well-rounded education, gain hands-on experience through projects, and are mentored by experienced professionals. This ensures that our candidates are well-prepared to meet the demands of the IT industry.",
    },
    {
      icon: <UserPlus strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(6, 182, 212, 0.2)" }} />,
      iconBg: "#06B6D4",
      iconColor: "#06B6D4",
      question: "Are there any opportunities for companies to interact with potential candidates directly?",
      answer:
        "Yes, we regularly organize placement drives, job fairs, and recruitment events where companies can interact with our students and alumni directly. These events provide a platform for companies to showcase their organization and job opportunities while allowing candidates to learn more about the company culture and job roles available.",
    },
    {
      icon: <Calendar strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(219, 39, 119, 0.2)" }} />,
      iconBg: "#DB2777",
      iconColor: "#DB2777",
      question: "Can companies offer internships to IT students through Recruit@Medh?",
      answer:
        "Absolutely! We encourage companies to offer internships to our IT students. Internships are an excellent way for students to gain practical experience and understand the real-world dynamics of the IT industry. It also allows companies to assess the intern's potential for future full-time roles.",
    },
    {
      icon: <HeartHandshake strokeWidth={1.75} className="w-5 h-5" style={{ fill: "rgba(139, 92, 246, 0.2)" }} />,
      iconBg: "#8B5CF6",
      iconColor: "#8B5CF6",
      question: "What support does Recruit@Medh provide during the recruitment process?",
      answer:
        "We offer end-to-end support during the recruitment process. We assist with job postings, candidate shortlisting, scheduling interviews, coordinating with candidates and companies, and facilitating the final selection process. We act as a bridge between the company and the candidates to ensure a smooth hiring experience for both parties.",
    },
  ];

  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about hiring from Recruit@Medh and our recruitment process."
      faqs={faqs}
      theme={{
        primaryColor: "#F6B335", // Amber
        secondaryColor: "#8B5CF6", // Violet
        accentColor: "#3B82F6", // Blue
        showContactSection: true,
        contactEmail: "recruit@medh.co",
        contactText: "Have more questions about hiring? Contact our recruitment team at"
      }}
      showSearch={false}
      showCategories={false}
    />
  );
};

export default HireFromMedhFaq;
