import Image from "next/image";
import React from "react";
// import img1 from "@/assets/images/team/img1.png";
import Dynamic1 from "@/assets/images/team/img1.png"
import Dynamic2 from "@/assets/images/team/img2.png";
import Dynamic3 from "@/assets/images/team/img3.png";
import Dynamic4 from "@/assets/images/team/img4.png";
import Dynamic5 from "@/assets/images/team/img5.png";
import Dynamic6 from "@/assets/images/team/img6.png";
import Dynamic7 from "@/assets/images/team/img7.png";
import Dynamic8 from "@/assets/images/team/img8.png";
import Dynamic9 from "@/assets/images/team/img9.png";
import Dynamic10 from "@/assets/images/team/img10.png";

const DynamicTeam = () => {
  const teamMembers = [
    {
      name: "Niti Saxena",
      role: "Director",
      image: Dynamic1,
    },
    {
      name: "Neeraj Narain",
      role: "CEO & CTO",
      image: Dynamic2,
    },
    {
      name: "Jatin Wadhwa",
      role: "Director of Global Operations",
      image: Dynamic3,
    },
    {
      name: "Namrathaa Malu",
      role: "Head of AI and Data Science",
      image: Dynamic4,
    },
    {
      name: "Pradnya Thakur",
      role: "AM – Operations",
      image: Dynamic5,
    },
    {
      name: "Nishita Francis",
      role: "ATL – Operations",
      image: Dynamic6,
    },
    {
      name: "Vikash Gupta",
      role: "Web Developer",
      image: Dynamic7,
    },
    {
      name: "Nitanshu Saini",
      role: "Graphic Designer",
      image: Dynamic8,
    },
    {
      name: "Esha Bharti",
      role: "Creative Designer",
      image: Dynamic9,
    },
    {
      name: "Harsh Patel",
      role: "IT Admin",
      image: Dynamic10,
    },
  ];

  const TeamMemberCard = ({ member }) => (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl bg-white dark:bg-gray-800/90 p-5 transform hover:-translate-y-2 hover:scale-[1.01]">
      <div className="relative">
        <Image
          src={member.image}
          alt={member.name}
          width={340}
          height={385}
          className="mx-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center rounded-xl">
          <div className="text-white text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="block text-sm font-medium text-[#7ECA9D] uppercase tracking-wider mb-2">{member.role}</span>
            <h4 className="text-2xl font-bold mb-2">{member.name}</h4>
            <div className="h-0.5 w-12 bg-[#7ECA9D] mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center group-hover:opacity-0 transition-opacity duration-300">
        <span className="text-[#7ECA9D] text-sm font-medium uppercase tracking-wider block mb-2">
          {member.role}
        </span>
        <h4 className="text-xl font-bold text-gray-800 dark:text-white">
          {member.name}
        </h4>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#7ECA9D] text-sm font-semibold uppercase tracking-wider block mb-3">Meet Our Team</span>
          <h2 className="font-bold text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">
            Our Dynamic Team
          </h2>
          <div className="h-1 w-24 bg-[#7ECA9D] mx-auto rounded-full"></div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-8">Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>

        {/* Core Team */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-8"> Operations Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.slice(3, 6).map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>

        {/* Support Team */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-8">Support Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.slice(6).map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicTeam;
