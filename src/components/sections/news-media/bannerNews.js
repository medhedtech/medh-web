import React from 'react'
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/News-and-media/Home_Banner_2_e7389bb905 .jpg";
import Cource from "@/assets/Header-Images/News-and-media/city-committed-education.jpg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

export default function BannerNews () {
   

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
        //  buttonTextColor="#FF5733"
      />
    </div>
  );
}
