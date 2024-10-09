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

const Hero1 = () => {
  return (
    <section data-aos="fade-up">
      {/* banner section  */}
      <div className="container2-xl ">
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* banner Left  */}
          <div data-aos="fade-up">
            <HreoName>UNLOCK YOUR POTENTIAL WITH MEDH</HreoName>
            <HeadingLg
              color={"#5F2DED"}
              className="text-5xl font-bold leading-tight"
            >
              Skill Development Courses led by <br />
              Seasoned Experts
            </HeadingLg>
            <div className="flex mt-6 mb-9 gap-8">
              <div>
                {/* STEM Badge */}
                <Image
                  src={stemImg}
                  alt="STEM Accredited"
                  width={110}
                  height={150}
                />
              </div>
              <div className=" flex flex-col justify-center">
                <p className="text-lg">
                  Empowering people across all life stages from childhood and
                  teens to professionals and homemakers.
                </p>
                {/* CTA Button */}
                <div className="flex gap-4">
                  <Link
                    href="/courses"
                    className="bg-[#5F2DED] text-white border border-[#5F2DED] font-bold text-base px-4 py-2 mt-4 inline-block"
                  >
                    Let's Connect
                  </Link>
                  <span className="mt-2 text-base font-semibold pt-4 underline underline-offset-8">
                    ISO CERTIFIED
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[#FD474F] text-3xl font-medium ">
              Medh Hain Toh Mumkin Hain !
            </span>
          </div>
          {/* banner right  */}
          <div data-aos="fade-up">
            {/* <TiltWrapper>
              <div className="tilt relative">
                <Image
                  placeholder="blur"
                  className="w-full"
                  src={about8}
                  alt=""
                />
                <Image
                  className="absolute left-0 top-0 lg:top-4 right-0 mx-auto"
                  src={about1}
                  alt=""
                />
              </div>
            </TiltWrapper> */}
          </div>
        </div>

        {/* <div>
          <Image
            className="absolute left-1/2 bottom-[15%] animate-spin-slow"
            src={herobanner2}
            alt=""
          />
          <Image
            className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
            src={herobanner6}
            alt=""
          />
          <Image
            className="absolute right-[5%] bottom-[15%]"
            src={herobanner7}
            alt=""
          />
          <Image
            className="absolute top-[5%] left-[45%]"
            src={herobanner7}
            alt=""
          />
        </div> */}
      </div>
    </section>
  );
};

export default Hero1;
