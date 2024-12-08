"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React from "react";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/images/placement/medh-placement-courses.jpg";
import bgImage from "@/assets/images/herobanner/medh-hero-banner.png";

const PlacementGauranteedBanner = () => {
  return (
    <section
      data-aos="fade-up"
      className="relative bg-black bg-opacity-50 dark:bg-screen-dark"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Banner section */}
      <div className="container2-xl sm:px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-aos="fade-up" className="flex flex-col justify-center">
            {/* Hero Section Name */}
            <HreoName>
              <div className="flex items-center">
                <span className="font-black text-[#7ECA9D] text-lg sm:text-xl">
                  |
                </span>
                <p className="dark:text-white text-white px-2 text-sm sm:text-base">
                  YOUR CAREER PATHWAY STARTS HERE.
                </p>
              </div>
            </HreoName>

            {/* Heading */}
            <HeadingLg
              color={"#7ECA9D"}
              className="text-2xl sm:text-4xl lg:text-[40px] font-bold leading-tight mt-4"
            >
              Welcome to Medh&#39;s Job Guaranteed Courses
            </HeadingLg>

            {/* Content & CTA */}
            <div className="flex flex-col sm:flex-row items-start mt-6 gap-6">
              {/* STEM Badge */}
              <div className="flex-shrink-0">
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                  className="h-auto"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center sm:pl-4">
                <p className="text-base sm:text-lg text-white dark:text-gray-200 leading-relaxed">
                  Transition from Learning to Earning - <br />
                  Guaranteed! Invest in Yourself and <br />
                  Secure Your Dream Job Today.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <a
                    href="#explore"
                    className="bg-[#7ECA9D] text-white border border-[#7ECA9D] font-semibold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                  >
                    Explore More
                  </a>
                  <a
                    href="#certified-section"
                    className="mt-4 text-white text-sm sm:text-base font-normal underline underline-offset-4 transition duration-300"
                  >
                    ISO CERTIFIED
                  </a>
                </div>
              </div>
            </div>

            {/* Slogan */}
            <span className="text-[#7ECA9D] text-2xl sm:text-3xl mumkinMedh font-medium mt-8 block">
              Medh Hain Toh Mumkin Hain!
            </span>
          </div>

          <div className="relative w-full h-full rounded-[50%] flex items-center justify-center overflow-hidden">
            {/* Moving Image */}
            <Image
              src={Group}
              width={200}
              height={200}
              alt="Group Image"
              className="absolute z-10 w-full h-[100%] rounded-[50%] object-contain"
              style={{
                animation: "floating 7s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementGauranteedBanner;
