import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/Medh-Membership/ai-with.png";
import Cource from "@/assets/Header-Images/Medh-Membership/close-up-person-holding-smartphone.jpg";
// import Banner from "@/assets/images/corporate-training/banner.png";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import LetsConnect from "@/assets/images/news-media/btn-vertical.svg";

export default function MembershipBanner () {
   

  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}               
        isoImage={Iso}                 
        heading="TAILORED RESOURCES FOR SUCCESS."
        subheading="Master Your Chosen Domains with Medh Membership"
        description="Take Your Skills to New Heights! Become a MEDH Member Today and Unlock Your Full Potential for Success."
        buttonText="Explore More"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hai!"
        buttonImage={LetsConnect}
      />
    </div>
  );
}




