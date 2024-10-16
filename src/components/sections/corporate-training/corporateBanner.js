import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/images/corporate-training/banner.png";
import Cource from "@/assets/images/corporate-training/banner-logo.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

export default function CorporateBanner () {
   

  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}               
        isoImage={Iso}                 
        heading="Medh’s Dynamic Corporate Training Courses."
        subheading="EMPOWER YOUR WORKFORCE TO EXCEL."
        description="Elevate their skills, motivation, and engagement to drive business growth and achieve exceptional results."
        buttonText="Let’s Connect"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={LetsConnect}
      />
    </div>
  );
}




