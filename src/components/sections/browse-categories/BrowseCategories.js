import Image from "next/image";
import React from "react";
import personalityIcon from "@/assets/images/courses/Personal.png";
import aiIcon from "@/assets/images/courses/ai.png";
import vedicIcon from "@/assets/images/courses/Maths.png";
import Network from "@/assets/images/courses/Networking.png";
import Recongnized from "@/assets/images/courses/Recognized.png";
import Industry from "@/assets/images/courses/Industry.png";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";

const BrowseCategories = () => {
  return (
    <div className="py-12 px-4 md:px-8 lg:px-32">
      {/* Browse Trending Categories Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="md:px-6 mb-4 md:mb-0">
          <h3 className="text-purple-600 uppercase tracking-wider text-sm text-center md:text-left">
            Course Categories
          </h3>
          <h1 className="text-gray-800 font-bold text-2xl md:text-3xl text-center md:text-left mt-2">
            Browse Trending Categories
          </h1>
        </div>
        <div className="md:px-6">
          <button className="bg-[#F2277E] text-white px-4 py-2  font-semibold flex gap-3 w-full md:w-auto">
            <span>
              <ArrowIcon />
            </span>
            View All
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
        {/* Category Card 1 */}
        <div className="bg-[#F2EEFF] flex flex-col justify-between shadow-md">
          <Image
            src={personalityIcon}
            width={200}
            height={200}
            alt="Personality Development"
            className="mx-auto"
          />
          <h3 className="text-xl font-bold mt-4 py-2 text-center bg-[#F2277E] text-white ">
            Personality Development
          </h3>
        </div>

        {/* Category Card 2 */}
        <div className="bg-[#F2EEFF] flex flex-col justify-between  rounded-lg shadow-md">
          <Image
            src={aiIcon}
            width={200}
            height={200}
            alt="AI and Data Science"
            className="mx-auto"
          />
          <h3 className="text-xl font-bold mt-4 py-2 text-center bg-[#F2277E] text-white ">
            AI and Data Science
          </h3>
        </div>

        {/* Category Card 3 */}
        <div className="bg-[#F2EEFF] flex flex-col justify-between  shadow-md">
          <Image
            src={vedicIcon}
            width={200}
            height={200}
            alt="Vedic Mathematics"
            className="mx-auto"
          />
          <h3 className="text-xl font-bold mt-4 py-2 text-center bg-[#F2277E] text-white ">
            Vedic Mathematics
          </h3>
        </div>
      </div>

      {/* Immersive Learning Section */}
      <div className="mt-16">
        <h3 className="text-center text-blue-500 text-sm font-semibold tracking-wide uppercase mb-2">
          Make Connections
        </h3>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Immersive Learning: Your Tailored Pathway to Excellence.
        </h2>
        <p className="text-center text-gray-600 mt-4 px-4 md:px-16 lg:px-32">
          Offers engaging, interactive experiences, fostering deep
          understanding, critical thinking,
          <br className="hidden md:inline" /> and skill development in diverse
          educational settings.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <div className="bg-white p-6 shadow-lg text-center rounded-lg">
            <div>
              <Image
                src={Industry}
                width={90}
                height={90}
                alt="Industry-Relevant Skills"
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              Industry-Relevant Skills
            </h3>
            <p className="text-gray-600 mt-2">
              Designed in collaboration with industry experts, ensuring that
              students acquire practical, up-to-date skills for their desired
              career paths.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 shadow-lg text-center rounded-lg">
            <div>
              <Image
                src={Recongnized}
                width={90}
                height={90}
                alt="Industry-Recognized Certifications"
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              Industry-Recognized Certifications
            </h3>
            <p className="text-gray-600 mt-2">
              Offer industry-recognized certifications upon completion, adding
              credibility to the student's skillset and enhancing their
              professional profile.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 shadow-lg text-center rounded-lg">
            <div>
              <Image
                src={Network}
                width={90}
                height={90}
                alt="Networking Opportunities"
                className="mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              Networking Opportunities
            </h3>
            <p className="text-gray-600 mt-2">
              Provide opportunities for students to connect with industry
              professionals, mentors, and fellow learners, fostering valuable
              collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;
