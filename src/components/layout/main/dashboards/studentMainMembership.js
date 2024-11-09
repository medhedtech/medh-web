import React from "react";
import Image from "next/image";
import ClockLogo from "@/assets/images/student-dashboard/clock.svg";
import VideoClass from "@/assets/images/student-dashboard/video-class.svg";
const StudentMainMembership = ({ membership }) => (
  <div className="flex items-center dark:border shadow-student-dashboard  p-5 rounded-lg overflow-hidden hover:scale-105 transform transition-transform duration-300">
    <div className="relative h-40 w-[40%]">
      <Image
        src={membership.imageSrc}
        alt={membership.title}
        layout="fill"
        objectFit="cover"
        className="rounded-xl"
      />
    </div>
    <div className=" px-4 w-[60%] font-Open">
      <span className="text-orange-500 text-xs font-bold text-[#FFA927]">
        {membership.type}
      </span>
      <h3 className="text-xl font-semibold dark:text-white text-[#202244] mt-2">
        {membership.title}
      </h3>
      <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-2">
        <Image
          src={VideoClass}
          alt="Classes Icon"
          width={20}
          height={20}
          className="mr-2"
        />
        {membership.classes}
      </div>
      <div className="flex items-center font-semibold dark:text-white text-[#202244] text-[11px] mt-1">
        <Image
          src={ClockLogo}
          alt="Clock Icon"
          width={20}
          height={20}
          className="mr-2"
        />
        {membership.hours}
      </div>
      <p className="text-[#7ECA9D] font-bold text-xs mt-4">
        Membership Name: {membership.membershipName}
      </p>
    </div>
  </div>
);
export default StudentMainMembership;
