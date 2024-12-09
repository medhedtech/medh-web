import React from "react";
import Image from "next/image";
import MainBanner from "@/components/course-banner/mainBanner";
import Banner from "@/assets/Header-Images/Hire-From-Medh/medh.png";
import Cource from "@/assets/Header-Images/Hire-From-Medh/group-three-modern-architects.jpg";
import Iso from "@/assets/images/hireformmedh/iso.svg";
import Enroll from "@/assets/images/career/dot-icon.svg";

function DigiMarketingBanner() {
  return (
    <div>
      {/* Pass dynamic content as props to MainBanner */}
      <MainBanner
        bannerImage={Banner}
        logoImage={Cource}
        isoImage={Iso}
        heading="EXPLORE YOUR IDEAL TALENT MATCHES!"
        subheading="Efficient Recruitment, Access to Global Talent Pool"
        description="Recruit top IT professionals in areas including AI, Data Science, Digital Marketing, Analytics, Cybersecurity, and more." // Dynamic description
        buttonText="Let’s Connect"
        isoText="ISO CERTIFIED"
        slogan="Medh Hain Toh Mumkin Hain!"
        buttonImage={Enroll}
      />
    </div>
  );
}

export default DigiMarketingBanner;
