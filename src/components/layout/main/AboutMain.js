"use client";
import React, { useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Hero Section with Animation */}
        <section className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <HeroSectionContant />
        </section>

        {/* About Content with Fade In */}
        <section className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <AboutContent />
        </section>

        {/* At Medh Section with Slide In */}
        <section className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <AtMedh />
        </section>

        {/* Who We Are Section with Fade Up */}
        <section className="relative overflow-hidden">
          <div className={`transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <WhoWeAre />
          </div>
        </section>

        {/* Why Choose MEDH Section with Scale In */}
        <section className="relative bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <div className={`transform transition-all duration-1000 delay-900 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <WhyChooseMEDH />
          </div>
        </section>

        {/* Optional Sections - Uncomment as needed */}
        {/* <section className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <About11 />
        </section> */}

        {/* <section className="relative overflow-hidden">
          <Overview />
        </section> */}

        {/* <section className="bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <FeatureCourses
            title={
              <>
                Choose The Best Package <br />
                For your Learning
              </>
            }
            course="2"
            subTitle="Popular Courses"
          />
        </section> */}

        {/* <section className="relative overflow-hidden">
          <Testimonials />
        </section>

        <section className="bg-white dark:bg-gray-900">
          <Brands />
        </section> */}
      </div>
    </main>
  );
};

export default AboutMain;
