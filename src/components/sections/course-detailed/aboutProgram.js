"use client";
import React, { useState } from "react";
import Image from "next/image";
import Pdf from "@/assets/images/course-detailed/pdf-icon.svg";
import Download from "@/assets/images/course-detailed/download.svg";

export default function CombinedProgram() {
  const [activeTab, setActiveTab] = useState("ProgramInfo");
  const [openAccordions, setOpenAccordions] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("Foundation");

  const toggleAccordion = (index) => {
    setOpenAccordions(openAccordions === index ? null : index);
  };

  const curriculum = [
    {
      question: "Weeks 1-4: Introduction to Digital Marketing & Data Analytics",
      answer:
        "This module provides an introduction to digital marketing concepts, including online customer behavior, market research, and an overview of data analytics tools.",
    },
    {
      question: "Weeks 5-8: Website Analytics and SEO",
      answer:
        "In this section, students will learn how to track and analyze website performance using Google Analytics, along with an in-depth understanding of SEO strategies.",
    },
    {
      question: "Weeks 9-12: Pay-Per-Click (PPC) Advertising",
      answer:
        "This module covers the fundamentals of PPC advertising, including Google Ads, keyword research, bidding strategies, and campaign optimization.",
    },
    {
      question: "Weeks 13-16: Social Media Marketing (SMM)",
      answer:
        "The SMM module focuses on leveraging social media platforms such as Facebook, Instagram, and LinkedIn to create targeted ad campaigns and analyze their effectiveness.",
    },
    {
      question: "Tools & Technologies You Will Learn",
      answer:
        "Throughout the course, you will learn to use tools like Google Analytics, Google Ads, Facebook Ads Manager, and SEO software like Ahrefs or SEMrush.",
    },
    {
      question: "Bonus Module",
      answer:
        "The bonus module covers advanced topics like email marketing, affiliate marketing, and influencer marketing, giving you extra insights into additional digital marketing strategies.",
    },
    {
      question: "Assessment, Evaluation & Certification",
      answer:
        "Students will undergo assessments based on real-world projects and case studies, with certifications awarded upon successful completion of the course.",
    },
  ];

  return (
    <div className="bg-white text-lightGrey14 md:py-10 py-5  px-4 md:px-4">
      <div className="lg:w-[62%] w-full lg:ml-[7%]  ">
        {/* Header Section */}

        {/* Tab Buttons */}
        <div className="border-b-2 mt-6 mb-5 pt-4 ">
        
          <button
            onClick={() => setActiveTab("ProgramInfo")} // Set active tab
            className={`font-semibold ${
              activeTab === "ProgramInfo"
                ? "text-primaryColor border-b-2 border-primaryColor"
                : "text-gray-500"
            }`}
          >
            Program Info
          </button>
          <button
            onClick={() => setActiveTab("Reviews")} // Set active tab
            className={`ml-6 font-semibold ${
              activeTab === "Reviews"
                ? "text-primaryColor border-b-2 border-primaryColor"
                : "text-gray-500"
            }`}
          >
            Reviews
          </button>
        </div>

        <h2 className="md:text-2xl text-[20px] font-bold mb-4 text-[#5C6574]">
          About Program
        </h2>
        {/* Show Content Based on Active Tab */}
        {activeTab === "ProgramInfo" ? (
          <>
            {/* Sub Tabs for Program Info (Foundation, Advanced, Diploma) */}
            <div className="flex space-x-2 mt-4">
              {["Foundation", "Advanced", "Diploma"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold ${
                    activeSubTab === tab
                      ? "bg-primaryColor text-white"
                      : "bg-gray-100 text-primaryColor"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="border-2 border-primaryColor p-2">
              <div className="text-primaryColor font-medium pb-2">
                <u>Curriculum</u>
                <p>
                  
                  Duration:
                  {"  "}
                  <u>
                    4 Months Course (16 weeks/ 32 sessions of 90-120 minutes
                    each){" "}
                  </u>
                </p>
                <strong>Chapters & Topics</strong>
              </div>

              {/* Accordion Items */}
              {curriculum.map((item, index) => (
                <div key={index} className="border mb-1 text-[#41454F]">
                  <button
                    className="w-full p-3 flex items-center"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="mr-2 text-2xl font-extrabold text-[#41454F]">
                      {openAccordions === index ? "-" : "+"}
                    </span>{" "}
                    {/* Left aligned + or - */}
                    <span className="text-[1rem]">{item.question}</span>
                  </button>
                  {openAccordions === index && (
                    <div className="py-3 pl-7 bg-gray-50 text-[15px]  text-gray-600">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Download Brochure */}
              <div className="flex justify-between flex-wrap w-full mt-12">
                <div className="flex-1 flex justify-center items-center mb-4 min-w-[150px]">
                  <Image src={Pdf} width={120} />
                </div>

                <div className="flex-1 mb-4 text-center min-w-[250px]">
                  <h2 className="text-primaryColor text-[1.4rem] font-bold font-Popins">
                    Download Brochure
                  </h2>
                  <p className="text-[15px]">
                    Unlock Your Potential: Download and Begin Your
                    Transformation Today!
                  </p>
                </div>

                <div className="flex-1 flex justify-center items-center mb-4 min-w-[200px] text-white">
                  <button className="bg-[#F2277E] flex justify-center items-center px-8 py-3 font-bold text-[1rem]">
                    <Image src={Download} width={30} className="mr-3" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Content for Reviews tab */
          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-4">Student Reviews</h3>
            <p className="text-gray-600">No reviews available at this time.</p>
            {/* You can add review content here */}
          </div>
        )}
      </div>
    </div>
  );
}
