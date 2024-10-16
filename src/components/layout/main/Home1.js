import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import Hero1 from "@/components/sections/hero-banners/Hero1";
import Hire from "@/components/sections/hire/Hire";
import JoinMedh from "@/components/sections/hire/JoinMedh";
import Instructors from "@/components/sections/instructors/Instructors";
import PopularSubjects from "@/components/sections/popular-subjects/PopularSubjects";
import PricingPlans from "@/components/sections/pricing-plans/PricingPlans";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh";
import React from "react";
const Home1 = () => {
  return (
    <>
      <Hero1 />
      <BrandHero />
      <About1 />
      {/* <PopularSubjects /> */}
      <CoursesFilter />
      <WhyMedh />
      <Registration />
      <BrowseCategories />
      {/* <PricingPlans /> */}
      {/* <Instructors /> */}
      <JoinMedh />
      <Blogs />
      <Hire />
    </>
  );
};

export default Home1;
