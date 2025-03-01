import React from "react";
import Image from "next/image";
import Logo12 from "@/assets/images/join-as-school/logo-12.svg";
import Logo13 from "@/assets/images/join-as-school/logo-13.svg";
import Logo14 from "@/assets/images/join-as-school/logo-14.svg";
import Logo15 from "@/assets/images/join-as-school/logo-15.svg";
import Logo16 from "@/assets/images/join-as-school/logo-16.svg";
import Logo17 from "@/assets/images/join-as-school/logo-17.svg";

const educationFeature = [
  {
    id: 1,
    icon: Logo12,
    title: "Make students think on their feet",
    description:
      "In today’s fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
  },
  {
    id: 2,
    icon: Logo13,
    title: "Inspire students to take calculated risks",
    description:
      "In today’s fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
  },
  {
    id: 3,
    icon: Logo14,
    title: "Encourage students to be more creative",
    description:
      "Encouraging students to step beyond comfort zones fosters creativity, inspiring novel ideas and collaboration in discussing and sharing interests.",
  },
  {
    id: 4,
    icon: Logo15,
    title: "Identify specific future-ready skills in children",
    description:
      "To meet future workforce demands, education should adapt and equip students with essential skills for seamless integration. Teachers play a vital role in identifying and tailoring students’ educational requirements.",
  },
  {
    id: 5,
    icon: Logo16,
    title: "Introduce a student-led learning approach",
    description:
      "To adopt an efficient student-led learning approach, schools should prioritize students, involving them in decision-making for future- ready classrooms and technology integration.",
  },
  {
    id: 6,
    icon: Logo17,
    title: "Make communication an essential part of their journey",
    description:
      "Modern education involves introducing and exploring new concepts. It’s crucial to teach children effective communication for their future. Teachers should motivate clear and confident expression of thoughts and ideas.",
  },
];

const EducationalFeatureCard = () => {
  return (
    <section className="py-10 w-full bg-[#FFE5F0] dark:bg-inherit dark:bg-screen-dark flex justify-center items-center ">
      <div className="w-[92%] lg:w-[80%]">
        {/* Render the General Benefits */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-5 lg:gap-y-10 gap-y-5">
          {educationFeature.map((feature, index) => (
            <div
              key={index}
              className=" px-2 py-2 text-center bg-white rounded-3xl border border-[#0000004D] dark:bg-screen-dark dark:border-gray600 shadow-card-custom w-full transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 "
            >
              <Image
                src={feature.icon}
                alt="img"
                className="mx-auto h-16 mb-2"
              />
              <h3 className="text-[15px] leading-[22.5px] font-semibold text-[#252525] dark:text-gray50 font-Poppins mb-1">
                {feature.title}
              </h3>
              <p className="text-[#252525] text-[15px] leading-[22.5px] dark:text-gray300 font-normal font-Poppins">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalFeatureCard;
