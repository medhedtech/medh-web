"use client";

import React, { useRef } from "react";
import HeroSectionContant from "@/components/sections/hero-banners/HeroSectionContant";
import AboutContent from "@/components/sections/abouts/AboutContent";
import WhoWeAre from "@/components/sections/abouts/WhoWeAre";
import AtMedh from "@/components/sections/abouts/AtMedh";
import WhyChooseMEDH from "@/components/sections/abouts/WhyChooseMEDH";

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
      <WhoWeAre />
      <AtMedh />
      <WhyChooseMEDH />
    </>
  );
};

export default AboutPageContent; 