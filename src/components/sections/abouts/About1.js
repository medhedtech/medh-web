"use client";
import SectionName from "@/components/shared/section-names/SectionName";
import Image from "next/image";
import React from "react";
import Counter from "../sub-section/Counter";
import about2 from "@/assets/images/about/about_2.png";
import about3 from "@/assets/images/about/about_3.png";
import about4 from "@/assets/images/about/about_4.png";
import about11 from "@/assets/images/about/about_11.png";
import about19 from "@/assets/images/about/about_19.png";
import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import counter4 from "@/assets/images/counter/counter__4.png";
import TiltWrapper from "@/components/shared/wrappers/TiltWrapper";
import aidata from "@/assets/images/about/ai-data-science.png";
import digital from "@/assets/images/about/digital-marketing.png";
import personality from "@/assets/images/about/personality-development.png";
import vedic from "@/assets/images/about/vedic-mathematics.png";
import useIsTrue from "@/hooks/useIsTrue";
const About1 = ({ children, image, hideCounter }) => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  // const counterItems = [
  //   {
  //     name: "Total Acheivment",
  //     image: counter1,
  //     data: 27,
  //     symbol: "+",
  //   },
  //   {
  //     name: "TOTAL STUDENTS",
  //     image: counter2,
  //     data: 145,
  //     symbol: "+",
  //   },
  //   {
  //     name: "tOTAL INSTRUCTOR",
  //     image: counter3,
  //     data: 10,
  //     symbol: "k",
  //   },
  //   {
  //     name: "OVER THE WORLD",
  //     image: counter4,
  //     data: 214,
  //     symbol: "+",
  //   },
  // ];

  const courses = [
    {
      title: "Artificial Intelligence and Data Science",
      imageSrc: aidata,
    },
    {
      title: "Digital Marketing with Data Analytics",
      imageSrc: digital,
    },
    {
      title: "Personality Development",
      imageSrc: personality,
    },
    {
      title: "Vedic Mathematics",
      imageSrc: vedic,
    },
  ];
  return (
    <section>
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Featured LIVE Courses
        </h2>
        <p className="text-gray-600 mb-8 max-w-full sm:max-w-md lg:max-w-2xl text-center mx-auto px-4">
          Medh’s expertly crafted skill development courses empower you to excel
          in life. Master industry-relevant skills and conquer modern
          challenges. Embrace the future – Invest in your skills now.
        </p>

        {/* Grid Section */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white shadow-2xl  overflow-hidden hover:scale-105 transition transform duration-300"
            >
              <Image
                src={course.imageSrc}
                alt={course.title}
                className="w-full h-48 object-cover"
                width={500} // specify the width
                height={300} // specify the height
                layout="responsive" // make the image responsive
              />
              <div className="py-2 px-12">
                <h3 className="text-lg font-bold text-[#5C6574] ">
                  {course.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*<div className={`container ${hideCounter ? "pt-70px pb-100px" : ""}`}>
        {/* about section   
        <div className="grid grid-cols-1 lg:grid-cols-2 pt-30px gap-x-30px">
          {/* about left  
          <div
            className="relative z-0 mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 overflow-visible"
            data-aos="fade-up"
          >
            <TiltWrapper>
              <div className="tilt">
                <Image
                  className="md:ml-[70px]"
                  src={image ? image : about2}
                  alt=""
                />
                <Image
                  className="absolute right-0 sm:right-[-17px] md:right-36 lg:right-4 bottom-[91px] md:bottom-0"
                  src={isHome9 || isHome9Dark ? about19 : about3}
                  alt=""
                />
                <Image
                  className="absolute top-[-18px] left-[30px] animate-move-hor z-[-1]"
                  src={about4}
                  alt=""
                />
                <Image
                  className="absolute top-[30%] left-0 z-[-1]"
                  src={about11}
                  alt=""
                />
              </div>
            </TiltWrapper>
            {/* experience  
            <div className="px-10px py-3 md:py-25px border-l-4 border-primaryColor shadow-experience absolute bottom-0 left-0 bg-white dark:bg-whiteColor-dark animate-move-var w-[290px]">
              <div className="counter flex items-center">
                <p className="text-[40px] text-primaryColor font-bold uppercase pr-10px leading-1">
                  <span data-countup-number="25">25</span>+
                </p>
                <p className="text-blackColor dark:text-blackColor-dark font-bold leading-26px">
                  YEARS EXPERIENCE JUST ACHIVED
                </p>
              </div>
            </div>
          </div>
          {/* about right  
          <div data-aos="fade-up">
            <SectionName>About Us</SectionName>
            <h3 className="text-3xl md:text-size-45 leading-10 md:leading-2xl font-bold text-blackColor dark:text-blackColor-dark pb-25px">
              {children ? (
                children
              ) : (
                <>
                  Welcome to the{" "}
                  <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-3 md:after:bottom-5">
                    {isHome9 || isHome9Dark ? "Kids" : "Online"}
                  </span>{" "}
                  Learning Center
                </>
              )}
            </h3>
            <p className="text-sm md:text-base leading-7 text-contentColor dark:text-contentColor-dark mb-6 pl-3 border-l-2 border-primaryColor">
              25+Contrary to popular belief, Lorem Ipsum is not simply random
              text roots in a piece of classical Latin literature from 45 BC
            </p>
            <ul className="space-y-[14px]">
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  Lorem Ipsum is simply dummy
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  Explore a variety of fresh educational teach
                </p>
              </li>
              <li className="flex items-center group">
                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                  Lorem Ipsum is simply dummy text of
                </p>
              </li>
            </ul>
          </div>
        </div>
        {/* about counter  
        {isHome9 || isHome9Dark || hideCounter || (
          <Counter items={counterItems} />
        )}
      </div>*/}
    </section>
  );
};

export default About1;
