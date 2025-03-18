"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, HelpCircle, Users, Building, Briefcase, GraduationCap } from "lucide-react";

const HireFromMedhFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const faqs = [
    {
      icon: <Users className="w-5 h-5" />,
      question: "What is Recruit@Medh?",
      answer: "Recruit@Medh is our dedicated department that facilitates the recruitment of highly skilled and qualified IT professionals for various job roles in the IT industry. We work closely with both our students, professional job-seekers and industry partners to bridge the gap between talent and opportunities.",
    },
    {
      icon: <Building className="w-5 h-5" />,
      question: "What types of IT professionals does Recruit@Medh cater to?",
      answer: "We cater to a wide range of IT professionals, including AI Platform Developers, Web Developers, Data Scientists, Cybersecurity specialists, System administrators, Database administrators, UX/UI designers, and more. We strive to meet the diverse hiring needs of organizations within the IT sector.",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      question: "How to hire the right candidate?",
      answer: "We have a pool of trained candidates with hands on experience, and have worked on industry relevant capstones in IT domain. Hiring companies can review, shortlist, assess and interview the candidates based on their requirements and hire the best candidates.",
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      question: "What is the benefit of hiring employees from Recruit@Medh?",
      answer: "Organisations will get trained and certified IT candidates with hands on experience from Recruit@Medh. We also offer dedicated hiring support so hiring becomes easier.",
    },
    {
      question: "How can my company collaborate with Recruit@Medh for hiring?",
      answer:
        "To collaborate with our Placement Cell, you can reach out to our placement coordinator or contact our placement cell through email or phone. We will understand your specific hiring requirements and work with you to identify suitable candidates from our pool of talented IT professionals.",
    },
    {
      question: "Is there any limit to hiring employees from Recruit@Medh?",
      answer:
        "You can hire as many candidates as you want from us.",
    },
    {
      question: "For which locations can I hire candidates from Recruit@Medh?",
      answer:
        "Candidates are available across India as well as globally.",
    },
    {
      question: "What sets the candidates from Recruit@Medh apart from others?",
      answer:
        "Our candidates undergo rigorous training and skill development. They receive a well-rounded education, gain hands-on experience through projects, and are mentored by experienced professionals. This ensures that our candidates are well-prepared to meet the demands of the IT industry.",
    },
    {
      question: "Are there any opportunities for companies to interact with potential candidates directly?",
      answer:
        "Yes, we regularly organize placement drives, job fairs, and recruitment events where companies can interact with our students and alumni directly. These events provide a platform for companies to showcase their organization and job opportunities while allowing candidates to learn more about the company culture and job roles available.",
    },
    {
      question: "Can companies offer internships to IT students through Recruit@Medh?",
      answer:
        "Absolutely! We encourage companies to offer internships to our IT students. Internships are an excellent way for students to gain practical experience and understand the real-world dynamics of the IT industry. It also allows companies to assess the intern's potential for future full-time roles.",
    },
    {
      question: "What support does Recruit@Medh provide during the recruitment process?",
      answer:
        "We offer end-to-end support during the recruitment process. We assist with job postings, candidate shortlisting, scheduling interviews, coordinating with candidates and companies, and facilitating the final selection process. We act as a bridge between the company and the candidates to ensure a smooth hiring experience for both parties.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.04]" />
      <div className="absolute -top-1/4 right-1/2 w-[120%] aspect-square bg-[#F6B335]/10 rounded-full blur-3xl transform translate-x-1/2 opacity-30 dark:opacity-20 animate-float mix-blend-multiply dark:mix-blend-soft-light" />
      <div className="absolute top-1/4 left-1/2 w-[120%] aspect-square bg-[#F6B335]/10 rounded-full blur-3xl transform -translate-x-1/2 opacity-30 dark:opacity-20 animate-float animation-delay-1000 mix-blend-multiply dark:mix-blend-soft-light" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-[#F6B335]/10 backdrop-blur-sm mb-6">
            <HelpCircle className="w-5 h-5 text-[#F6B335]" />
            <span className="text-[#F6B335] font-semibold">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about hiring from Recruit@Medh and our recruitment process.
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                bg-white dark:bg-gray-800/50 backdrop-blur-sm 
                rounded-xl overflow-hidden 
                border border-gray-100 dark:border-gray-700/50
                transition-shadow duration-300
                ${hoveredIndex === index ? 'shadow-lg' : 'shadow-md'}
                ${openIndex === index ? 'ring-2 ring-[#F6B335]/20' : ''}
              `}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className={`
                  p-2 rounded-lg 
                  ${openIndex === index ? 'bg-[#F6B335]/20 text-[#F6B335]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                  transition-colors duration-300
                `}>
                  {faq.icon}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white pr-8 flex-grow">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ 
                    rotate: openIndex === index ? 180 : 0,
                    color: openIndex === index ? '#F6B335' : '#9CA3AF'
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence mode="wait">
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: "auto", 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.3, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700/50">
                      <div className="pl-12 text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-[#F6B335]/10 via-white to-[#F6B335]/10 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto border border-[#F6B335]/20 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="w-12 h-12 rounded-xl bg-[#F6B335]/20 flex items-center justify-center transform transition-transform duration-300"
              >
                <Mail className="w-6 h-6 text-[#F6B335]" />
              </motion.div>
              <div className="text-gray-600 dark:text-gray-300 text-lg">
                Have more questions about hiring? Contact our recruitment team at{" "}
                <a
                  href="mailto:recruit@medh.co"
                  className="text-[#F6B335] font-semibold hover:underline inline-flex items-center gap-1 group"
                >
                  recruit@medh.co
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="inline-block transition-transform"
                  >
                    →
                  </motion.span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HireFromMedhFaq;
