"use client";
import FilterController from "@/components/shared/courses/FilterController";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import FilterControllerWrapper from "@/components/shared/wrappers/FilterControllerWrapper";
import FilterCards from "@/components/shared/courses/FilterCards";
import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";
import Image from "next/image";
import { useState } from "react";
import image1 from "@/assets/images/courses/image1.png";
import image2 from "@/assets/images/courses/image2.png";
import image3 from "@/assets/images/courses/image3.png";
import image4 from "@/assets/images/courses/image4.png";
import image5 from "@/assets/images/courses/image5.png";
import image6 from "@/assets/images/courses/image6.png";
import CategoryFilter from "./CategoryFilter";
import CourseCard from "./CourseCard";

const courses = [
  {
    title: "Professional Edge Diploma in ",
    label: "Digital Marketing with Data Analytics",
    duration: "18 Months Course",
    brochure: "/path/to/brochure.pdf",
    image: image1,
  },
  {
    title: "Professional Edge Diploma in ",
    label: "AI & Data Science",
    duration: "18 Months Course",
    brochure: "/path/to/brochure.pdf",
    image: image2,
  },
  {
    title: "Certificate in ",
    label: "Writing and Editing Skills",
    duration: "Self Paced Learning Program",
    brochure: "/path/to/brochure.pdf",
    image: image3,
  },
  {
    title: "Certificate in ",
    label: "Learning Mandarin Language",
    duration: "Self Paced Learning Program",
    brochure: "/path/to/brochure.pdf",
    image: image4,
  },
  {
    title: "Certificate in ",
    label: "Learning Spanish Language",
    duration: "Self Paced Learning Program",
    brochure: "/path/to/brochure.pdf",
    image: image5,
  },
  {
    title: "Certificate in",
    label: "Cyber Law India International",
    duration: "Self Paced Learning Program",
    brochure: "/path/to/brochure.pdf",
    image: image6,
  },
];

const categories = [
  "AI and Data Science",
  "AI for Professionals",
  "Business & Management",
  "Career Development",
  "Communication & Soft Skills",
  "Data & Analytics",
  "Digital Marketing with Data Analytics",
  "Environmental and Sustainability Skills",
  "Finance & Accounts",
  "Health & Wellness",
  "Industry-Specific Skills",
  "Language & Linguistic",
  "Legal & Compliance Skills",
  "Personal Well-Being",
  "Personality Development",
  "Sales & Marketing",
  "Technical Skills",
  "Vedic Mathematics",
];
const CoursesFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5F2DED] mb-4 md:mb-0">
              Skill Development Courses
            </h1>
            <div>
              <button className="bg-[#5F2DED] text-white px-4 py-2 mt-2 md:mt-0">
                Explore More Courses
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md p-2 lg:w-1/4 md:w-1/3 mb-4 md:mb-0"
            />
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Categories Section */}
            <CategoryFilter
              categories={categories}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Courses Section */}
            <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 text-center lg:grid-cols-3 gap-6 p-4">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button className="px-3 py-1 bg-purple-700 text-white rounded-md mx-1">
              1
            </button>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md mx-1">
              2
            </button>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md mx-1">
              3
            </button>
            <span className="mx-2">-</span>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md mx-1">
              15
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter;
