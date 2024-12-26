import { ArrowLeftIcon, SlidersVertical } from "lucide-react";
import React from "react";
import CategoryFilter from "../courses/CategoryFilter";

const GradeSlider = ({toggleGradeSlider, gradeSliderOpen, searchTerm, setSearchTerm, categories, selectedGrade, setSelectedGrade}) => {
  return (
    <div className="md:hidden w-full">
      <div className="flex md:hidden justify-end w-full gap-6 items-center">
        Select Grade:
        <SlidersVertical
          className="text-green-500 font-bold "
          onClick={toggleGradeSlider}
        />
      </div>

      <div
        className={`fixed top-0 right-0 w-[90vw] max-w-[400px] h-[100vh] bg-white shadow-lg z-[10000000] transition-transform duration-500 ease-out transform overflow-auto ${
          gradeSliderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center p-4 gap-4">
          <button onClick={toggleGradeSlider} className="text-xl font-bold">
            <ArrowLeftIcon />
          </button>

          <h1 className="w-full text-center text-xl leading-none font-semibold -ps-2 ">
            Select Grade
          </h1>
        </div>

        <div className=" w-full p-4">
            {/* Search Bar */}
          <div className=" flex items-center border border-[#CDCFD5] px-3 py-2 rounded-md w-full md:w-[50%] lg:w-[25%]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none ml-2 w-full dark:bg-screen-dark dark:text-gray50"
            />
            </div>
            <div className="mt-6 w-full md:w-1/4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedGrade}
              setSelectedCategory={setSelectedGrade}
              heading="Grade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSlider;
