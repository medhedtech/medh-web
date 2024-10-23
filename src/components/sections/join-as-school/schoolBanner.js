import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/images/join-as-school/banner.png";
import Cource from "@/assets/images/join-as-school/school-logo.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

export default function SchoolBanner () {
   

  return (
    <div>
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}               
        isoImage={Iso}                 
        heading="INNOVATE EDUCATION, EMPOWER STUDENTS."
        subheading="Partner with Medh for Innovative Solutions"
        description="Boost your students’ skill sets and enhance their future career prospects for greater success and opportunities."
        buttonText="Explore More"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={LetsConnect}
      />
    </div>
  );
}




