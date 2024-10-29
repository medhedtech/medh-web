import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner"; // Import your MainBanner component
import Iso from "@/assets/images/courseai/iso.png";
import heroBg from "@/assets/images/about/heroBg.png";
import AboutUs from "@/assets/images/about/about-us.png";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

function CourseAiBanner() {
  return (
    <div>
      <MainBanner
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

