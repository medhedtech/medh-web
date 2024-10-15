import React from "react";
import Image from "next/image";
import Banner from "@/assets/images/corporate-training/banner.png";
import Cource from "@/assets/images/corporate-training/banner-logo.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/corporate-training/lets-connect.svg";

export default function CorporateBanner () {
   

  return (
    <div className="bg-black h-full text-white w-full relative flex justify-center border-2 border-black py-10 md:py-0">
      {/* Banner Image (hidden on small screens) */}
      <div className="relative w-full h-[350px] md:h-[500px] hidden lg:block">
        <Image
          src={Banner}
          alt="Personality Development Course"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      <div className="w-[90%] h-full flex items-center justify-between bg-black lg:bg-transparent lg:absolute lg:top-0 lg:bottom-0">
        <div className="w-full lg:w-[45%]  ml-0 md:ml-12">
          <p className="border-l-4 md:text-[15px] text-[12px] border-primaryColor font-bold mb-4 md:pl-2 pl-0">
          EMPOWER YOUR WORKFORCE TO EXCEL.
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mb-6">
          Medh’s Dynamic Corporate Training Courses.
          </h1>

          <div className="flex justify-between w-full  ">
            <div className="flex-shrink-0 bg-gray-300 ">
              {/* STEM Badge */}
              <Image
                src={Iso}
                alt="STEM Accredited"
                width={100}
                height={100} 
                className="object-contain" 

              />
            </div>
            <div className=" ml-10">
              <p className="md:text-[1.1rem] text-[0.8rem] tracking-wider mt-10~">
              Elevate their skills, motivation, and engagement to drive business growth and achieve exceptional results.
              </p>
              <div className="flex">
                <button className="flex items-center bg-white md:text-[15px] text-[10px] text-[#0000FF] font-bold px-2 py-1 md:px-4 md:py-2 mt-6 ">
                  <Image
                    src={LetsConnect}
                    alt="Enroll Icon"
                    className="md:w-[28px] w-[18px] lg:h-[28px] h-[20px] lg:mr-4 mr-2"
                  />
                  Let’s Connect
                </button>
                <p className="border-b-2 border-gray-500 mt-10 ml-3 text-[10px] lg:text-[15px]">
                ISO CERTIFIED
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[20px] lg:text-[29px] font-semibold text-[#F2277E]">
            Medh Hain Toh Mumkin Hain!
          </p>
        </div>

        {/* Right side image (hidden on small screens) */}
        <div className="hidden lg:block md:w-[45%]">
          <Image
            src={Cource}
            alt="Personality Development Image"
            objectFit="cover"
            className="w-full"
          />
        </div>
      </div>
    
    </div>
  );
}




