"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Arrow from "@/assets/images/join-educator/arrow1.png";
import Logo1 from "@/assets/images/join-educator/logo-1.svg";
import Logo2 from "@/assets/images/join-educator/logo-2.svg";
import Logo3 from "@/assets/images/join-educator/logo-3.svg";
import Logo4 from "@/assets/images/join-educator/logo-4.svg";
import Logo5 from "@/assets/images/join-educator/logo-5.svg";
import Logo6 from "@/assets/images/join-educator/logo-6.svg";
import Logo7 from "@/assets/images/join-educator/logo-7.svg";

const HiringProcess = () => {
  const processSteps = [
    {
      title: "Application Screening",
      description:
        "We review the applications received from potential tutors/educators based on their qualifications, experience, teaching philosophy, and alignment with the company's mission and values.",
      icon: Logo1,
      arrow: true,
    },
    {
      title: "Interview Process",
      description:
        "Shortlisted candidates are invited for interviews, which could be conducted in person, over the phone, or via video conferencing to evaluate the tutor's teaching approach, communication skills, ability to handle different types of learners, and subject knowledge.",
      icon: Logo2,
      arrow: true,
    },
    {
      title: "Subject Proficiency Test",
      description:
        "Depending on the subject they will be teaching, tutors may be required to take a subject proficiency test to assess their knowledge and understanding.",
      icon: Logo3,
      arrow: false,
    },
    {
      title: "Demo Session",
      description:
        "Request the shortlisted candidates to conduct a demo tutoring session through a virtual platform to assess their teaching style and ability to engage with students effectively.",
      icon: Logo4,
      arrow: true,
    },
    {
      title: "Training and Onboarding",
      description:
        "Once selected, the tutor may undergo training to familiarize themselves with the company's teaching methodologies, platform, and policies.",
      icon: Logo5,
      arrow: true,
    },
    {
      title: "Contract and Compensation",
      description:
        "An employment contract is drawn up, outlining the terms of employment, compensation, working hours, and other relevant details. Upon acceptance, sign an employment contract.",
      icon: Logo6,
      arrow: false,
    },
    {
      title: "Performance Evaluation",
      description:
        "We may periodically evaluate the performance of tutors based on student feedback, teaching effectiveness, and adherence to the company's standards.",
      icon: Logo7,
      arrow: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 px-4 md:px-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Process of Hiring an Educator at Medh!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our team through our streamlined hiring process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <Image 
                    src={step.icon} 
                    alt={step.title}
                    className="w-16 h-16 mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-primary-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {step.arrow && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ChevronRight className="w-8 h-8 text-primary-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HiringProcess;
