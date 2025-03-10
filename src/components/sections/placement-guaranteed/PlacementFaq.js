"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";

const PlacementFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "What are the prerequisites for enrolling in Medh's 100% Job Guaranteed Courses?",
      answer:
        "To enroll in our 100% Job Guaranteed Courses, you must: Be legally authorized to work in the country where you are seeking employment. Meet any specific prerequisites outlined for the course you are interested in (e.g., prior knowledge, educational background).",
    },
    {
      question: "What is the structure of Medh's 100% Job Guaranteed Courses?",
      answer:
        "Our courses are designed to combine theoretical knowledge with practical application. You will engage in: Hands-on projects, Case studies, Real-world simulations, Corporate internships, Job Readiness Programs",
    },
    {
      question: "How does Medh's Job Guarantee work?",
      answer:
        "Upon successful completion of the course, if you do not receive a job offer in your field, we guarantee: A 100% refund of your tuition fee, Additional job readiness modules to enhance your employability",
    },
    {
      question: "What are the terms and conditions for the Job Guarantee?",
      answer:
        "To qualify for the job guarantee, you must: Complete all course requirements and obtain a Certificate of Completion. Participate in weekly career commitments, including job applications, outreach, and relevant contributions., Engage in corporate internships and industry-aligned certifications as part of the program., Be actively involved in the job search process for a specified period after course completion.",
    },
    {
      question:
        "What happens if I do not get a job after completing the course?",
      answer:
        "If you meet all the program requirements and still do not secure a job, you can apply for a tuition refund. The process includes: Submitting a request for a refund within 30 days of the Termination Date listed in your Job Guarantee agreement., Providing necessary documentation to verify your job search efforts and compliance with the program's terms.",
    },
    {
      question: "Are there any additional costs involved in the program?",
      answer:
        "No, the tuition fee covers all aspects of the course, including: Course materials, Internship placement, Career support services",
    },
    {
      question: "What kind of support will I receive during the job search?",
      answer:
        "Our dedicated career services team will assist you with: Resume building, Interview preparation, Job application guidance, Networking opportunities",
    },
    {
      question:
        "Can international learners apply for the Job Guaranteed Courses?",
      answer:
        "Currently, the Job Guarantee is available only to learners who are citizens or permanent residents of the country where the job placement is offered.",
    },
    {
      question: "How do I apply for a tuition refund if I don't get a job?",
      answer:
        "To apply for a tuition refund, you must:Ensure you have met all the course requirements and career commitments., Submit a written request for a refund within 30 days of the Termination Date., Provide documentation of your job search efforts and compliance with the program's terms.",
    },
    {
      question:
        "What is the expected time frame to secure a job after course completion?",
      answer:
        "We expect you to actively engage in the job search process for up to 100 days after course completion. During this period, you should fulfill all career commitments outlined in your Job Guarantee agreement.",
    },
    {
      question: "Transparent Process for Course Fee Refunds",
      answer:
        "By adhering to these guidelines, we ensure a fair and transparent process for all involved, providing you with the confidence and support needed to secure your dream job.",
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
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover answers to frequently asked questions about Medh's Job Guaranteed Courses.
            Learn about the process, prerequisites, career opportunities, refund policies, and more.
          </p>
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-[#7ECA9D]"
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
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
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
          <div className="bg-[#7ECA9D]/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#7ECA9D]/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#7ECA9D]" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Have more questions? Contact our support team at{" "}
                <a
                  href="mailto:care@medh.co"
                  className="text-[#7ECA9D] font-semibold hover:underline"
                >
                  care@medh.co
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlacementFaq;
