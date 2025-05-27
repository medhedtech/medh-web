import React from "react";
import Link from "next/link";
import BookImage from "@/components/shared/animaited-images/BookImage";
import GlobImage from "@/components/shared/animaited-images/GlobImage";
import BalbImage from "@/components/shared/animaited-images/BalbImage";
import TriangleImage from "@/components/shared/animaited-images/TriangleImage";
const HeroPrimary = ({ title, path }) => {
  return (
    <section data-aos="fade-up">
      {/* banner section  */}
      <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
        {/* animated icons  */}
        <div>
          <BookImage type={"secondary"} />
          <GlobImage type={"secondary"} />
          <BalbImage type={"secondary"} />
          <TriangleImage type={"secondary"} />
        </div>
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl md:text-size-40 2xl:text-5xl font-bold text-blackColor2 dark:text-blackColor2-dark  leading-18 md:leading-15 lg:leading-18">
              {title}
            </h1>
            <span className="text-blackColor2 dark:text-blackColor2-dark text-2xl md:text-3xl lg:text-5xl font-bold">with </span>
            <span className="text-medhgreen text-BASE md:text-3xl lg:text-5xl font-bold">MEDH</span>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto pt-5 pb-5">Insightful Content Exploring Latest Trends in Skill Development and Careers
            </p>
            <ul className="flex gap-1 justify-center  ">
              <li>
                <Link
                  href="/"
                  className="text-lg text-blackColor2 dark:text-blackColor2-dark hover:text-primaryColor dark:hover:text-primaryColor"
                >
                  Home <i className="icofont-simple-right"></i>
                </Link>
              </li>
              <li>
                <span className="text-lg text-blackColor2 dark:text-blackColor2-dark mr-1.5">
                  {path}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPrimary;
