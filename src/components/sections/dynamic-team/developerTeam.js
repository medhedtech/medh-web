



"use client";
import Image from "next/image";
import React from "react";
import Member1 from "@/assets/images/dynamic-team/d-1.svg";
import Member2 from "@/assets/images/dynamic-team/d-2.svg";
import Member3 from "@/assets/images/dynamic-team/d-3.svg";
import Member4 from "@/assets/images/dynamic-team/d-4.svg";



const DeveloperTeam = () => {
  const members = [
    {
      name: "Vikash Gupta",
      position: "Web Developer",
      image: Member1,
    },
    {
      name: "Nitanshu Saini",
      position: "Graphic Designer",
      image: Member2,
    },
    {
      name: "Esha Bharti",
      position: "Creative Designer",
      image: Member3,
    },
    {
      name: "Harsh Patel",
      position: "IT Admin",
      image: Member4,
    },
  ];

  return (
    <div className=" lg:w-[80%] lg:mx-auto flex flex-col items-center">
      <div className="w-full flex flex-wrap justify-between">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center  w-full sm:w-[48%] lg:w-[23.5%] "
          >
            <div className="w-full h-[350px] overflow-hidden mb-4">
              <Image
                src={member.image}
                alt={member.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <p className="text-[18px]  leading-6 text-[#192129] text-center px-2">{member.position}</p>
            <h3 className="text-[22px] leading-8 font-bold text-[#192129] pt-1">{member.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTeam;
