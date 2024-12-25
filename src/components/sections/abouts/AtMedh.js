"use client";
import React from "react";
import Tick from "@/assets/images/icon/Tick";
import AboutRight from "@/assets/images/about/AboutRight.png";
import Image from "next/image";
import BulbIcon from "@/assets/images/icon/BulbIcon";
import Recycleicon from "@/assets/images/icon/Recycleicon";

const AtMedh = () => {
  return (
    <div
      data-aos="fade-up"
      className="px-4 md:px-10 lg:px-40 font-bold text-2xl md:text-3xl py-10 dark:bg-screen-dark dark:text-white text-[#5C6574]"
    >
      At <span className="text-[#7ECA9D]">Medh,</span> we
      <div className="font-bold text-xl md:text-3xl text-[#5C6574] mt-8 flex flex-col lg:flex-row justify-between gap-5">
        <div className="text-sm md:text-base dark:text-gray-300 text-[#727695] mb-20 w-full lg:w-3/4">
          <div className="flex gap-2 pb-4">
            <Tick />{" "}
            <p>
              are passionate about transforming education and empowering
              learners across the world.
            </p>
          </div>
          <div className="flex gap-2 pb-4">
            <Tick />{" "}
            <p>
              believe that learning should be a fun and engaging experience
              through a perfect amalgamation of technology and pedagogy.
            </p>
          </div>
          <div className="flex gap-2 pb-4">
            <Tick />{" "}
            <p>
              leverage cutting-edge technology and data-driven insights to
              design and deliver a wide range of educational solutions.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-end">
          <Image
            src={AboutRight}
            alt="about right"
            width={436}
            height={238}
            className="max-w-full h-auto"
          />
        </div>
      </div>
      {/* card */}
      <div className="flex flex-col lg:flex-row gap-8 w-full mt-36">
        <div
          className="max-sm:flex-col max-sm:items-center flex px-5 md:px-10 pt-6 md:pt-6 rounded-3xl w-full"
          style={{
            boxShadow: "0px 4px 24px 0px #0000001A",
          }}
        >
          <div className="max-sm:pb-4">
            <BulbIcon />
          </div>
          <div className="sm:pl-5 md:pl-10 pb-8 max-sm:flex max-sm:flex-col max-sm:items-center">
            <span className=" font-bold text-xl md:text-3xl dark:text-white text-[#252525]">
              MEDH – VISION
            </span>
            <p className="text-sm dark:text-gray-300 pt-3 sm:w-[90%] max-sm:text-center">
              Aspires to lead the EdTech industry by offering skill development
              solutions that empower individuals at every stage of life, from
              early childhood to career and homemaking readiness.
            </p>
          </div>
        </div>
        <div
          className="max-sm:flex-col max-sm:items-center flex px-5 md:px-10 pt-6 md:pt-6 rounded-3xl w-full"
          style={{
            boxShadow: "0px 4px 24px 0px #0000001A",
          }}
        >
          <div className="max-sm:pb-4">
            <Recycleicon />
          </div>
          <div className="sm:pl-5 md:pl-10 max-sm:flex max-sm:flex-col max-sm:items-center">
            <span className="font-bold text-xl md:text-3xl dark:text-white text-[#252525]">
              MEDH – MISSION
            </span>
            <p className="text-sm pt-3 w-[98%] dark:text-[#252525] pb-12 max-sm:text-center">
              Our mission is to empower individuals of all ages through
              innovative and personalized skill development courses, offering
              future-ready curriculum, interactive learning, AI-based
              technology, industry-aligned certifications, and community
              engagement. We prioritize excellence and innovation through
              collaborations with seasoned educators and subject matter experts
              from the relevant industry to foster personal and professional
              growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtMedh;
