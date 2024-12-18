import React from "react";
import Iso from "@/assets/images/courseai/iso.png";
import heroBg from "@/assets/Header-Images/About/About.png";
import AboutUs from "@/assets/Header-Images/About/medium-shot-woman-holding-laptop.jpg"
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";
import AboutBanner from "@/components/course-banner/aboutBanner";

function CourseAiBanner() {
  return (
    <div>
      <AboutBanner
        bannerImage={heroBg}
        logoImage={AboutUs}     
        isoImage={Iso}                 
        heading="Start Your Journey towards Success with Medh"   
        subheading="SKILL UP. RISE UP. EMBRACE EMPOWERMENT."  
        description="Nurturing Minds, Shaping Futures. Inspiring Growth, Igniting Potential. Transforming Dreams into Reality!"  // Dynamic description
        buttonText="Explore More"        
        isoText="ISO CERTIFIED"         
        slogan="Medh Hain Toh Mumkin Hain!"  
        buttonImage={LetsConnect}           
      />
    </div>
  );
}

export default CourseAiBanner;

