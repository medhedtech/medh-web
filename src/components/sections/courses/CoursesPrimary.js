"use client";
import { useSearchParams } from "next/navigation";
import TabButtonSecondary from "@/components/shared/buttons/TabButtonSecondary";
import CoursesGrid from "@/components/shared/courses/CoursesGrid";
import CoursesList from "@/components/shared/courses/CoursesList";
import Pagination from "@/components/shared/others/Pagination";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";
import { useEffect, useRef, useState } from "react";
import getAllCourses from "@/libs/getAllCourses";
import Image from "next/image";
import Link from "next/link";
import NoData from "@/components/shared/others/NoData";
const sortInputs = [
  "Sort by New",
  "Title Ascending",
  "Title Descending",
  "Price Ascending",
  "Price Descending",
];
const coursesBeforeFilter = getAllCourses();
const getFilteredCoursesLength = (filterkey, filterValue) => {
  const filteredCoursesLength = coursesBeforeFilter?.filter(
    (course) => course[filterkey] === filterValue
  )?.length;
  return filteredCoursesLength;
};
const filterIputs = [
  {
    name: "Categories",
    inputs: [
      {
        name: "AI & Data Science",
        totalCount: getFilteredCoursesLength("categories", "AI & Data Science"),
      },
      {
        name: "Digital Marketing",
        totalCount: getFilteredCoursesLength("categories", "Digital Marketing"),
      },
      {
        name: "Personality Development",
        totalCount: getFilteredCoursesLength("categories", "Personality Development"),
      },
      {
        name: "Vedic Mathematics",
        totalCount: getFilteredCoursesLength("categories", "Vedic Mathematics"),
      },
      {
        name: "Art & Design",
        totalCount: getFilteredCoursesLength("categories", "Art & Design"),
      },
      {
        name: "Development",
        totalCount: getFilteredCoursesLength("categories", "Development"),
      },
      {
        name: "Lifestyle",
        totalCount: getFilteredCoursesLength("categories", "Lifestyle"),
      },
      {
        name: "Web Design",
        totalCount: getFilteredCoursesLength("categories", "Web Design"),
      },
      {
        name: "Business",
        totalCount: getFilteredCoursesLength("categories", "Business"),
      },
      {
        name: "Finance",
        totalCount: getFilteredCoursesLength("categories", "Finance"),
      },
      {
        name: "Personal Development",
        totalCount: getFilteredCoursesLength(
          "categories",
          "Personal Development"
        ),
      },
      {
        name: "Marketing",
        totalCount: getFilteredCoursesLength("categories", "Marketing"),
      },
      {
        name: "Photography",
        totalCount: getFilteredCoursesLength("categories", "Photography"),
      },
      {
        name: "Data Science",
        totalCount: getFilteredCoursesLength("categories", "Data Science"),
      },
      {
        name: "Health & Fitness",
        totalCount: getFilteredCoursesLength("categories", "Health & Fitness"),
      },
      {
        name: "Mobile Application",
        totalCount: getFilteredCoursesLength(
          "categories",
          "Mobile Application"
        ),
      },
    ],
  },
  {
    name: "Blended Learning",
    inputs: [
      {
        name: "Online + Offline",
        totalCount: getFilteredCoursesLength("categories", "Online + Offline"),
      },
      {
        name: "Hybrid Learning",
        totalCount: getFilteredCoursesLength("categories", "Hybrid Learning"),
      },
      {
        name: "Flexible Schedule",
        totalCount: getFilteredCoursesLength("categories", "Flexible Schedule"),
      },
      {
        name: "Mixed Format",
        totalCount: getFilteredCoursesLength("categories", "Mixed Format"),
      },
    ],
  },
  {
    name: "Tag",
    inputs: [
      "Mechanic",
      "English",
      "Computer Science",
      "Data & Tech",
      "Ux Desgin",
    ],
  },
  {
    name: "Skill Level",
    inputs: ["All", "Fullstack", "English Learn", "Intermediate", "Wordpress"],
  },
];
// get all filtered courses
const getAllFilteredCourses = (filterableCourses, filterObject) => {
  const { currentCategories, currentBlendedLearning, currentTags, currentSkillLevel } = filterObject;
  const filteredCourses = filterableCourses?.filter(
    ({ categories, tag, skillLevel }) =>
      (!currentCategories?.length || currentCategories.includes(categories)) &&
      (!currentBlendedLearning?.length || currentBlendedLearning.includes(categories)) &&
      (!currentTags?.length || currentTags?.includes(tag)) &&
      (!currentSkillLevel?.length ||
        currentSkillLevel?.includes("All") ||
        currentSkillLevel?.includes(skillLevel))
  );
  return filteredCourses;
};
// get sorted courses
const getSortedCourses = (courses, sortInput) => {
  switch (sortInput) {
    case "Sort by New":
      return courses?.sort((a, b) => a?.date - b?.date);
    case "Title Ascending":
      return courses?.sort((a, b) => a?.title?.localeCompare(b?.title));
    case "Title Descending":
      return courses?.sort((a, b) => b?.title?.localeCompare(a?.title));
    case "Price Ascending":
      return courses?.sort((a, b) => a?.price - b?.price);
    case "Price Descending":
      return courses?.sort((a, b) => b?.price - a?.price);
  }
};
const CoursesPrimary = ({ isNotSidebar, isList, card }) => {
  const category = useSearchParams().get("category");
  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentBlendedLearning, setCurrentBlendedLearning] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentSkillLevel, setCurrentSkillLevel] = useState([]);
  const [sortInput, setSortInput] = useState("Sort by New");
  const [isSearch, setIsSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [searchCourses, setSearchCourses] = useState([]);
  const { currentIdx, setCurrentIdx, handleTabClick } = useTab();
  const [currentCourses, setCurrentCourses] = useState(null);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isBlock, setIsBlog] = useState(false);
  const coursesRef = useRef(null);
  const serarchTimeoutRef = useRef(null);
  const filterObject = {
    currentCategories,
    currentBlendedLearning,
    currentTags,
    currentSkillLevel,
  };
  const coursesOnCategory = coursesBeforeFilter?.filter(({ categories }) =>
    categories.toLocaleLowerCase()?.includes(category?.split("_")?.join(" "))
  );
  console.log(category);
  const allFilteredCourses = category
    ? getAllFilteredCourses(coursesOnCategory, filterObject)
    : getAllFilteredCourses(coursesBeforeFilter, filterObject);
  const courses = category
    ? getSortedCourses(isSearch ? searchCourses : allFilteredCourses, sortInput)
    : getSortedCourses(
        isSearch ? searchCourses : allFilteredCourses,
        sortInput
      );
  const coursesString = JSON.stringify(courses);
  const totalCourses = courses?.length;
  const limit = 12;
  const totalPages = Math.ceil(totalCourses / limit);
  const paginationItems = [...Array(totalPages)];
  const handlePagesnation = (id) => {
    coursesRef.current.scrollIntoView({ behavior: "smooth" });
    if (typeof id === "number") {
      setCurrentPage(id);
      setSkip(limit * id);
    } else if (id === "prev") {
      setCurrentPage(currentPage - 1);
      setSkip(skip - limit);
    } else if (id === "next") {
      setCurrentPage(currentPage + 1);
      setSkip(skip + limit);
    }
    // const currentButton = e?.target;
  };
  const tapButtons = [
    {
      name: <i className="icofont-layout"></i>,
      content: (
        <CoursesGrid isNotSidebar={isNotSidebar} courses={currentCourses} />
      ),
    },
    {
      name: <i className="icofont-listine-dots"></i>,
      content: (
        <CoursesList
          isNotSidebar={isNotSidebar}
          isList={isList}
          courses={currentCourses}
          card={card}
        />
      ),
    },
  ];
  useEffect(() => {
    const courses = JSON.parse(coursesString);

    const coursesToShow = [...courses].splice(skip, limit);
    setCurrentCourses(coursesToShow);
  }, [skip, limit, coursesString]);

  useEffect(() => {
    if (isList) {
      setCurrentIdx(1);
    }
  }, [isList, setCurrentIdx]);
  // handle filters
  const getCurrentFilterInputs = (input, ps) => {
    return input === "All" && !ps.includes("All")
      ? ["All"]
      : ![...ps]?.includes(input)
      ? [...ps.filter((pInput) => pInput !== "All"), input]
      : [...ps?.filter((pInput) => pInput !== input && pInput !== "All")];
  };
  const handleFilters = (name, input) => {
    setIsSearch(false);
    setSearchString("");
    switch (name) {
      case "Categories":
        return setCurrentCategories((ps) => getCurrentFilterInputs(input, ps));
      case "Blended Learning":
        return setCurrentBlendedLearning((ps) => getCurrentFilterInputs(input, ps));
      case "Tag":
        return setCurrentTags((ps) => getCurrentFilterInputs(input, ps));
      case "Skill Level":
        return setCurrentSkillLevel((ps) => getCurrentFilterInputs(input, ps));
    }
  };
  // handle serachProducts
  const handleSearchProducts = (e) => {
    setIsBlog(true);
    setCurrentCategories([]);
    setCurrentBlendedLearning([]);
    setCurrentTags([]);
    setCurrentSkillLevel([]);
    const value = e.target.value;
    setSearchString(value.toLowerCase());
  };
  // start search
  const startSearch = () => {
    serarchTimeoutRef.current = setTimeout(() => {
      const searchText = new RegExp(searchString, "i");
      let searchCourses;
      if (searchString) {
        setIsBlog(true);

        searchCourses = coursesBeforeFilter?.filter(({ title }) =>
          searchText.test(title)
        );
      } else {
        searchCourses = [];
      }

      setSearchCourses(searchCourses);
    }, 200);
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      <div
        className="container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        ref={coursesRef}
      >
        {/* Modern Courses Header */}
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8 p-4 sm:p-6"
          data-aos="fade-up"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Results Counter */}
            <div className="w-full sm:w-auto">
              {currentCourses ? (
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {totalCourses} Courses
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Showing {skip ? skip : skip + 1} -{" "}
                    {skip + limit >= totalCourses ? totalCourses : skip + limit} results
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* View Toggle and Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {tapButtons?.map(({ name, content }, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTabClick(idx)}
                    className={`${
                      currentIdx === idx
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                    } p-2 rounded-md transition-all duration-200`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <select
                className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                onChange={(e) => setSortInput(e.target.value)}
              >
                {sortInputs.map((input, idx) => (
                  <option key={idx} value={input}>
                    {input}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            isNotSidebar || category ? "" : "lg:grid-cols-12"
          } gap-8`}
        >
          {/* Modern Sidebar */}
          {isNotSidebar ? (
            ""
          ) : !category ? (
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Search Box */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  data-aos="fade-up"
                >
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Search Courses
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setIsSearch(true);
                      setSearchString("");
                    }}
                    className="relative"
                  >
                    <input
                      onChange={handleSearchProducts}
                      onKeyDown={() => {
                        clearTimeout(serarchTimeoutRef.current);
                        setIsBlog(false);
                      }}
                      onBlur={() => setIsBlog(false)}
                      onKeyUp={startSearch}
                      type="text"
                      value={searchString}
                      placeholder="Search courses..."
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <i className="icofont-search-1 text-lg"></i>
                    </button>

                    {/* Search Results Dropdown */}
                    {searchCourses?.length ? (
                      <div
                        className={`absolute z-20 left-0 right-0 mt-2 transition-all ${
                          searchCourses?.length && isBlock
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                          {[...searchCourses]
                            ?.slice(0, 5)
                            .map(({ id, title, image, price }, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    priority={false}
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/courses/${id}`}
                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate block"
                                  >
                                    {title}
                                  </Link>
                                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                                    ${price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </form>
                </div>

                {/* Filter Sections */}
                {filterIputs?.map(({ name, inputs }, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                    data-aos="fade-up"
                  >
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {name}
                    </h4>
                    <div className="space-y-3">
                      {name === "Categories"
                        ? inputs?.map(({ name: name2, totalCount }, idx1) => (
                            <button
                              key={idx1}
                              onClick={() => handleFilters(name, name2)}
                              className={`${
                                currentCategories.includes(name2)
                                  ? "bg-primary-500 text-white"
                                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary-500 hover:text-white"
                              } w-full px-4 py-2 rounded-lg flex justify-between items-center transition-all duration-200`}
                            >
                              <span className="text-sm font-medium truncate">
                                {name2}
                              </span>
                              <span className="text-sm font-medium">
                                {totalCount < 10 ? `0${totalCount}` : totalCount}
                              </span>
                            </button>
                          ))
                        : name === "Blended Learning"
                        ? inputs?.map(({ name: name2, totalCount }, idx1) => (
                            <button
                              key={idx1}
                              onClick={() => handleFilters(name, name2)}
                              className={`${
                                currentBlendedLearning.includes(name2)
                                  ? "bg-primary-500 text-white"
                                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary-500 hover:text-white"
                              } w-full px-4 py-2 rounded-lg flex justify-between items-center transition-all duration-200`}
                            >
                              <span className="text-sm font-medium truncate">
                                {name2}
                              </span>
                              <span className="text-sm font-medium">
                                {totalCount < 10 ? `0${totalCount}` : totalCount}
                              </span>
                            </button>
                          ))
                        : name === "Tag"
                        ? inputs?.map((input, idx1) => (
                            <label
                              key={idx1}
                              className="flex items-center space-x-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={currentTags.includes(input)}
                                onChange={() => handleFilters(name, input)}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {input}
                              </span>
                            </label>
                          ))
                        : inputs?.map((input, idx1) => (
                            <button
                              key={idx1}
                              onClick={() => handleFilters(name, input)}
                              className={`${
                                currentSkillLevel.includes(input)
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                              } block text-sm font-medium w-full text-left py-1 transition-colors`}
                            >
                              {input}
                            </button>
                          ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Courses Grid/List */}
          <div
            className={`${
              isNotSidebar || category
                ? ""
                : "lg:col-span-9"
            }`}
          >
            {currentCourses ? (
              <>
                <div className="space-y-6">
                  {tapButtons?.map(({ content }, idx) => (
                    <div
                      key={idx}
                      className={`${
                        idx === currentIdx ? "block" : "hidden"
                      }`}
                    >
                      {content}
                    </div>
                  ))}
                </div>

                {/* Modern Pagination */}
                {totalCourses > 11 ? (
                  <div className="mt-8">
                    <Pagination
                      pages={paginationItems}
                      totalItems={totalCourses}
                      handlePagesnation={handlePagesnation}
                      currentPage={currentPage}
                      skip={skip}
                      limit={limit}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <NoData message={"No Course"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPrimary;
