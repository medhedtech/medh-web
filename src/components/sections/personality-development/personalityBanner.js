import React from "react";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import DevelopmentImg from "@/assets/Header-Images/Personality-Development/multiracial-teenage-high-school-students-looking-a-2023-11-27-05-15-38-utc.jpg";
import Iso from "@/assets/images/personality/iso-icon.svg";
import Enroll from "@/assets/images/personality/enroll-icon.svg";

function PersonalityBanner() {
  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner} 
        logoImage={DevelopmentImg}      
        isoImage={Iso}                     
        heading="Comprehensive Personality Development Course"  
        subheading="UNLOCK CONFIDENCE, CHARISMA, AND SUCCESS."  
        description="Uncover Your Untapped Potential. For all ages, from Students to Professionals and Homemakers. Unleash Your Best Self."  // Dynamic description
        buttonText="Enroll now"            
        isoText="VIEW OPTIONS"           
        slogan="Medh Hain Toh Mumkin Hain!" 
        buttonImage={Enroll}               
      />
    </div>
  );
}

export default PersonalityBanner;
