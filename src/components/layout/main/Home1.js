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
import React from "react";
import ArrowIcon from "@/assets/images/icon/ArrowIcon";
import { useRouter } from "next/navigation";

const Home1 = () => {
  const router = useRouter();
  const CustomButton = (
    <button
      onClick={() => {
        router.push("/skill-development-courses");
      }}
      className="cursor-pointer bg-[#7ECA9D] text-white px-4 py-2 mt-2 md:mt-0 flex gap-2"
    >
      <span>
        <ArrowIcon />
      </span>{" "}
      Explore More Courses
    </button>
  );
  return (
    <>
      <Hero1 />
      <BrandHero />
      <About1 />
      {/* <PopularSubjects /> */}
      <CoursesFilter
        CustomButton={CustomButton}
        CustomText="Skill Development Courses"
      />
      <WhyMedh />
      <Registration pageTitle="home_page" />
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
