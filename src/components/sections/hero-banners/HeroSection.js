"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import ExploreIcon from "@/assets/images/icon/ExploreIcon";

const HeroSection = ({
  backgroundImage,
  leftContent,
  rightImage,
  stemImage,
}) => {
  return (
    <div className="relative w-full h-fit md:h-full lg:h-[530px] flex flex-col lg:flex-row">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Courses Background"
        fill
        sizes="100vw"
        priority
        className="absolute h-[530px] left-0 w-full z-0 object-cover"
      />

      {/* Fade Overlay */}
      <div className="absolute w-full inset-0 bg-black opacity-30 z-10" />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="text-white z-20 w-full lg:w-2/3 lg:my-auto lg:pl-10 xl:pl-30">
          {/* Left Side Content */}
          <div data-aos="fade-up" className="px-3 w-full">
            <span className="font-extrabold text-white">|</span>
            {leftContent.title}
            <div className="text-3xl sm:text-4xl text-white lg:text-5xl font-bold leading-12">
              {leftContent.subtitle}
            </div>
            <div className="flex flex-col md:flex-row mt-6 mb-9 gap-8">
              <div className="flex-shrink-0">
                {/* STEM Badge */}
                <Image
                  src={stemImage}
                  alt="STEM Accredited"
                  width={90}
                  height={150}
                />
              </div>
              <div className="flex flex-col justify-center w-full md:w-2/5">
                <p className="text-base sm:text-lg">
                  {leftContent.description}
                </p>
                <div className="flex  sm:flex-row gap-4 mt-4">
                  <Link
                    href={leftContent.cta.link}
                    className="bg-white text-[#7ECA9D] border border-[#7ECA9D] w-fit flex font-bold text-base px-4 py-2 gap-2"
                  >
                    <span>
                      <ExploreIcon />
                    </span>
                    {leftContent.cta.text}
                  </Link>
                  <span className="mt-2 text-base font-semibold underline underline-offset-8">
                    {leftContent.certification}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[#7ECA9D] text-2xl sm:text-3xl font-medium">
              {leftContent.motto}
            </span>
          </div>
        </div>

        {/* Right Side Image */}
        <div data-aos="fade-up" className="text-white z-20 lg:my-auto lg:pr-12">
          <Image
            src={rightImage.src}
            width={rightImage.width}
            height={rightImage.height}
            alt={rightImage.alt}
            className="max-w-full h-full mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
