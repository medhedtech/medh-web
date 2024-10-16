import About11 from "@/components/sections/abouts/About11";
import AboutContent from "@/components/sections/abouts/AboutContent";
import AtMedh from "@/components/sections/abouts/AtMedh";
import WhoWeAre from "@/components/sections/abouts/WhoWeAre";
import WhyChooseMEDH from "@/components/sections/abouts/WhyChooseMEDH";
import Brands from "@/components/sections/brands/Brands";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import HeroSectionContant from "@/components/sections/hero-banners/HeroSectionContant";
import Overview from "@/components/sections/overviews/Overview";
import Testimonials from "@/components/sections/testimonials/Testimonials";

const AboutMain = () => {
  return (
    <>
      {/* <HeroPrimary title="About Page" path={"About Page"} /> */}
      {/* <HeroSection /> */}
      <HeroSectionContant />
      <AboutContent />
      <AtMedh />
      <WhoWeAre />
      <WhyChooseMEDH />
      {/* <About11 /> */}
      {/* <Overview /> */}
      {/* <FeatureCourses
        title={
          <>
            Choose The Best Package <br />
            For your Learning
          </>
        }
        course="2"
        subTitle="Popular Courses"
      /> */}
      {/* <Testimonials />
      <Brands /> */}
    </>
  );
};

export default AboutMain;
