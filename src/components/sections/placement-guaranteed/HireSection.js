import CourseCard from "../courses/CourseCard";
import PlacementImage1 from "../../../assets/images/placement/course-placement-1.jpg";
import PlacementImage2 from "../../../assets/images/placement/course-placement-2.jpg";

const coursesData = [
  {
    _id: "1",
    course_image: PlacementImage1,
    course_title: "Digital Marketing with Data Analytics",
    course_category: "Professional Edge Diploma In",
    course_duration: "6 months",
  },
  {
    _id: "2",
    course_image: PlacementImage2,
    course_title: "AI & Data Science",
    course_category: "Professional Edge Diploma In",
    course_duration: "18 Months Course",
  },
];

const HireSectionPlacement = () => {
  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10 w-full flex justify-center items-center">
      <div className="w-full md:w-[100%]">
        <div className="flex items-center flex-col w-80% md:mb-10 mb-5 px-4">
          <h1 className="text-[#5C6574] font-Poppins font-bold text-size-32">
            Empower Your Career Ambitions with
          </h1>
          <h1 className="text-[#7ECA9D] mt-[-12px] font-Poppins font-bold text-size-32">
            Medh Job Assurance Programs
          </h1>
          <p className="mt-6 text-gray-700 text-sm sm:text-base text-center font-normal md:text-lg w-[90%] sm:w-[75%] mx-auto">
            At Medh, we empower individuals through education, offering 100% Job
            Guaranteed Courses designed to provide in-demand skills for your
            dream job in your desired field.
          </p>
        </div>

        <div className="w-full bg-gray-100 py-4">
          <div className="flex items-center flex-col w-80% md:mb-10 mb-5 px-4">
            <h1 className="text-[#7ECA9D] font-Poppins font-bold text-size-32">
              Medh-Professional-Edge-Diploma-Courses
            </h1>
            <p className="text-center md:text-[1rem] text-gray-600 text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray-300">
              These courses integrate theoretical knowledge with practical
              application through corporate internships, equipping learners with
              essential tools to excel. Designed by industry experts, the
              curriculum ensures a relevant, up-to-date learning experience that
              leads to guaranteed corporate sector employment.
            </p>
          </div>
        </div>

        {/* Section for displaying Course Cards */}
        <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-20 px-4 pt-8 md:px-16 md:pt-16 bg-white dark:bg-screen-dark">
          {/* Render only the first two courses */}
          {coursesData.slice(0, 2).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </section>
        <div className="flex items-center flex-col w-80% md:mb-10 mb-5 px-4">
          {/* Move the paragraph outside of the loop, so it appears below both cards */}
          <p className="mt-6 text-gray-700 text-sm sm:text-base text-center font-normal md:text-lg w-[90%] sm:w-[75%] mx-auto">
            These courses integrate theoretical knowledge with practical
            application through corporate internships, equipping learners with
            essential tools to excel. Designed by industry experts, the
            curriculum ensures a relevant, up-to-date learning experience that
            leads to guaranteed corporate sector employment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HireSectionPlacement;
