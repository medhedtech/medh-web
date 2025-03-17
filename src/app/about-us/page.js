import AboutMain from "@/components/layout/main/AboutMain";
import AboutContent from "@/components/sections/abouts/AboutContent";
import AtMedh from "@/components/sections/abouts/AtMedh";
import WhoWeAre from "@/components/sections/abouts/WhoWeAre";
import WhyChooseMEDH from "@/components/sections/abouts/WhyChooseMEDH";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import HeroSectionContant from "@/components/sections/hero-banners/HeroSectionContant";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "About | Medh - Education LMS Template",
  description: "About | Medh - Education LMS Template",
};

const About = async () => {
  return (
    <PageWrapper>
      <HeroSectionContant />
      <AboutContent />
      <AtMedh />
    </PageWrapper>
  );
};

export default About;
