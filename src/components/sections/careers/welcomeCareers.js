import React from "react";
import Image from "next/image";
import Logo1 from "@/assets/images/career/logo-1.svg";
import Logo2 from "@/assets/images/career/logo-2.svg";




// Earning Potential Data
const advantagesPotentialData = [
  { 
    id:1,
    icon: Logo1,
    description:
      "We believe in fostering a rewarding and fulfilling work environment that nurtures professional growth and job satisfaction. Our team is our greatest asset, and we are dedicated to creating a culture of collaboration, inclusivity, and excellence.",
  },
  {
    id:2,
    icon: Logo2,
    description:
      "We offer a diverse range of career opportunities that cater to various skill sets and professional backgrounds. Whether you are a seasoned professional or just starting your career, we have a role for you. Join us and be a part of a dynamic team.",
  },
];

const WelcomeCareers = () => {
  return (
    <section className=" w-full bg-white flex justify-center flex-col items-center">
          <h2 className="text-[#252525] lg:text-2xl text-lg font-Poppins text-center font-bold">Welcome to MEDH, where we are redefining the future of education through innovation and technology. As a leading EdTech company, we are committed to providing cutting-edge skill development
          courses that empower learners of all ages.</h2>
      {/* <div className="w-[92%] lg:w-[80%] border-2 border-black"> */}

        {/* Earning Potential Section */}
        <div className="w-full lg:mt-16 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {advantagesPotentialData.map((item, index) => (
              <div
                key={index}
                className="w-full px-2 py-3 text-center  bg-white shadow-card-custom rounded-3xl border border-[#0000004D] flex flex-col transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                
              >
                <Image src={item.icon} alt="img" className="mx-auto h-16 mb-2" />
                <p className="text-[#252525] text-[15px] leading-7 font-normal font-Open flex-grow">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};

export default WelcomeCareers;