"use client";
import React from "react";
import HeroSection from "./HeroSection";
import heroBg from "@/assets/images/about/heroBg.png";
import stemImg from "@/assets/images/herobanner/Background.png";
import AboutUs from "@/assets/images/about/about-us.png";

const HeroSectionContent = () => {
  const leftContent = {
    title: "SKILL UP. RISE UP. EMBRACE EMPOWERMENT.",
    subtitle: "Start Your Journey towards Success with Medh",
    description:
      "Nurturing Minds, Shaping Futures. Inspiring Growth, Igniting Potential. Transforming Dreams into Reality!",
    cta: {
      text: "Explore More",
      link: "/courses",
    },
    certification: "ISO CERTIFIED",
    motto: "Medh Hain Toh Mumkin Hain!",
  };

  const rightImage = {
    src: AboutUs,
    width: 570,
    height: 321,
    alt: "About Us",
  };

  return (
    <HeroSection
      backgroundImage={heroBg}
      leftContent={leftContent}
      rightImage={rightImage}
      stemImage={stemImg}
    />
  );
};

export default HeroSectionContent;
