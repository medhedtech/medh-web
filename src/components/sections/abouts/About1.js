"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import aidata from "@/assets/images/about/ai-data-science.png";
import digital from "@/assets/images/about/digital-marketing.png";
import personality from "@/assets/images/about/personality-development.png";
import vedic from "@/assets/images/about/vedic-mathematics.png";
import useIsTrue from "@/hooks/useIsTrue";

const About1 = ({ children, image, hideCounter }) => {
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");

  const courses = [
    {
      title: "Artificial Intelligence and Data Science",
      imageSrc: aidata,
      path: "/ai-data-science",
    },
    {
      title: "Digital Marketing with Data Analytics",
      imageSrc: digital,
      path: "/digital-marketing-with-data-analyst",
    },
    {
      title: "Personality Development",
      imageSrc: personality,
      path: "/personality-development",
    },
    {
      title: "Vedic Mathematics",
      imageSrc: vedic,
      path: "/vedic-mathematics",
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
            <Link href={course.path} key={index}>
              <div
                className="bg-white shadow-2xl flex flex-col overflow-hidden hover:scale-105 transition transform duration-300 h-full"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.imageSrc}
                    alt={course.title}
                    layout="fill" // Ensure the image fills the container
                    objectFit="cover" // Crop the image to fit
                  />
                </div>
                <div className="py-4 px-6 flex-grow">
                  <h3 className="text-lg font-bold text-[#5C6574]">
                    {course.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About1;
