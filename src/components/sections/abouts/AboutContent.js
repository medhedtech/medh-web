"use client";
import React from "react";
import DownArrowIcon from "@/assets/images/icon/DownArrowIcon";
import Bell from "@/assets/images/about/bell.png";
import Image from "next/image";

const AboutContent = () => {
  return (
    <div data-aos="fade-up" className="flex flex-col dark:bg-screen-dark">
      <div className="text-center mx-auto pt-10  pb-5">
        <div className="font-bold text-3xl py-4 dark:text-white">
          Medh | Pioneering Skill Development for every stage of life.
        </div>
        <p className="text-[#5C6574] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl dark:text-gray-300 px-4 sm:px-6 md:px-8 mx-auto w-full max-w-4xl">
          MEDH, the leading global EdTech innovator, is dedicated to delivering
          skill development courses through cutting-edge technology and bespoke
          mentorship. To empower individuals at every stage of life, from early
          childhood and adolescence (preschool, school, college) to working
          professionals and homemakers, with the knowledge and capabilities to
          excel in today&#39;s dynamic world.
        </p>
      </div>
      <span className=" text-[#5C6574] dark:text-gray-200 font-bold leading-34px text-size-17 text-center">
        We nurture growth, foster expertise, and ignite potential for learners
        of every background.
      </span>
      <div className="bg-[#4EB67870] md:flex-row  flex flex-col xl:mx-40 rounded-3xl mt-16 p-4 mx-4">
        <div className="my-auto  w-full h-[70px] flex justify-center">
          <Image src={Bell} alt="bell icon" width={70} height={70} />
        </div>

        <div className="px-11">
          <h2 className="text-[#5C6574] text-left font-bold text-2xl pt-6">
            Medh - Unique Point of Difference (UPD)
          </h2>
          <p className="text-[#727695] text-base text-left pt-4.5 pb-8">
            Our commitment to providing a seamless gamut of skill development
            courses, creating tailored learning pathways that accommodate every
            phase of a child&#39;s developmental journey, from early childhood
            to professional readiness. This holistic approach ensures that
            individuals are fully equipped for success at every stage of life.
          </p>
        </div>
        <div className="my-auto mx-12">
          <div className="bg-[#F6B335] flex items-center px-4 py-3">
            <span className="mr-2">
              <DownArrowIcon />
            </span>
            <p className="text-white font-bold text-sm w-22">Why Medh?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
