import React from "react";
import JoinMedh from "./JoinMedh";
import EducationBg from "@/assets/images/about/joinSvg.png";
import SchoolBg from "@/assets/images/about/Image.svg";

const Joinmedhpage = () => {
  return (
    <div>
      <JoinMedh
        educatorTitle="Join Medh as an Educator"
        educatorText="Join Medh's pioneering learning community and contribute to shaping a transformative educational journey for learners worldwide."
        educatorButtonText="Get Start"
        educatorButtonColor="#7ECA9D"
        EducationBg={EducationBg}
        partnerTitle="Partner with Medh as a School / Institute"
        partnerText="Join forces with our educational network for global impact."
        partnerButtonText="Let's Collaborate"
        partnerButtonColor="black"
        partnerBackgroundColor="#EDE6FF"
        partnerTextColor="black"
        partnerBtnColor="white"
        SchoolBg={SchoolBg}
      />
    </div>
  );
};

export default Joinmedhpage;
