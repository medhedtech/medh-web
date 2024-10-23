import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/images/join-educator/banner.png";
import Cource from "@/assets/images/join-educator/educator-logo.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

export default function EducatorBanner () {
   

  return (
    <div>
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}               
        isoImage={Iso}                 
        heading="INSPIRE, INNOVATE, EDUCATE."
        subheading="Empower Your Teaching, Redefine Online Learning"
        description="Shape the Future of Skill Development Education. Join Us in Empowering Learners and Transforming Lives Together!"
        buttonText="Explore More"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={LetsConnect}
      />
    </div>
  );
}




