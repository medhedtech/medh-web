"use client";
import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import SkillSectionImg from "@/assets/images/hireformmedh/skillsectionimg.jpeg";

const SkillsSection = () => {
  const skills = [
    "Artificial Intelligence (AI)",
    "Data Science & Analytics",
    "Cloud Computing",
    "Mobile App Development",
    "Big Data",
    "Web Development",
    "Cyber Security",
    "Digital Marketing ... and many more.",
  ];

  return (
    <section className="relative bg-[#FFE5F0] dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-[45%]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F6B335]/20 via-[#F6B335]/10 to-transparent rounded-tl-[60px] rounded-br-[60px]"></div>
              <Image
                src={SkillSectionImg}
                alt="Classroom with students"
                width={800}
                height={600}
                className="w-full h-auto rounded-tl-[60px] rounded-br-[60px] shadow-2xl transform hover:scale-105 transition-all duration-700"
                priority
              />
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F6B335]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#F6B335]/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Headers */}
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-[#F6B335]">
                Get-Job-Ready Candidates
              </h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
                with following IT skills
              </p>
            </div>

            {/* Skills List */}
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 group hover:transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F6B335] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-700 dark:text-white group-hover:text-[#F6B335] transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-[#F6B335] text-white rounded-lg hover:bg-[#e5a730] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#F6B335]/25">
              Hire Skilled Professionals
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
