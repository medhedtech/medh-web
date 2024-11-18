"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/images/herobanner/medh-home-banner.jpg";
const Hero1 = () => {
  return (
    <section data-aos="fade-up " className="dark:bg-screen-dark ">
      {/* Banner section */}
      <div className="container2-xl   sm:px-4 lg:px-6 py-5 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Left */}
          <div data-aos="fade-up">
            <HreoName>
              <div className="flex ">
                <span className="font-black text-[#7ECA9D]">|</span>
                <p className="dark:text-white px-1">
                  UNLOCK YOUR POTENTIAL WITH MEDH
                </p>
              </div>
            </HreoName>
            <HeadingLg
              color={"#7ECA9D"}
              className="text-2xl sm:text-4xl lg:text-[40px] font-bold leading-tight"
            >
              Skill Development Courses led by Seasoned Experts
            </HeadingLg>
            <div className="flex  md:flex-row mt-6 mb-9 sm:gap-8">
              <div className="flex-shrink-0">
                {/* STEM Badge */}
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                />
              </div>
              <div className="flex flex-col justify-center pl-3 sm:pl-0 lg:mt-4 xl:pt-1 dark:text-gray-200">
                <p className="text-base sm:text-lg">
                  Empowering people across all life stages from childhood and
                  teens to professionals and homemakers.
                </p>

                {/* CTA Button */}
                <div className="flex  sm:flex-row gap-4 sm:mt-6 mt-2">
                  <a
                    href="#courses-section"
                    className="bg-[#7ECA9D] text-white border border-[#7ECA9D] w-fit font-bold sm:text-base text-[12px] sm:px-4 px-2 sm:py-2 py-1 inline-block"
                  >
                    Let&#39;s Connect
                  </a>
                  <a
                    href="#certified-section"
                    className="mt-[6px] sm:text-base text-[12px] font-semibold underline underline-offset-8"
                  >
                    ISO CERTIFIED
                  </a>
                </div>
              </div>
            </div>
            <span className="text-[#7ECA9D] text-2xl sm:text-3xl mumkinMedh font-medium">
              Medh Hain Toh Mumkin Hain!
            </span>
          </div>
          {/* Banner Right */}
          <div className="lg:flex hidden justify-end ">
            <Image
              src={Group}
              width={453}
              height={457}
              alt="Group Image"
              className="max-w-full h-auto lg:rounded-[10%] contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
