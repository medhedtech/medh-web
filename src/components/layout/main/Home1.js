"use client";
import About1 from "@/components/sections/abouts/About1";
import Blogs from "@/components/sections/blogs/Blogs";
import BrowseCategories from "@/components/sections/browse-categories/BrowseCategories";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import Hero1 from "@/components/sections/hero-banners/Hero1";
import Hire from "@/components/sections/hire/Hire";
import JoinMedh from "@/components/sections/hire/JoinMedh";
import Registration from "@/components/sections/registrations/Registration";
import BrandHero from "@/components/sections/sub-section/BrandHero";
import WhyMedh from "@/components/sections/why-medh/WhyMedh";
import React, { useEffect, useRef } from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";


const Home1 = () => {
  const router = useRouter();
  const homeRef = useRef(null);

  // Scroll to top ONLY when component mounts (page first loads)
  useEffect(() => {
    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "auto" // Changed to "auto" for instant scrolling on initial page load
    });

    // Alternative approach using ref if window.scrollTo doesn't work consistently
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ 
        behavior: 'auto', 
        block: 'start' 
      });
    }
  }, []); // Empty dependency array ensures this only runs once on mount
  
  // Function that only scrolls to top on initial load, not on CoursesFilter changes
  const initialScrollToTop = () => {
    // Only run this function when the component first mounts
    // CoursesFilter will call this once, but we don't want it to scroll on filter changes
  };
  
  return (
    <div ref={homeRef}>
      <Hero1 />
      <BrandHero />
      {/* <About1 /> */}
      {/* <PopularSubjects /> */}
      <CoursesFilter
        CustomText="Skill Development Courses"
        scrollToTop={initialScrollToTop}
        hideGradeFilter
      />
      <WhyMedh />
      {/* <Registration pageTitle="home_page" /> */}
      <BrowseCategories />
      {/* <PricingPlans /> */}
      {/* <Instructors /> */}
      <JoinMedh />
      <Blogs />
      <Hire />
      
    </div>
  );
};

export default Home1;
