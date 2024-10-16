import React from "react";
import MainBanner from "@/components/course-banner/mainBanner"; // Import the reusable MainBanner component
import Banner from "@/assets/images/vedic-mathematics/vedic-banner.png";
import Cource from "@/assets/images/vedic-mathematics/vedic-cource.svg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import Enroll from "@/assets/images/personality/enroll-icon.svg";

function VedicBanner() {
  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}             
        logoImage={Cource}              
        isoImage={Iso}                     
        heading="Comprehensive Course in Vedic Mathematics"  
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

export default VedicBanner;
