import CourseCard from "./CourseCard";

const CoursesGrid = ({ courses, isNotSidebar }) => {
  return (
    <div
      className={`grid grid-cols-1 ${
        isNotSidebar
          ? "sm:grid-cols-2 xl:grid-cols-3"
          : "sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
      }   gap-30px`}
    >
      {courses?.length ? (
        courses?.map((course, idx) => (
          <CourseCard key={idx} course={course} type={"primaryMd"} />
        ))
      ) : (
        <div className="col-span-full w-full p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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

export default CoursesGrid;
