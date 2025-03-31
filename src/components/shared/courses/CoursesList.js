import React from "react";
import CourseCard2 from "./CourseCard2";

const CoursesList = ({ courses, card, isList, isNotSidebar }) => {
  return (
    <div className="flex flex-col gap-30px">
      {courses?.length ? (
        courses?.map((course, idx) => (
          <CourseCard2
            key={idx}
            course={course}
            isList={isList}
            card={card}
            isNotSidebar={isNotSidebar}
          />
        ))
      ) : (
        <div className="w-full p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No courses found. Try changing your filters.</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
