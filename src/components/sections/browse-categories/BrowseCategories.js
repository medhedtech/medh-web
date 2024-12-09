"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import personalityIcon from "@/assets/images/courses/Personal.png";
import aiIcon from "@/assets/images/courses/ai.png";
import vedicIcon from "@/assets/images/courses/Maths.png";
import NetworkingIcon from "@/assets/images/icon/NetworkingIcon";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import RelevantIcon from "@/assets/images/icon/RelevantIcon";
import RecognizedIcon from "@/assets/images/icon/RecognizedIcon";
import { useRouter } from "next/navigation";

const BrowseCategories = () => {
  const router = useRouter();
  return (
    <div className="py-12 px-4 md:px-8 dark:bg-screen-dark lg:px-32">
      {/* Browse Trending Categories Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="md:px-6 mb-4 md:mb-0">
          <h3 className="text-[#7ECA9D] font-semibold uppercase tracking-wider text-xl text-center md:text-left">
            Course Categories
          </h3>
          <h1 className="text-gray-800 dark:text-white font-bold text-2xl md:text-3xl text-center md:text-left mt-2">
            Browse Trending Categories
          </h1>
        </div>
        <div className="md:px-6">
          <button
            onClick={() => {
              router.push("/skill-development-courses");
            }}
            className="bg-[#7ECA9D] rounded-[2px] text-white px-4 py-2  font-semibold flex gap-3 w-full md:w-auto"
          >
            <span>
              <ArrowIcon />
            </span>
            View All
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
        <Link href="/personality-development-course">
          {/* Category Card 1 */}
          <div className="bg-[#7ECA9D] dark:bg-screen-gray-100 dark:border-whitegrey border  flex flex-col justify-between shadow-md">
            <Image
              src={personalityIcon}
              width={200}
              height={200}
              alt="Personality Development"
              className="mx-auto"
            />
            <h3 className="text-xl font-bold mt-4 py-4 text-center bg-[#F6B335] text-black-200 border-t border-black">
              Personality Development
            </h3>
          </div>
        </Link>

        {/* Category Card 2 */}
        <Link href="/ai-and-data-science-course">
          <div className="bg-[#7ECA9D] dark:bg-screen-gray-100 dark:border-whitegrey border  flex flex-col justify-between   shadow-md">
            <Image
              src={aiIcon}
              width={200}
              height={200}
              alt="AI and Data Science"
              className="mx-auto"
            />
            <h3 className="text-xl font-bold mt-4 py-4 text-center bg-[#F6B335] text-black-200 border-t border-black">
              AI and Data Science
            </h3>
          </div>
        </Link>

        {/* Category Card 3 */}
        <Link href="/vedic-mathematics-course">
          <div className="bg-[#7ECA9D] dark:bg-screen-gray-100 dark:border-whitegrey border  flex flex-col justify-between  shadow-md">
            <Image
              src={vedicIcon}
              width={200}
              height={200}
              alt="Vedic Mathematics"
              className="mx-auto"
            />
            <h3 className="text-xl font-bold mt-4 py-4 text-center bg-[#F6B335] text-black-200 border-t border-black">
              Vedic Mathematics
            </h3>
          </div>
        </Link>
      </div>

      {/* Immersive Learning Section */}
      <div className="mt-16">
        <h3 className="text-center text-blue-500 text-sm font-semibold tracking-wide uppercase mb-2 dark:text-white">
          Make Connections
        </h3>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-200">
          Immersive Learning: Your Tailored Pathway to Excellence.
        </h2>
        <p className="text-center text-gray-600 mt-4 px-4 md:px-16 lg:px-32 dark:text-gray-300">
          Offers engaging, interactive experiences, fostering deep
          understanding, critical thinking,
          <br className="hidden md:inline" /> and skill development in diverse
          educational settings.
        </p>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <div className="bg-white p-6 dark:bg-screen-dark dark:border-whitegrey border shadow-lg text-center rounded-lg transition-all duration-300 hover:bg-[#7ECA9D] hover:text-white hover:shadow-xl relative overflow-hidden">
            <div className="flex justify-center">
              <RelevantIcon stroke="#7ECA9D" fill="#7ECA9D" />
            </div>
            <h3 className="text-xl font-bold dark:text-gray300 mt-4">Industry-Relevant Skills</h3>
            <p className="text-gray-600 mt-2 dark:text-gray300 hover:text-white">
              Designed in collaboration with industry experts, ensuring that
              students acquire practical, up-to-date skills for their desired
              career paths.
            </p>

            {/* Animated Background Effect */}
            <div className="absolute inset-0 bg-[#7ECA9D] transform -translate-y-full transition-all duration-300 group-hover:translate-y-0 z-0"></div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 shadow-lg dark:bg-screen-dark dark:border-whitegrey border text-center rounded-lg transition-all duration-300 hover:bg-[#7ECA9D] hover:text-white hover:shadow-xl relative overflow-hidden">
            <div className="flex justify-center">
              <RecognizedIcon stroke="#7ECA9D" fill="#7ECA9D" />
            </div>
            <h3 className="text-xl dark:text-gray300 font-bold mt-4">
              Industry-Recognized Certifications
            </h3>
            <p className="text-gray-600 mt-2 dark:text-gray300 hover:text-white">
              Offer industry-recognized certifications upon completion, adding
              credibility to the student&#39;s skillset and enhancing their
              professional profile.
            </p>

            {/* Animated Background Effect */}
            <div className="absolute inset-0 bg-[#7ECA9D] transform -translate-y-full transition-all duration-300 group-hover:translate-y-0 z-0"></div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-screen-dark dark:border-whitegrey border p-6 shadow-lg text-center rounded-lg transition-all duration-300 hover:bg-[#7ECA9D] hover:text-white hover:shadow-xl relative overflow-hidden">
            <div className="flex justify-center">
              <NetworkingIcon stroke="#F6B335" fill="#F6B335" />
            </div>
            <h3 className="text-xl dark:text-gray300 font-bold mt-4">Networking Opportunities</h3>
            <p className="text-gray-600 mt-2 dark:text-gray300 hover:text-white">
              Provide opportunities for students to connect with industry
              professionals, mentors, and fellow learners, fostering valuable
              collaboration.
            </p>

            {/* Animated Background Effect */}
            <div className="absolute inset-0 bg-[#7ECA9D] transform -translate-y-full transition-all duration-300 group-hover:translate-y-0 z-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;
