import Image from "next/image";
import React from "react";
import Advisor11 from "@/assets/images/team/img11.png";
import Advisor12 from "@/assets/images/team/img12.png";
import Advisor13 from "@/assets/images/team/img13.png";

const AdvisoryBoard = () => {
  const advisoryTeam = [
    {
      name: "Anil Nayak",
      role: "Advisory Board Member,eSampark Tech Solutions",
      image: Advisor11,
    },
    {
      name: "Upendra Upadhyay",
      role: "Advisory Board Member, eSampark EdTech Medh",
      image: Advisor12,
    },
    {
      name: "Vikram Srivastava",
      role: "Advisory Board Member, eSampark EdTech Medh",
      image: Advisor13,
    },
  ];

  const AdvisorCard = ({ member }) => (
    <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 p-4 transform hover:-translate-y-2">
      <div className="relative">
        <Image
          src={member.image}
          alt={member.name}
          width={257}
          height={291}
          className="mx-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="text-white text-center p-4">
            <h4 className="text-xl font-bold mb-2">{member.name}</h4>
            <p className="text-sm font-medium">{member.role}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center group-hover:opacity-0 transition-opacity duration-300">
        <h4 className="text-lg font-bold mb-2 dark:text-white">{member.name}</h4>
        <p className="text-[#252525] text-sm font-medium dark:text-whitegrey3">
          {member.role}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-4xl text-[#7ECA9D] text-center mb-12 relative">
          Advisory Board
          <div className="absolute w-24 h-1 bg-[#7ECA9D] bottom-0 left-1/2 transform -translate-x-1/2 mt-4"></div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advisoryTeam.map((member) => (
            <AdvisorCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvisoryBoard;
