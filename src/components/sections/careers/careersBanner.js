import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/Career/career-at-medh.png";
import Cource from "@/assets/Header-Images/Career/banner-img5.png";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/career/dot-icon.svg";

export default function CareerBanner () {
   

  return (
    <div>
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}               
        isoImage={Iso}                 
        heading="INNOVATE, INSPIRE, and GROW."
        subheading="Join Medh’s Team that is Transforming Education."
        description="Advance your career and become part of a dynamic, inclusive work culture where growth and innovation thrive."
        buttonText="Apply Now"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={ LetsConnect}
      />
    </div>
  );
}




