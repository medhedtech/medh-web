import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/ai-and-data/ai-with-data-science.png";
import DevelopmentImg from "@/assets/Header-Images/ai-and-data/image-3rd.jpg";
import Iso from "@/assets/images/courseai/iso.png";
import Enroll from "@/assets/images/personality/enroll-icon.svg";

function CourseAiBanner() {
  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}
        logoImage={DevelopmentImg}
        isoImage={Iso}
        heading="Artificial Intelligence and Data Science Course"
        subheading="EXPLORE TO SUPER-CHARGE YOUR CAREER."
        description="To gain in-depth knowledge, hands-on experience, and practical skills to excel in the dynamic world of technology and analytics." // Dynamic description
        buttonText="Enroll now"
        isoText="VIEW OPTIONS"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={Enroll}
      />
    </div>
  );
}

export default CourseAiBanner;
