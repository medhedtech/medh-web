"use client";
import Image from "next/image";
import React from "react";
import Operational1 from "@/assets/images/dynamic-team/b-1.svg";
import Operational2 from "@/assets/images/dynamic-team/b-2.svg";
import Operational3 from "@/assets/images/dynamic-team/b-3.svg";
import Operational4 from "@/assets/images/dynamic-team/b-4.svg";
import Operational5 from "@/assets/images/dynamic-team/b-5.svg";
import Operational6 from "@/assets/images/dynamic-team/b-6.svg";

const OperationalMember = () => {
  const teamMembers = [
    {
      name: "Niti Saxena",
      position: "Director",
      image: Operational1,
    },
    {
      name: "Neeraj Narain",
      position: "CEO & CTO",
      image: Operational2,
    },
    {
      name: "Jatin Wadhwa",
      position: "Director of Global Operations",
      image: Operational3,
    },
    {
      name: "Niti Saxena",
      position: "Director",
      image: Operational4,
    },
    {
      name: "Neeraj Narain",
      position: "CEO & CTO",
      image: Operational5,
    },
    {
      name: "Jatin Wadhwa",
      position: "Director of Global Operations",
      image: Operational6,
    },
  ];

  return (
    <div className="py-12 lg:w-[80%] lg:mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-bold text-primaryColor mb-10">Our Dynamic Team</h2>
      <div className="w-full flex flex-wrap justify-between">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center  w-full sm:w-[48%] lg:w-[32%] mb-8"
          >
            <div className="w-full h-[400px]  overflow-hidden mb-4">
              <Image
                src={member.image}
                alt={member.name}
                className="object-cover w-full h-full"
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

export default OperationalMember;
