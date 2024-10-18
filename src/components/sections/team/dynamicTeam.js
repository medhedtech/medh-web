import Image from "next/image";
import React from "react";
import img1 from "@/assets/images/team/img1.png";
import img2 from "@/assets/images/team/img2.png";
import img3 from "@/assets/images/team/img3.png";
import img4 from "@/assets/images/team/img4.png";
import img5 from "@/assets/images/team/img5.png";
import img6 from "@/assets/images/team/img6.png";
import img7 from "@/assets/images/team/img7.png";
import img8 from "@/assets/images/team/img8.png";
import img9 from "@/assets/images/team/img9.png";
import img10 from "@/assets/images/team/img10.png";

const DynamicTeam = () => {
  const teamMembers = [
    {
      name: "Niti Saxena",
      role: "Director",
      image: img1,
    },
    {
      name: "Neeraj Narain",
      role: "CEO & CTO",
      image: img2,
    },
    {
      name: "Jatin Wadhwa",
      role: "Director of Global Operations",
      image: img3,
    },
    {
      name: "Namrathaa Malu",
      role: "Head of AI and Data Science",
      image: img4,
    },
    {
      name: "Pradnya Thakur",
      role: "AM – Operations",
      image: img5,
    },
    {
      name: "Nishita Francis",
      role: "ATL – Operations",
      image: img6,
    },
    {
      name: "Vikash Gupta",
      role: "Web Developer",
      image: img7,
    },
    {
      name: "Nitanshu Saini",
      role: "Graphic Designer",
      image: img8,
    },
    {
      name: "Esha Bharti",
      role: "Creative Designer",
      image: img9,
    },
    {
      name: "Harsh Patel",
      role: "IT Admin",
      image: img10,
    },
  ];

  return (
    <div>
      <div className="font-bold text-[#5F2DED] text-size-32 leading-30px text-center mt-12">
        Our Dynamic Team
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {teamMembers.slice(0, 3).map((member) => (
            <div key={member.name} className="text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={340}
                height={385}
                className="mx-auto "
              />
              <p className="text-[#252525] mt-2">{member.role}</p>
              <h4 className=" text-lg font-semibold">{member.name}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3  mt-8">
          {teamMembers.slice(3, 6).map((member) => (
            <div key={member.name} className="text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={340}
                height={385}
                className="mx-auto "
              />
              <p className="text-[#252525] mt-2">{member.role}</p>
              <h4 className=" text-lg font-semibold">{member.name}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4  mt-8">
          {teamMembers.slice(6).map((member) => (
            <div key={member.name} className="text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={260}
                height={296}
                className="mx-auto "
              />
              <p className="text-[#252525] mt-2">{member.role}</p>
              <h4 className=" text-lg font-semibold">{member.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicTeam;
