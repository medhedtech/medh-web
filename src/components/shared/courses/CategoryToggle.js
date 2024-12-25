import CategoryFilter from "@/components/sections/courses/CategoryFilter";
import { ArrowLeftIcon, SlidersVertical } from "lucide-react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const CategoryToggle = ({
  categorySliderOpen,
  toggleCategorySlider,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleClearFilters,
  searchTerm,
  handleSearch
}) => {
  return (
    <div className="md:hidden">
      <div className="flex md:hidden justify-end w-full gap-6 items-center">
        Select Category:
        <SlidersVertical
          className="text-green-500 font-bold "
          onClick={toggleCategorySlider}
        />
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 w-[90vw] max-w-[400px] h-[100vh] bg-white shadow-lg z-[10000000] transition-transform duration-500 ease-out transform overflow-auto ${
          categorySliderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center p-4 gap-4">
          <button onClick={toggleCategorySlider} className="text-xl font-bold">
            <ArrowLeftIcon />
          </button>

          <h1 className="w-full text-center text-xl leading-none font-semibold -ps-2 ">
            Select Category
          </h1>
        </div>

        <div className=" w-full p-4">
          <div className=" border border-[#CDCFD5] px-2 py-1 rounded-md w-full mb-6">
            <input
              type="text"
              placeholder="Search by category ......"
              value={searchTerm}
              onChange={handleSearch}
              className="outline-none px-2 py-2 w-full dark:bg-screen-dark dark:text-gray50"
            />
          </div>
          <span className="text-[#5C6574] dark:text-white font-bold text-xl">
            Category
          </span>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="w-full mt-12 mb-8 px-4 text-[#5C6574]">
            {/* {(selectedCategory || searchTerm || sortOrder !== "A-Z") && ( */}
            {(selectedCategory.length > 0 || searchTerm) && (
              <div className="flex justify-between items-center">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center border border-[#7ECA9D] text-[#7ECA9D] px-4 py-2 rounded-md hover:bg-[#7ECA9D] hover:text-white transition duration-300"
                >
                  <FaTimes className="mr-2" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryToggle;
