"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React from "react";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import family from "@/assets/Header-Images/Home/cheerful-arab.jpg";
import bgImage from "@/assets/Header-Images/Home/Home_Banner_2_e7389bb905.jpg";
import "@/assets/css/ovalAnimation.css";

const Hero1 = () => {
  return (
    <section
      data-aos="fade-up"
      className="relative bg-black bg-opacity-50 dark:bg-screen-dark"
    >
      {/* Background Image */}
      <div className="absolute hidden lg:block inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Banner section */}
      <div className="container2-xl hidden lg:block sm:px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-aos="fade-up" className="flex flex-col justify-center">
            {/* Hero Section Name */}
            <HreoName>
              <div className="flex items-center">
                <span className="font-black text-[#7ECA9D] text-lg sm:text-xl">
                  |
                </span>
                <p className="dark:text-white text-white px-2 text-sm sm:text-base">
                  UNLOCK YOUR POTENTIAL WITH MEDH
                </p>
              </div>
            </HreoName>

            {/* Heading */}
            <HeadingLg
              color={"#7ECA9D"}
              className="text-2xl sm:text-4xl lg:text-[40px] font-bold leading-tight mt-4"
            >
              Skill Development Courses led by Seasoned Experts
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
                <p className="text-lg font-Poppins font-light sm:text-xl text-white dark:text-gray-200 leading-relaxed">
                  Empowering people across all life stages: <br />
                  from childhood and teens to <br />
                  professionals and homemakers.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <a
                    href="#courses-section"
                    className="bg-[#7ECA9D] text-white border border-[#7ECA9D] font-bold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                  >
                    Let&#39;s Connect
                  </a>
                  <a
                    href="#certified-section"
                    className="mt-4 text-white text-sm sm:text-base font-light underline underline-offset-4 transition duration-300"
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

          {/* Banner Right */}
          <div className="lg:flex hidden relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[500px] h-[300px]">
                <div className="wavy-oval overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={family}
                      alt="Family Image"
                      className="w-[540px] h-[400px] object-contain object-center relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image for Mobile */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Mobile View (Hidden on Desktop) */}
      <div className="lg:hidden bg-black text-white px-6 py-4 space-y-1">
        {/* Subheading */}
        <p className="text-[#FFFFFF] font-semibold text-center border-l-2 border-[#7eca9d] uppercase text-[0.8rem] tracking-wider">
          UNLOCK YOUR POTENTIAL WITH MEDH
        </p>

        {/* Heading */}
        <h1
          className="text-[#A1F1B5] text-[1.5rem] font-bold text-center leading-snug mt-[-8px]"
          style={{ color: "#7ECA9D" }}
        >
          Skill Development Courses led by Seasoned Experts
        </h1>

        {/* Oval Image */}
        <div className="w-full flex justify-center mt-6">
          <div className="relative w-[300px] h-[210px]">
            <div className="wavy-oval overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={family}
                  alt="Family Image"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ISO Certification Section */}
        <div className="flex mt-6">
          <div className="flex sm:flex-col items-start">
            <div className="w-[14rem] h-[100px] mr-4">
              <Image
                src={stemImg}
                alt="ISO Certification"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Description Section */}
            <div className="flex-col">
              <p
                className="text-[.88rem] text-left font-Poppins leading-normal"
                style={{ color: "#EAEAEA" }}
              >
                Empowering people across all life stages: from childhood and
                teens to professionals and homemakers.
              </p>

              {/* ISO Text */}
              <a
                href="#courses-section"
                className="inline text-[0.9rem] text-left border-b-2 border-[#7eca9d] mt-4"
                style={{ color: "#EAEAEA" }}
              >
                ISO CERTIFIED
              </a>

              {/* Button Section */}
              <div className="flex justify-start mt-2">
                <a
                  href="#courses-section"
                  className="bg-[#7ECA9D] text-white font-bold text-sm sm:text-base px-4 py-2 hover:bg-[#66b588] transition duration-300"
                >
                  Let&#39;s Connect
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slogan */}
        <p
          className="text-[#7ECA9D] w-full text-[2.4rem] font-Bulgathi font-normal text-center mt-[5px]"
          style={{ color: "#7ECA9D" }}
        >
          Medh Hain Toh Mumkin Hain!
        </p>
      </div>
    </section>
  );
};

export default Hero1;
