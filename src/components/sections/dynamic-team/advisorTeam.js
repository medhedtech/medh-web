"use client";
import Image from "next/image";
import React from "react";
import Member1 from "@/assets/images/dynamic-team/a-1.svg";
import Member2 from "@/assets/images/dynamic-team/a-2.svg";
import Member3 from "@/assets/images/dynamic-team/a-3.svg"; // Remove this if there are only 3 members

const AdvisorTeam = () => {
  const members = [
    {
      name: "Anil Nayak",
     description: "Advisory Board Member, eSampark Tech Solutions",
      image: Member1,
    },
    {
      name: "Upendra Upadhyay",
      description: "Advisory Board Member, eSampark EdTech Medh",
      image: Member2,
    },
    {
      name: "Vikram Srivastava",
      description: "Advisory Board Member, eSampark EdTech Medh",
      image: Member3,
    },
  ];

  return (
    <div className="py-12 lg:w-[70%] lg:mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold text-primaryColor mb-10">Advisory Board</h2>
      <div className="w-full flex flex-wrap justify-between">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-full sm:w-[48%] lg:w-[32%] "
          >
            <div className="w-full h-[350px] overflow-hidden mb-4">
              <Image
                src={member.image}
                alt={member.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <p className="text-[18px] leading-6 text-[#252525] text-center px-2">{member.description}</p>
            <h3 className="text-[22px] leading-8 font-bold text-[#252525] pt-1">{member.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisorTeam;
