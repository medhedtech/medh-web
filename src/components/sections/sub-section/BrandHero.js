import Image from "next/image";
import React from "react";
import brand1 from "@/assets/images/brand/brand_1.png";
import brand2 from "@/assets/images/brand/brand_2.png";
import brand3 from "@/assets/images/brand/brand_3.png";
import brand4 from "@/assets/images/brand/brand_4.png";
import brand5 from "@/assets/images/brand/brand_5.png";
import bgImg from "@/assets/images/herobanner/bg-img.jpeg";
import bgImg1 from "@/assets/images/herobanner/bg1-img.jpeg";
const BrandHero = () => {
  return (
    <div>
      <div data-aos="fade-up " className="dark:bg-screen-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-10 gap-2 lg:gap-0">
          {/* Left Section */}
          <div className="bg-[#F6B335] text-white flex flex-col p-6 lg:p-10">
            <h1 className="font-bold text-xl lg:text-2xl pt-2">
              50+ Medh Upskill Courses
            </h1>
            <span className="mt-4">
              In high-demand domains like AI, Cybersecurity Career Development,
              Data Analytics, etc.
            </span>
            <a href="#" className="underline mt-4">
              View Courses +
            </a>
          </div>

          {/* Center Section with Background Image */}
          <div className="relative flex flex-col p-6 lg:p-10 text-white bg-cover bg-center">
            <Image
              src={bgImg}
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
            />
            <div className="relative z-10 flex flex-col gap-4 lg:gap-6 bg-opacity-70">
              <h1 className="font-bold text-xl lg:text-2xl pt-2">
                Earn a Course Certificate
              </h1>
              <span>
                Nurture skills and elevate your career with industry-recognized
                certifications upon completion.
              </span>
              <a href="#" className="underline">
                View More +
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-[#7ECA9D] text-white flex flex-col p-6 lg:p-10">
            <h1 className="font-bold text-xl lg:text-2xl pt-2">
              Earn a Course Certificate
            </h1>
            <span className="mt-4">
              Nurture skills and elevate your career with industry-recognized
              certifications upon completion.
            </span>
            <a href="#" className="underline mt-4">
              View More +
            </a>
          </div>

          {/* Another Section with Background Image */}
          <div className="relative flex flex-col p-6 lg:p-10 text-white bg-cover bg-center">
            <Image
              src={bgImg1}
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
            />
            <div className="relative z-10 flex flex-col gap-4 lg:gap-6 bg-opacity-70">
              <h1 className="font-bold text-xl lg:text-2xl pt-2">
                Earn a Course Certificate
              </h1>
              <span>
                Nurture skills and elevate your career with industry-recognized
                certifications upon completion.
              </span>
              <a href="#" className="underline">
                View More +
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Below */}
      <section data-aos="fade-up">
        <div className="flex flex-col items-center text-center font-Ubuntu bg-[#FFF0F7] dark:bg-[#09041d] py-8 px-4">
          <h1 className="font-Open font-bold text-[#5C6574] text-[20px] lg:text-[26px] leading-8 mt-8 lg:w-[674px] dark:text-white">
            Welcome to <span className="text-[#7ECA9D]">Medh</span> | Pioneering
            Skill Development for every stage of life.
          </h1>
          <div className="mt-4 text-base lg:text-lg font-Open font-medium lg:w-[820px] text-[#5C6574] dark:text-gray-300">
          MEDH, the leading global EdTech innovator, is dedicated to
            delivering skill development courses through cutting-edge technology
            and bespoke mentorship. To empower individuals at every stage of
            life, from early childhood and adolescence (preschool, school,
            college) to working professionals and homemakers, with the knowledge
            and capabilities to excel in today&#39;s dynamic world.
          </div>
          <span className="font-Open font-bold text-[#5C6574] text-sm lg:text-base pb-8 mt-4 dark:text-white">
            We nurture growth, foster expertise, and ignite potential for
            learners of every background.
          </span>
        </div>
      </section>
    </div>
  );
};

export default BrandHero;
