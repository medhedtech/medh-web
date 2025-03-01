"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import AccordionController from "@/components/shared/accordion/AccordionController";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";

export default function CorporateFaq() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "courses",
    "pricing",
    "certification",
    "support",
    "enrollment"
  ];

  const faqs = [
    {
      category: "courses",
      question: "What is the course curriculum and learning objectives of MEDH's Corporate Training Courses?",
      answer: "Our courses are designed to cover a wide range of topics, from technical skills such as AI, Data Science, Cybersecurity, and Cloud Computing to soft skills like Leadership, Communication and Personality Development Courses. The learning objectives are tailored to equip participants with practical, industry-relevant skills and knowledge.",
    },
    {
      category: "courses",
      question: "What are the delivery methods for MEDH's Corporate Training Courses?",
      answer: "Our courses are typically delivered through a flexible 6-week program with classes held twice a week. We offer both online and in-person training options, with interactive sessions, hands-on workshops, and comprehensive learning materials.",
    },
    {
      category: "pricing",
      question: "What are the pricing and payment options for MEDH's Corporate Training Courses?",
      answer: "We offer customized pricing based on the specific needs of your organization. Our pricing models include per-participant rates, bulk enrollment discounts, and tailored corporate packages. We provide flexible payment options including corporate invoicing, bulk payment discounts, and installment plans.",
    },
    {
      category: "certification",
      question: "Are MEDH's Corporate Training Courses certified or accredited?",
      answer: "Yes, our courses are designed with industry standards in mind. Upon completion, participants receive a recognized certification that validates their newly acquired skills. Our certifications are aligned with industry benchmarks and can enhance professional credentials.",
    },
    {
      category: "courses",
      question: "Can MEDH tailor the training courses to specific business needs?",
      answer: "Absolutely! We specialize in creating customized training programs that address your organization's unique skill gaps and strategic objectives. Our team works closely with you to develop a tailored curriculum that aligns with your specific business requirements.",
    },
    {
      category: "support",
      question: "What are the qualifications and industry experience of MEDH's instructors?",
      answer: "Our instructors are seasoned IT professionals with extensive industry experience and a proven track record of providing high-quality training. They bring real-world insights and practical knowledge to the training sessions, ensuring participants gain actionable skills directly applicable to their work.",
    },
    {
      category: "support",
      question: "What post-training support and resources does MEDH provide?",
      answer: "We offer comprehensive post-training support including access to learning materials, follow-up mentorship sessions, career guidance, and a professional network. Participants also receive ongoing access to our learning platform and resources for continued skill development.",
    },
    {
      category: "courses",
      question: "How do MEDH's Corporate Training Courses compare to competitors' offerings?",
      answer: "Our courses stand out through our industry-aligned curriculum, experienced instructors, personalized learning approach, and comprehensive support. We focus on practical, hands-on learning that directly translates to workplace performance, setting us apart from traditional training providers.",
    },
    {
      category: "enrollment",
      question: "What is the enrollment process and timeline for MEDH's Corporate Training Courses?",
      answer: "Our enrollment process is straightforward. After an initial consultation to understand your needs, we provide a detailed proposal. Once agreed, we help you schedule the training, set up participant accounts, and provide pre-course materials. The entire process from initial contact to course commencement typically takes 2-4 weeks.",
    },
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <section className="bg-background text-text py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-secondary mb-8 max-w-2xl mx-auto">
              Find answers to common questions about MEDH's Corporate Training Courses. 
              Can't find what you're looking for? We're here to help!
            </p>

            {/* Category selection */}
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-md transform scale-105"
                      : "bg-card-bg text-text hover:bg-opacity-90 hover:transform hover:scale-102"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <AccordionContainer>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  idx={idx}
                  isActive={idx === 0}
                  accordion={"secondaryLg"}
                >
                  <AccordionController type={"secondaryLg"}>
                    {faq.question}
                  </AccordionController>
                  <AccordionContent>
                    <div className="content-wrapper py-4 px-5">
                      <p className="leading-7 text-contentColor dark:text-contentColor-dark">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </Accordion>
              ))
            ) : (
              <div className="text-center py-8">
                <p>No FAQs found for this category.</p>
              </div>
            )}
          </AccordionContainer>

          {/* Contact section */}
          <div className="mt-12 text-center bg-card-bg p-8 rounded-lg shadow-md">
            <p className="text-text mb-4">
              Have a question that isn't answered here?
            </p>
            <p className="flex items-center justify-center gap-2">
              Contact our support team at{" "}
              <a 
                href="mailto:care@medh.co" 
                className="text-primary hover:text-opacity-80 transition-colors duration-200 font-semibold flex items-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                care@medh.co
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
