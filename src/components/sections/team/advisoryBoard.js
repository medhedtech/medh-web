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
  return (
    <div>
      <div className="font-bold text-[#7ECA9D] text-size-32 leading-30px text-center mt-12">
        Advisory Board
      </div>
      <div className=" flex flex-col md:flex-row gap-4 mx-auto justify-center my-9">
        {advisoryTeam.map((member) => (
          <div
            key={member.name}
            className="text-center w-[260px] md:mx-0 mx-auto"
          >
            <Image
              src={member.image}
              alt={member.name}
              width={257}
              height={291}
              className="mx-auto"
            />
            <p className="text-[#252525] mt-2 dark:text-whitegrey3">
              {member.role}
            </p>
            <h4 className="text-lg font-semibold dark:text-white">
              {member.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryBoard;
