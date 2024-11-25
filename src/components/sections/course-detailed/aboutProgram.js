"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Pdf from "@/assets/images/course-detailed/pdf-icon.svg";
import Download from "@/assets/images/course-detailed/download.svg";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import DownloadBrochureModal from "@/components/shared/download-broucher";

export default function CombinedProgram({ courseId }) {
  const [activeTab, setActiveTab] = useState("ProgramInfo");
  const [openAccordions, setOpenAccordions] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("Foundation");
  const { getQuery, loading } = useGetQuery();
  const [courseDetails1, setCourseDetails1] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    } else {
      notFound();
    }
  }, []);

  const fetchCourseDetails = async (id) => {
    try {
      await getQuery({
        url: `${apiUrls?.courses?.getCourseById}/${id}`,
        onSuccess: (data) => {
          setCourseDetails1(data);
        },
        onFail: (err) => {
          console.error("Error fetching course details:", err);
        },
      });
    } catch (error) {
      console.error("Error in fetching course details:", error);
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordions(openAccordions === index ? null : index);
  };

  const curriculum = [
    {
      question: `Weeks 1-4: Introduction to ${courseDetails1?.course_title}`,
      answer: `This module provides an introduction to ${courseDetails1?.course_title} marketing concepts, including online customer behavior, market research, and an overview of data analytics tools.`,
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

  if (loading) {
    return <Preloader />;
  }
  return (
    <div className="bg-white dark:bg-[#050622] text-lightGrey14  md:py-10 py-5  px-4 md:px-4">
      <div className="lg:w-[62%] w-full lg:ml-[7%]  ">
        {/* Header Section */}

        {/* Tab Buttons */}
        <div className="border-b-2 mt-6 mb-5 pt-4 ">
          <button
            onClick={() => setActiveTab("ProgramInfo")}
            className={`font-semibold ${
              activeTab === "ProgramInfo"
                ? "text-primaryColor border-b-2 border-primaryColor"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Program Info
          </button>
          <button
            onClick={() => setActiveTab("Reviews")}
            className={`ml-6 font-semibold ${
              activeTab === "Reviews"
                ? "text-primaryColor border-b-2 border-primaryColor"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            Reviews
          </button>
        </div>

        <h2 className="md:text-2xl text-[20px] font-bold mb-4 text-[#5C6574] dark:text-gray-50">
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
            <div className="border-2 dark:border-gray-500 border-primaryColor p-2 ">
              <div className="text-primaryColor font-medium pb-2 dark:text-gray-200">
                <u>Curriculum</u>
                <p>
                  Duration:
                  {"  "}
                  <u>
                    ({courseDetails1?.course_duration},{" "}
                    {courseDetails1?.no_of_Sessions} / sessions of{" "}
                    {courseDetails1?.session_duration} minutes each){" "}
                  </u>
                </p>
                <strong>Chapters & Topics</strong>
              </div>

              {/* Accordion Items */}
              {curriculum.map((item, index) => (
                <div
                  key={index}
                  className="border dark:border-gray-600 mb-1 text-[#41454F] dark:text-gray-300"
                >
                  <button
                    className="w-full p-3 flex items-center"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="mr-2 text-2xl font-extrabold text-[#41454F] dark:text-gray-200">
                      {openAccordions === index ? "-" : "+"}
                    </span>{" "}
                    {/* Left aligned + or - */}
                    <span className="text-[1rem]">{item.question}</span>
                  </button>
                  {openAccordions === index && (
                    <div className="py-3 pl-7 dark:bg-[#050622] bg-gray-50 text-[15px]  text-gray-600">
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
                  <h2 className="text-primaryColor text-[1.4rem] font-bold font-Popins dark:text-gray-50">
                    Download Brochure
                  </h2>
                  <p className="text-[15px] dark:text-gray-300">
                    Unlock Your Potential: Download and Begin Your
                    Transformation Today!
                  </p>
                </div>

                <div className="flex-1 flex justify-center items-center mb-4 min-w-[200px] text-white">
                  <button
                    onClick={openModal}
                    className="bg-[#F6B335] flex justify-center items-center px-8 py-3 font-bold text-[1rem]"
                  >
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
      <DownloadBrochureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        courseTitle={courseDetails1?.course_title}
      />
    </div>
  );
}
