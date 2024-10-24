"use client";
import HeadingLg from "@/components/shared/headings/HeadingLg";
import PagragraphHero from "@/components/shared/paragraphs/PagragraphHero";
import HreoName from "@/components/shared/section-names/HreoName";
import Image from "next/image";
import React, { useEffect } from "react";
import about1 from "@/assets/images/about/about_1.png";
import about8 from "@/assets/images/about/about_8.png";
import herobanner2 from "@/assets/images/register/register__2.png";
import herobanner6 from "@/assets/images/herobanner/herobanner__6.png";
import herobanner7 from "@/assets/images/herobanner/herobanner__7.png";
import Link from "next/link";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import stemImg from "@/assets/images/herobanner/Background.png";
import Group from "@/assets/images/herobanner/Group5.png";
const Hero1 = () => {
  return (
    <section data-aos="fade-up ">
      {/* Banner section */}
      <div className="container2-xl px-4 sm:px-6 lg:px-8 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Left */}
          <div data-aos="fade-up">
            <HreoName >
            <div className="flex " >
              <span className="font-black text-[#5F2DED]">|</span>
              <p className="dark:text-white px-1">UNLOCK YOUR POTENTIAL WITH MEDH</p>
              </div>
            </HreoName>
            <HeadingLg
              color={"#5F2DED"}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            >
              Skill Development Courses led by <br />
              Seasoned Experts
            </HeadingLg>
            <div className="flex flex-col md:flex-row mt-6 mb-9 gap-8">
              <div className="flex-shrink-0">
                {/* STEM Badge */}
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                />
              </div>
              <div className="flex flex-col justify-center lg:mt-4 dark:text-gray-200">
                <p className="text-base sm:text-lg">
                  Empowering people across all life stages from childhood and
                  teens to professionals and homemakers.
                </p>
                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link
                    href="/courses"
                    className="bg-[#5F2DED] text-white border border-[#5F2DED] w-fit font-bold text-base px-4 py-2 inline-block"
                  >
                    Let's Connect
                  </Link>
                  <span className="mt-2 text-base font-semibold underline underline-offset-8">
                    ISO CERTIFIED
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[#FD474F] text-2xl sm:text-3xl font-medium">
              Medh Hain Toh Mumkin Hain!
            </span>
          </div>
          {/* Banner Right */}
          <div data-aos="fade-up" className="lg:flex hidden justify-end ">
            <Image
              src={Group}
              width={453}
              height={457}
              alt="Group Image"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
