"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Users, Briefcase, Globe, CreditCard } from "lucide-react";



interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const PlacementFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData: FAQItem[] = [
    // Program Basics
    {
      category: "Program Basics",
      question: "What are the prerequisites for enrolling in MEDH's 100% Job Guaranteed Courses?",
      answer: "To enroll in our 100% Job Guaranteed Courses, you must be legally authorized to work in the country where you are seeking employment. You must also meet any specific prerequisites outlined for the course you are interested in (e.g., minimum employment age, prior knowledge, educational background).",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      category: "Program Basics",
      question: "What is the structure of MEDH's 100% Job Guaranteed Courses?",
      answer: "Our Job Guaranteed Courses feature a comprehensive structure that includes instructor-led training, hands-on projects, assessments, a mandatory 3-month internship program, and dedicated job placement support. Each course is designed to provide both theoretical knowledge and practical skills needed for industry success.",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      category: "Program Basics",
      question: "Are there any additional costs involved in the program?",
      answer: "The course fee covers all essential training materials, internship placement, and job placement services. There are no hidden or additional mandatory costs. Optional resources or certifications may be available at additional cost, but these are not required for program completion or job guarantee eligibility.",
      icon: <BookOpen className="w-5 h-5" />
    },
    // Enrollment Process
    {
      category: "Enrollment Process",
      question: "Is a separate agreement executed between students and MEDH for Placement Guaranteed Courses?",
      answer: "As a transparent brand, MEDH does not typically execute separate agreements for Placement Guaranteed Courses since all terms and conditions are clearly outlined in our Money Guarantee Policy. Your enrollment in the course constitutes your acceptance of these terms. However, suppose you specifically request a separate agreement. In that case, we are happy to provide one on a stamp paper that includes all the terms mentioned in our Money Guarantee Policy without any additional conditions, post enrollment in any of the Job Guaranteed Course.",
      icon: <HelpCircle className="w-5 h-5" />
    },
    // Job Guarantee Details
    {
      category: "Job Guarantee Details",
      question: "How does MEDH's Money Guarantee work?",
      answer: "Our Money Guarantee provides eligible students with a refund (minus 15% for administrative costs) if they don't secure industry-standard employment within 180 days of course completion, despite meeting all program requirements including the mandatory 3-month internship.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      category: "Job Guarantee Details",
      question: "What do I need to do to qualify for the guarantee?",
      answer: "To qualify, you must complete 100% of the course curriculum, attend all required sessions, submit all assignments on time, successfully complete the mandatory 3-month internship, participate in placement activities, apply to at least seven relevant positions with guidance from our Placement Team, and follow all career counseling provided.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      category: "Job Guarantee Details",
      question: "What are the terms and conditions for the Job Guarantee?",
      answer: "The key terms include completing all course requirements, the mandatory 3-month internship, applying to at least seven relevant positions within 90 days of course completion, and following our career guidance. The guarantee is valid for 180 days after course completion. For complete details, please visit our Money Guarantee Policy page.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      category: "Job Guarantee Details",
      question: "What happens if I do not get a job after completing the course?",
      answer: "If you meet all eligibility requirements but do not secure employment within 180 days of course completion, you can request a refund of your course fee minus a 15% administrative and technology fee. Our team will continue to provide placement support even during the refund process.",
      icon: <CreditCard className="w-5 h-5" />
    },
    // Internship Program
    {
      category: "Internship Program",
      question: "Is the 3-month internship mandatory?",
      answer: "Yes, successfully completing the 3-month internship is a mandatory requirement for all Job Guaranteed Courses and is essential for qualifying for the Money Guarantee. This internship provides valuable hands-on experience that significantly enhances your employability.",
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      category: "Internship Program",
      question: "When does the internship take place during the program?",
      answer: "The 3-month internship typically begins after the successful completion of the core course curriculum. The exact timing may vary by program, and details will be provided in your specific course schedule.",
      icon: <Briefcase className="w-5 h-5" />
    },
    // Job Placement Support
    {
      category: "Job Placement Support",
      question: "What kind of support will I receive during the job search?",
      answer: "Our comprehensive job placement support includes resume building, interview preparation, networking opportunities, job application assistance, and direct employer connections. The MEDH Placement Team will guide you through applying to relevant positions and provide ongoing support throughout your job search.",
      icon: <Users className="w-5 h-5" />
    },
    {
      category: "Job Placement Support",
      question: "How long do I have to find a job after completing the course?",
      answer: "The guarantee covers a period of 180 days (6 months) from the date of course completion. During this time, our Placement Team actively works with you to secure suitable employment.",
      icon: <Users className="w-5 h-5" />
    },
    {
      category: "Job Placement Support",
      question: "What type of jobs qualify under the guarantee?",
      answer: "Jobs that are in your field of study with industry-standard remuneration qualify under our guarantee. These include full-time, part-time, and contract positions that utilize the skills taught in your program.",
      icon: <Users className="w-5 h-5" />
    },
    // International Students
    {
      category: "International Students",
      question: "Can international learners apply for the Job Guaranteed Courses?",
      answer: "Yes, international learners can apply for our Job Guaranteed Courses. However, to qualify for the job guarantee, you must be legally authorized to work in the country where you are seeking employment. International students should verify their work authorization status before enrollment.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      category: "International Students",
      question: "Will the placement be provided within the country or abroad too?",
      answer: "Our primary placement focus is within the country where the course is conducted. While we may have opportunities with international employers, job placement in other countries depends on various factors including visa regulations, work authorization, and employer requirements.",
      icon: <Globe className="w-5 h-5" />
    },
    // Refund Process
    {
      category: "Refund Process",
      question: "How do I apply for a tuition refund if I don't get a job?",
      answer: "Refund requests must be submitted in writing to refunds@medh.co along with all required documentation including proof of course completion, internship completion, and your job search activities. Complete details of the documentation requirements are available on our Money Guarantee Policy page.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      category: "Refund Process",
      question: "What is the expected time frame to secure a job after course completion?",
      answer: "While many students secure employment within 1-3 months of program completion, the job guarantee period extends to 180 days after course completion to account for varying job market conditions and individual circumstances.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      category: "Refund Process",
      question: "What is MEDH's process for Course Fee Refunds?",
      answer: "Our refund process is transparent and straightforward. Once your refund request and supporting documentation are submitted, our Refund Committee will review your application within 30 business days. If approved, the refund will be processed within 30 business days of approval.",
      icon: <CreditCard className="w-5 h-5" />
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Program Basics":
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "Enrollment Process":
        return <HelpCircle className="w-5 h-5 text-green-600" />;
      case "Job Guarantee Details":
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case "Internship Program":
        return <Briefcase className="w-5 h-5 text-orange-600" />;
      case "Job Placement Support":
        return <Users className="w-5 h-5 text-indigo-600" />;
      case "International Students":
        return <Globe className="w-5 h-5 text-teal-600" />;
      case "Refund Process":
        return <CreditCard className="w-5 h-5 text-red-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3 shadow-lg">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">100% Job Guaranteed Courses</span>
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="group">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 dark:border-gray-700/50 p-4 md:p-6 hover:shadow-lg transition-all duration-500 hover:scale-[1.01]">
                {/* Category Header */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 px-3 py-1.5 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      {category}
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {faqData
                    .filter(item => item.category === category)
                    .map((item, index) => {
                      const globalIndex = faqData.findIndex(faq => faq === item);
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <div
                          key={globalIndex}
                          className="group/faq bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/20 rounded-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden hover:shadow-sm transition-all duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/50"
                        >
              <button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-4 py-3 text-left bg-transparent hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 flex items-center justify-between group/button"
                          >
                            <div className="flex items-start space-x-2 flex-1">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {globalIndex + 1}
                                </div>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm leading-relaxed group-hover/button:text-blue-700 dark:group-hover/button:text-blue-300 transition-colors duration-200">
                                {item.question}
                </span>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <div className={`w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                {isOpen ? (
                                  <ChevronUp className="w-3 h-3 text-white" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
              </button>
                          
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-3 bg-white/60 dark:bg-gray-800/60 border-t border-gray-200/50 dark:border-gray-600/50">
                              <div className="pt-3">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-blue-200/50 dark:border-blue-600/50 shadow-md">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-blue-800 dark:text-blue-200 font-semibold text-sm md:text-base">
              For complete details about our Job Guarantee, please visit our{" "}
              <a 
                href="/money-guarantee-policy" 
                className="underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-bold"
              >
                Money Guarantee Policy page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 

export default PlacementFAQ; 