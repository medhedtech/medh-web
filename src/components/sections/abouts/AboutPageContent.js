"use client";

import React, { useRef } from "react";
import HeroSectionContant from "@/components/sections/hero-banners/HeroSectionContant";
import AboutContent from "@/components/sections/abouts/AboutContent";
import Certified from "@/components/sections/why-medh/Certified";

const AboutPageContent = () => {
  const aboutContentRef = useRef(null);

  const scrollToAboutContent = () => {
    aboutContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSectionContant onLearnMoreClick={scrollToAboutContent} />
      {/* Main Content Sections */}
      <div ref={aboutContentRef} id="about-content">
        <AboutContent />
      </div>
      {/* Trusted Sources - Certifications */}
      <section className="w-full relative overflow-hidden z-10">
        <Certified />
      </section>
    </>
  );
};

export default AboutPageContent; 