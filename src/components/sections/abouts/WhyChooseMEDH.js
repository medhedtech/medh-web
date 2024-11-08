"use client";
import React from "react";
import Image from "next/image";
import About1 from "@/assets/images/about/about1.png";
import About2 from "@/assets/images/about/about2.png";
import About3 from "@/assets/images/about/about3.png";
import About4 from "@/assets/images/about/about4.png";
import About5 from "@/assets/images/about/about5.png";
import About6 from "@/assets/images/about/about6.png";
import About7 from "@/assets/images/about/about7.png";
import About8 from "@/assets/images/about/about8.png";
import About9 from "@/assets/images/about/about9.png";
import Certified from "../why-medh/Certified";
import DownArrowIcon from "@/assets/images/icon/DownArrowIcon";
import JoinUs from "@/assets/images/about/join-us.png";

const WhyChooseMEDH = () => {
  const features = [
    {
      title: "Educational Goals Alignment",
      description:
        "We align with your educational goals and objectives, providing 360-degree coverage for immersive online learning.",
      icon: About1,
    },
    {
      title: "Quality Learning Materials",
      description:
        "We assess content quality and effectiveness, ensuring up-to-date, well-structured materials that drive learning outcomes.",
      icon: About2,
    },
    {
      title: "User-Friendly Platform",
      description:
        "We have a user-friendly platform for both educators and learners, ensuring ease of use and compatibility with different devices.",
      icon: About3,
    },
    {
      title: "Data Privacy & Security",
      description:
        "Our stringent measures ensure data privacy and security, safeguarding sensitive information from unauthorized access or breaches.",
      icon: About4,
    },
    {
      title: "Personalized Learning",
      description:
        "We offer personalized learning experiences that cater to individual students' needs and adapt to their progress.",
      icon: About5,
    },
    {
      title: "Continuously Updated",
      description:
        "Continuously updating to meet evolving educational needs, we ensure learners receive the best and most relevant experiences.",
      icon: About6,
    },
    {
      title: "Industry-Relevant Courses",
      description:
        "Our courses, developed with industry experts, stay relevant and practical, guaranteeing valuable content delivery.",
      icon: About7,
    },
    {
      title: "Practical Skills Focus",
      description:
        "Our courses emphasize practical, job-relevant skills designed to boost your professional competitiveness.",
      icon: About8,
    },
    {
      title: "Certification Upon Completion",
      description:
        "Upon course completion, we provide certifications to enhance your resume and validate newly acquired skills.",
      icon: About9,
    },
  ];

  return (
    <section className="dark:bg-screen-dark">
    <div className="max-w-7xl mx-auto py-12  px-4 sm:px-6 lg:px-8  ">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-[#252525]">
          Why Choose MEDH?
        </h2>
        <p className="mt-4 max-w-[840px] text-base dark:text-gray300 text-[#5C6574] mx-auto">
          Empowering learners with the freedom to explore and excel in
          fundamental concepts, we strive to provide a global EdTech platform to
          shape aspirations.
        </p>
      </div>

      <div className="rounded-lg p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="border p-6 rounded-3xl shadow-md">
              <div className="flex flex-col justify-between items-center">
                <div className="h-[90px] w-[90px] rounded-md bg-indigo-500 flex items-center mx-auto justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={90}
                    height={90}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="mt-8 text-base text-center dark:text-white text-[#252525] px-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Certified />

      <div className="bg-[#FFE5F0] flex flex-col md:flex-row justify-around rounded-3xl mt-16 p-4 lg:p-0">
        <div className="flex justify-center ">
          <Image src={JoinUs} alt="Join us" width={160} height={180} />
        </div>

        <div className="max-w-[520px] mx-auto md:mx-0 md:w-1/2">
          <h2 className="text-[#444a54] text-left font-bold text-2xl pt-6">
            Join us at Medh to craft a brighter future.
          </h2>
          <p className="text-[#323340]  text-base text-left pt-4">
            Contact us to learn more or explore our platform to experience the
            power of transformative education firsthand.
          </p>
        </div>
        <div className="my-auto mx-12 md:mx-0">
          <div className="bg-[#F6B335] flex items-center px-4 py-3">
            <span className="mr-2">
              <DownArrowIcon />
            </span>
            <p className="text-white font-bold text-sm">Let&#39;s Connect</p>
          </div>
        </div>
      </div>
      <div className="mt-5 text-center">
        <p className="text-[#727695] dark:text-gray300 font-bold text-base leading-6 max-w-[720px] mx-auto">
          Join us in our mission to redefine education and create a brighter
          future for learners worldwide. Together, we can unlock the limitless
          potential that lies within each of us.
        </p>
      </div>
    </div>
    </section>
  );
};

export default WhyChooseMEDH;
