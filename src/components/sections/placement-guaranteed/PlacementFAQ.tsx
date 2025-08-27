"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Program Basics",
    items: [
      {
        id: 1,
        question: "What are the prerequisites for enrolling in MEDH's 100% Job Guaranteed Courses?",
        answer: "To enroll in our 100% Job Guaranteed Courses, you must be legally authorized to work in the country where you are seeking employment. You must also meet any specific prerequisites outlined for the course you are interested in (e.g., minimum employment age, prior knowledge, educational background)."
      },
      {
        id: 2,
        question: "What is the structure of MEDH's 100% Job Guaranteed Courses?",
        answer: "Our Job Guaranteed Courses feature a comprehensive structure that includes instructor-led training, hands-on projects, assessments, a mandatory 3-month internship program, and dedicated job placement support. Each course is designed to provide both theoretical knowledge and practical skills needed for industry success."
      },
      {
        id: 3,
        question: "Are there any additional costs involved in the program?",
        answer: "The course fee covers all essential training materials, internship placement, and job placement services. There are no hidden or additional mandatory costs. Optional resources or certifications may be available at additional cost, but these are not required for program completion or job guarantee eligibility."
      }
    ]
  },
  {
    title: "Enrollment Process",
    items: [
      {
        id: 4,
        question: "Is a separate agreement executed between students and MEDH for Placement Guaranteed Courses?",
        answer: "As a transparent brand, MEDH does not typically execute separate agreements for Placement Guaranteed Courses since all terms and conditions are clearly outlined in our Money Guarantee Policy. Your enrollment in the course constitutes your acceptance of these terms. However, suppose you specifically request a separate agreement. In that case, we are happy to provide one on a stamp paper that includes all the terms mentioned in our Money Guarantee Policy without any additional conditions, post enrollment in any of the Job Guaranteed Course."
      }
    ]
  },
  {
    title: "Job Guarantee Details",
    items: [
      {
        id: 5,
        question: "How does MEDH's Money Guarantee work?",
        answer: "Our Money Guarantee provides eligible students with a refund (minus 15% for administrative costs) if they don't secure industry-standard employment within 180 days of course completion, despite meeting all program requirements including the mandatory 3-month internship."
      },
      {
        id: 6,
        question: "What do I need to do to qualify for the guarantee?",
        answer: "To qualify, you must complete 100% of the course curriculum, attend all required sessions, submit all assignments on time, successfully complete the mandatory 3-month internship, participate in placement activities, apply to at least seven relevant positions with guidance from our Placement Team, and follow all career counseling provided."
      },
      {
        id: 7,
        question: "What are the terms and conditions for the Job Guarantee?",
        answer: "The key terms include completing all course requirements, the mandatory 3-month internship, applying to at least seven relevant positions within 90 days of course completion, and following our career guidance. The guarantee is valid for 180 days after course completion. For complete details, please visit our Money Guarantee Policy page."
      },
      {
        id: 8,
        question: "What happens if I do not get a job after completing the course?",
        answer: "If you meet all eligibility requirements but do not secure employment within 180 days of course completion, you can request a refund of your course fee minus a 15% administrative and technology fee. Our team will continue to provide placement support even during the refund process."
      }
    ]
  },
  {
    title: "Internship Program",
    items: [
      {
        id: 9,
        question: "Is the 3-month internship mandatory?",
        answer: "Yes, successfully completing the 3-month internship is a mandatory requirement for all Job Guaranteed Courses and is essential for qualifying for the Money Guarantee. This internship provides valuable hands-on experience that significantly enhances your employability."
      },
      {
        id: 10,
        question: "When does the internship take place during the program?",
        answer: "The 3-month internship typically begins after the successful completion of the core course curriculum. The exact timing may vary by program, and details will be provided in your specific course schedule."
      }
    ]
  },
  {
    title: "Job Placement Support",
    items: [
      {
        id: 11,
        question: "What kind of support will I receive during the job search?",
        answer: "Our comprehensive job placement support includes resume building, interview preparation, networking opportunities, job application assistance, and direct employer connections. The MEDH Placement Team will guide you through applying to relevant positions and provide ongoing support throughout your job search."
      },
      {
        id: 12,
        question: "How long do I have to find a job after completing the course?",
        answer: "The guarantee covers a period of 180 days (6 months) from the date of course completion. During this time, our Placement Team actively works with you to secure suitable employment."
      },
      {
        id: 13,
        question: "What type of jobs qualify under the guarantee?",
        answer: "Jobs that are in your field of study with industry-standard remuneration qualify under our guarantee. These include full-time, part-time, and contract positions that utilize the skills taught in your program."
      },
      {
        id: 14,
        question: "What is the expected time frame to secure a job after course completion?",
        answer: "While many students secure employment within 1-3 months of program completion, the job guarantee period extends to 180 days after course completion to account for varying job market conditions and individual circumstances."
      }
    ]
  },
  {
    title: "International Students",
    items: [
      {
        id: 15,
        question: "Can international learners apply for the Job Guaranteed Courses?",
        answer: "Yes, international learners can apply for our Job Guaranteed Courses. However, to qualify for the job guarantee, you must be legally authorized to work in the country where you are seeking employment. International students should verify their work authorization status before enrollment."
      },
      {
        id: 16,
        question: "Will the placement be provided within the country or abroad too?",
        answer: "Our primary placement focus is within the country where the course is conducted. While we may have opportunities with international employers, job placement in other countries depends on various factors including visa regulations, work authorization, and employer requirements."
      }
    ]
  },
  {
    title: "Refund Process",
    items: [
      {
        id: 17,
        question: "How do I apply for a tuition refund if I don't get a job?",
        answer: "Refund requests must be submitted in writing to refunds@medh.co along with all required documentation including proof of course completion, internship completion, and your job search activities. Complete details of the documentation requirements are available on our Money Guarantee Policy page."
      },
      {
        id: 18,
        question: "What is MEDH's process for Course Fee Refunds?",
        answer: "Our refund process is transparent and straightforward. Once your refund request and supporting documentation are submitted, our Refund Committee will review your application within 30 business days. If approved, the refund will be processed within 30 business days of approval."
      }
    ]
  }
];

const PlacementFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Helper function to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    // Define patterns and their corresponding links
    const linkPatterns = [
      {
        pattern: 'Money Guarantee Policy page',
        href: '/money-guarantee-policy/',
        type: 'internal'
      },
      {
        pattern: 'refunds@medh.co',
        href: 'mailto:refunds@medh.co',
        type: 'email'
      },
      {
        pattern: 'our Money Guarantee Policy',
        href: '/money-guarantee-policy/',
        type: 'internal'
      }
    ];

    // Create regex pattern to match all link patterns
    const regexPattern = linkPatterns.map(p => p.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${regexPattern})`, 'g');
    
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      const linkInfo = linkPatterns.find(p => p.pattern === part);
      
      if (linkInfo) {
        if (linkInfo.type === 'internal') {
          return (
            <Link 
              key={index}
              href={linkInfo.href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200"
            >
              {part}
            </Link>
          );
        } else if (linkInfo.type === 'email') {
          return (
            <a 
              key={index}
              href={linkInfo.href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200"
            >
              {part}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions about our placement guarantee program
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-4">
              {/* Category Header */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                className="text-xl font-bold text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-2"
              >
                {category.title}
              </motion.h3>
              
              {/* FAQ Items in Category */}
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                        {item.question}
                      </span>
                      {openItems.includes(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {renderTextWithLinks(item.answer)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            For complete details about our Job Guarantee, please visit our Money Guarantee Policy page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/money-guarantee-policy/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              View Money Guarantee Policy
            </Link>
            <button className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementFAQ;