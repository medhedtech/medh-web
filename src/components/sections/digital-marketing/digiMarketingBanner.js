import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner"; 
import Banner from "@/assets/images/digital-marketing/banner.png";
import Cource from "@/assets/images/digital-marketing/digi-logo.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import Enroll from "@/assets/images/personality/enroll-icon.svg";

function DigiMarketingBanner() {
  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}           
        logoImage={Cource}             
        isoImage={Iso}                 
        heading="Digital Marketing with Data Analytics Course"  
        subheading="OVERCOMING MATH FEAR THE VEDIC WAY." 
        description="Ancient Wisdom, Modern Techniques. Eliminate Math Phobia and Transform It into a Joyful and Engaging Experience."  // Dynamic description
        buttonText="Enroll now"        
        isoText="VIEW OPTIONS"       
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={Enroll}           
      />
    </div>
  );
}

export default DigiMarketingBanner;
