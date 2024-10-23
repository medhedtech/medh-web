"use client";
import Image from "next/image";
import React from "react";
import placement from "@/assets/images/iso/Placement.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import hire from "@/assets/images/hire/Hire.png";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import InfoIcon from "@/assets/images/icon/InfoIcon";
import Certified from "./Certified";

const WhyMedh = () => {
  return (
    <div>
      {/* Job Guarantee Section */}
      <div className="flex flex-col md:flex-row items-center px-4 md:px-8 lg:px-20 py-7 gap-6">
        <div className="text-center md:w-1/2 px-4 md:px-6 flex flex-col gap-3">
          <Image
            src={placement}
            width={300}
            height={161}
            className="mx-auto"
            alt="100% Job-guaranteed"
          />
          <p className="font-bold text-2xl md:text-3xl leading-8 text-[#5C6574] dark:text-white">
            100% Job-guaranteed Courses from Medh.
          </p>
          <button className="bg-[#F2277E] px-4 py-3 w-fit mx-auto text-white flex gap-4">
            <span>
              <ArrowIcon />
            </span>
            Explore Courses
          </button>
        </div>
        <div className="md:w-1/2">
          <Image
            src={hire}
            width={530}
            height={454}
            className="w-full h-auto"
            alt="Hiring"
          />
        </div>
      </div>

      {/* Why Medh Section */}
      <div
        className="bg-cover bg-center h-[400px] md:h-[600px] flex items-center justify-start px-14"
        style={{ backgroundImage: `url(${bgImg.src})` }}
      >
        {/* Content Box */}
        <div
          className="bg-white h-60 md:h-auto py-6 px-6 md:px-10 lg:px-16 relative shadow-lg w-full max-w-[630px] 
    overflow-x-hidden md:overflow-visible sm:h-60 sm:overflow-x-scroll"
        >
          <h2 className="text-[#5F2DED] font-bold text-3xl md:text-4xl">
            WHY MEDH?
          </h2>
          <p className="text-gray-600 mt-4">
            Empowering learners with the freedom to explore, we go beyond
            fundamental concepts, fostering brainstorming, critical thinking,
            and beyond. We aim to provide learners with the canvas to visualize
            and pursue their aspirations.
          </p>

          <h3 className="text-[#252525] mt-7 font-semibold text-lg">
            Quality of Content and Curriculum
          </h3>
          <p className="text-gray-600 mt-4">
            We assess content quality, effectiveness, and engagement, ensuring
            up-to-date, well-structured materials that drive learning outcomes.
          </p>

          {/* More Info Button */}
          <button className="bg-[#5F2DED] text-white mt-6 px-4.5 py-2 flex items-center justify-center gap-6">
            <span>
              <InfoIcon />
            </span>
            More info..
          </button>

          {/* Carousel Navigation */}
          <div className="absolute -left-6 top-1/2  transform -translate-y-1/2">
            <button className="bg-white  text-black rounded-full w-10 h-10 flex items-center justify-center">
              &larr;
            </button>
          </div>
          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
            <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Certified & Recognized By Section */}

      <Certified />
    </div>
  );
};

export default WhyMedh;
