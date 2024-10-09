import React from "react";
import Image from "next/image";
import Banner from "@/assets/images/personality/banner.png"; // Ensure this path is correct
import DevelopmentImg from "@/assets/images/personality/development-cource.svg";
import Iso from "@/assets/images/personality/iso-icon.svg";
import Enroll from "@/assets/images/personality/enroll-icon.svg";

function PersonalityBanner() {
  return (
    <div className="bg-black h-full text-white w-full relative flex justify-center border-2 border-black py-10 md:py-0">
      {/* Banner Image (hidden on small screens) */}
      <div className="relative w-full h-[350px] md:h-[500px] hidden md:block">
        <Image
          src={Banner}
          alt="Personality Development Course"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Content Container (remove absolute positioning on small screens) */}
      <div className="w-[90%] h-full flex items-center justify-between bg-black md:bg-transparent md:absolute md:top-0 md:bottom-0">
        <div className="w-full md:w-[48%]  ml-0 md:ml-12">
          <p className="border-l-4 md:text-[15px] text-[12px] border-primaryColor font-bold mb-4 md:pl-2 pl-0">
            UNLOCK CONFIDENCE, CHARISMA, AND SUCCESS.
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mb-6">
            Comprehensive Personality Development Course
          </h1>

          <div className="flex justify-between w-full ">
            <div className="md:w-[20%] w-[25%]">
              <div className="w-full h-[160px] relative ">
                {/* Set a fixed height here */}
                <Image
                  src={Iso}
                  alt="ISO Icon"
                  layout="fill" // Make the image fill the container
                  objectFit="contain"
                  className="w-full h-full " // Ensure the image scales properly
                />
              </div>
            </div>
            <div className="md:w-[75%] w-[70%]">
              <p className="md:text-[1.1rem] text-[0.7rem] tracking-wider mt-10~">
                Uncover Your Untapped Potential.
                <br /> For all ages, from Students to Professionals and
                Homemakers. Unleash Your Best Self.
              </p>
              <div className="flex">
                <button className="flex items-center bg-white md:text-[15px] text-[10px] text-primaryColor font-bold px-2 py-1 md:px-4 md:py-2 mt-6 ">
                  <Image
                    src={Enroll}
                    alt="Enroll Icon"
                    className="md:w-[28px] w-[18px] md:h-[28px] h-[20px] md:mr-4 mr-2"
                  />
                  Enroll now
                </button>
                <p className="border-b-2 border-primaryColor mt-10 ml-3 text-[10px] md:text-[15px]">
                  VIEW OPTIONS
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[20px] md:text-[29px] font-semibold text-[#F2277E]">
            Medh Hain Toh Mumkin Hain!
          </p>
        </div>

        {/* Right side image (hidden on small screens) */}
        <div className="hidden md:block md:w-[48%]">
          <Image
            src={DevelopmentImg}
            alt="Personality Development Image"
            objectFit="cover"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalityBanner;
