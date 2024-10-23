import React from "react";
import Image from "next/image";
// import Arrow from "@/assets/images/join-educator/arrow1.png";
import Logo1 from "@/assets/images/career/logo-3.svg";
import Logo2 from "@/assets/images/career/logo-4.svg";
import Logo3 from "@/assets/images/career/logo-5.svg";
import Logo4 from "@/assets/images/career/logo-6.svg";
import Logo5 from "@/assets/images/career/logo-7.svg";
import WelcomeCareers from "./welcomeCareers";


const advantagesData = [
  {
    id:1,
    icon: Logo1,
    title: "Competitive Compensation",
    description:
      "We offer competitive remuneration packages and benefits to attract and retain top talent.",
  },
  {
    id:2,
    icon: Logo2,
    title: "Professional Development",
    description:
      "Access to professional development programs, training sessions, and career growth opportunities.",
  },
  {
    id:3,
    icon: Logo3,
    title: "Collaborative Work Culture",
    description:
      "A supportive and inclusive work environment where teamwork and collaboration are encouraged.",
  },
  
   
];

// Earning Potential Data
const advantagesPotentialData = [
  {
    id:1,
    icon: Logo4,
    title: "Flexible Work Arrangements",
    description:
      "Options for remote work, work-from-home, flexible hours, and a healthy work-life balance.",
  },
  {
    id:2,
    icon: Logo5,
    title: "Health and Wellness",
    description:
      "Comprehensive health and wellness programs to support your physical and mental well-being.",
  },
];

const UniqueBenefits = () => {
  return (
    <section className="py-14 w-full bg-white flex justify-center items-center">
      <div className="w-[92%] lg:w-[80%]">
        <WelcomeCareers />
        {/* Benefits Section */}
        <div className="text-center px-3 lg:px-50 ">
          <h2 className="text-[#252525] text-3xl text-center font-bold pt-9">Unique Benefits and Perks</h2>
        </div>

        {/* Render the General Benefits */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-y-8 gap-y-5 ">
          {advantagesData.map((advantages, index) => (
            <div
              key={index}
              className=" px-2 pb-3 pt-1 text-center bg-white rounded-3xl border border-[#0000004D] shadow-card-custom w-full transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 "
            >
              <Image src={advantages.icon} alt="img" className="mx-auto h-16 mb-2" />
              <h3 className="text-[15px] leading-7 font-bold text-[#252525]  font-Open">
                {advantages.title}
              </h3>
              <p className="text-[#252525] text-[15px] leading-7 font-normal font-Open ">
                {advantages.description}
              </p>
            </div>
          ))}
        </div>

        {/* Earning Potential Section */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {advantagesPotentialData.map((item, index) => (
              <div
                key={index}
                className="w-full px-2 py-3 text-center  bg-white shadow-card-custom rounded-3xl border border-[#0000004D] flex flex-col transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                
              >
                <Image src={item.icon} alt="img" className="mx-auto h-16 mb-2" />
                <h3 className="text-[15px] leading-7 font-bold text-[#252525] font-Open">
                  {item.title}
                </h3>
                <p className="text-[#252525] text-[15px] leading-7 font-normal font-Open flex-grow">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueBenefits;