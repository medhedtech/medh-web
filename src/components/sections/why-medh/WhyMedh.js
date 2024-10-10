import Image from "next/image";
import React from "react";
import iso27001 from "@/assets/images/iso/iso27001.png";
import iso10002 from "@/assets/images/iso/iso10002.png";
import iso20000 from "@/assets/images/iso/iso20000.png";
import iso22301 from "@/assets/images/iso/iso22301.png";
import iso9001 from "@/assets/images/iso/iso9001.png";
import placement from "@/assets/images/iso/placement.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import hire from "@/assets/images/hire/Hire.png";

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
          <p className="font-bold text-2xl md:text-3xl leading-8 text-[#5C6574]">
            100% Job-guaranteed Courses from Medh.
          </p>
          <button className="bg-[#F2277E] px-6 py-3 w-fit mx-auto text-white hover:bg-pink-700 transition">
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
        <div className="bg-white py-6 px-6 md:px-10 lg:px-16 relative shadow-lg w-full max-w-[630px]">
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
          <button className="bg-[#5F2DED] text-white mt-6 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
            More info..
          </button>

          {/* Carousel Navigation */}
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
            <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
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
      <div className="bg-gray-100 py-12">
        <h3 className="text-center text-[#5C6574] text-2xl font-bold mb-8">
          Certified & Recognized By
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
          <div>
            <Image
              src={iso10002}
              width={100}
              height={162}
              alt="ISO 10002 Certification"
            />
          </div>
          <div>
            <Image
              src={iso27001}
              width={100}
              height={162}
              alt="ISO 27001 Certification"
            />
          </div>
          <div>
            <Image
              src={iso20000}
              width={100}
              height={162}
              alt="ISO 20000 Certification"
            />
          </div>
          <div>
            <Image
              src={iso22301}
              width={100}
              height={162}
              alt="ISO 22301 Certification"
            />
          </div>
          <div>
            <Image
              src={iso9001}
              width={100}
              height={162}
              alt="ISO 9001 Certification"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyMedh;
