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
<<<<<<< HEAD
        slogan="Medh Hain Toh Mumkin Hai!"
=======
        slogan="Medh Hai Toh Mumkin Hai!"
>>>>>>> f1430ea24f47e7db52d620ec30e11914e4a1de6e
        buttonImage={LetsConnect}
      />
    </div>
  );
}




