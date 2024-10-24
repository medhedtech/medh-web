'use client';
import FilterController from '@/components/shared/courses/FilterController';
import HeadingPrimary from '@/components/shared/headings/HeadingPrimary';
import SectionName from '@/components/shared/section-names/SectionName';
import FilterControllerWrapper from '@/components/shared/wrappers/FilterControllerWrapper';
import FilterCards from '@/components/shared/courses/FilterCards';
import HeadingPrimaryXl from '@/components/shared/headings/HeadingPrimaryXl ';
import Image from 'next/image';
import { useState } from 'react';
import image1 from '@/assets/images/courses/image1.png';
import image2 from '@/assets/images/courses/image2.png';
import image3 from '@/assets/images/courses/image3.png';
import image4 from '@/assets/images/courses/image4.png';
import image5 from '@/assets/images/courses/image5.png';
import image6 from '@/assets/images/courses/image6.png';
import CategoryFilter from './CategoryFilter';
import CourseCard from './CourseCard';
import ArrowIcon from '@/assets/images/icon/ArrowIcon';
import Pagination from '@/components/shared/pagination/Pagination';

const courses = [
  {
    title: 'Professional Edge Diploma in ',
    label: 'Digital Marketing with Data Analytics',
    duration: '18 Months Course',
    brochure: '/path/to/brochure.pdf',
    image: image1,
  },
  {
    title: 'Professional Edge Diploma in ',
    label: 'AI & Data Science',
    duration: '18 Months Course',
    brochure: '/path/to/brochure.pdf',
    image: image2,
  },
  {
    title: 'Certificate in ',
    label: 'Writing and Editing Skills',
    duration: 'Self Paced Learning Program',
    brochure: '/path/to/brochure.pdf',
    image: image3,
  },
  {
    title: 'Certificate in ',
    label: 'Learning Mandarin Language',
    duration: 'Self Paced Learning Program',
    brochure: '/path/to/brochure.pdf',
    image: image4,
  },
  {
    title: 'Certificate in ',
    label: 'Learning Spanish Language',
    duration: 'Self Paced Learning Program',
    brochure: '/path/to/brochure.pdf',
    image: image5,
  },
  {
    title: 'Certificate in',
    label: 'Cyber Law India International',
    duration: 'Self Paced Learning Program',
    brochure: '/path/to/brochure.pdf',
    image: image6,
  },
];

const categories = [
  'AI and Data Science',
  'AI for Professionals',
  'Business & Management',
  'Career Development',
  'Communication & Soft Skills',
  'Data & Analytics',
  'Digital Marketing with Data Analytics',
  'Environmental and Sustainability Skills',
  'Finance & Accounts',
  'Health & Wellness',
  'Industry-Specific Skills',
  'Language & Linguistic',
  'Legal & Compliance Skills',
  'Personal Well-Being',
  'Personality Development',
  'Sales & Marketing',
  'Technical Skills',
  'Vedic Mathematics',
];
const CoursesFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section>
      <div className="min-h-screen bg-white dark:bg-screen-dark  dark:text-white p-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5F2DED] mb-4 md:mb-0">
              Skill Development Courses
            </h1>
            <div>
              <button className="bg-[#5F2DED] text-white px-4 py-2 mt-2 md:mt-0 flex gap-2">
                <span>
                  <ArrowIcon />
                </span>{' '}
                Explore More Courses
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between mt-10">
            <div>
              <input
                type="text"
                placeholder="Search"
                className="border rounded-md p-2 w-fit md:mb-0 dark:bg-[#0C0E2B] "
              />
            </div>
            <div className="relative inline-block text-left pr-4 pb-6 mt-4">
              <div>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 dark:bg-[#0C0E2B]  bg-white text-sm font-medium text-[#5C6574] hover:bg-gray-50"
                >
                  Program Title (a-z)
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg dark:bg-black bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
                      role="menuitem"
                    >
                      Option 1
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
                      role="menuitem"
                    >
                      Option 2
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-[#5C6574] hover:bg-gray-100"
                      role="menuitem"
                    >
                      Option 3
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Categories Section */}
            <div className="w-full md:w-[30%] ">
              <span className="text-[#5C6574] dark:text-white font-bold text-xl">
                Category
              </span>
              <CategoryFilter
                categories={categories}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            {/* Courses Section */}
            <div className="w-full md:w-[70%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>

          {/* Pagination Section */}
          <div className="flex justify-end ">
            <div className="lg:w-[70%] w-full mt-4 mb-8  px-4 text-[#5C6574] border rounded-md border-[#5C6574]">
              <Pagination totalPages={15} currentPage={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter;
