"use client";
import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import HireSectionImg from "@/assets/images/hireformmedh/hiresectionimg.png";

const HireSection = () => {
  const benefits = [
    {
      title: "Job Ready Candidates",
      description:
        "Our intense courses are led by industry experts, ensuring that our candidates are job-ready upon completion, equipped with practical experience from relevant projects.",
    },
    {
      title: "Diverse Talent Pool",
      description:
        "Our platform boasts a diverse talent pool, allowing you to choose the perfect fit for your projects based on their skills and experience.",
    },
    {
      title: "Dedicated Support",
      description:
        "Count on our dedicated relationship managers who are well-versed in understanding your specific needs, providing unwavering support throughout the hiring process.",
    },
    {
      title: "Strong Technical Skills",
      description:
        "We prioritize strong technical skills through a rigorous selection process, ensuring candidates possess the necessary competencies for success.",
    },
    {
      title: "Networking Opportunities",
      description:
        "Emphasizing the power of networking, we encourage potential collaborations and partnerships for joint projects and expanded access to talent.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header Section */}
      <div className="container mx-auto text-center px-4 sm:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5C6574] dark:text-white mb-4">
          Start your hiring process now with{" "}
          <span className="text-[#7ECA9D]">Recruit @ Medh</span>.
        </h1>
        <p className="text-lg text-[#727695] dark:text-gray-300 max-w-3xl mx-auto">
          Providing access to top talent in the IT domain. Our platform offers a
          seamless experience for effortlessly recruiting industry-trained IT Professionals who
          are job-ready.
        </p>
      </div>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="relative w-full md:w-[40%]">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7ECA9D]/20 via-[#7ECA9D]/10 to-transparent"></div>
              <Image
                src={HireSectionImg}
                alt="Hire from Medh"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-2xl transform hover:scale-105 transition-duration-500"
                priority
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5C6574] dark:text-white">
                Why Hire from
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#7ECA9D]">
                Recruit@Medh?
              </h2>
            </div>

            <div className="space-y-6">
              {benefits.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7ECA9D] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-[#5C6574] dark:text-white group-hover:text-[#7ECA9D] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HireSection;
