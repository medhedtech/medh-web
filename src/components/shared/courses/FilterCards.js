import FilterCourseCard from "../../sections/courses/FilterCourseCard";
import getAllCourses from "@/libs/getAllCourses";

const FilterCards = ({ type, courses: propCourses, customClassName = "" }) => {
  const allCourses = getAllCourses();
  const courses = propCourses || (type === "lg" ? allCourses?.slice(0, 8) : allCourses?.slice(0, 6));
  const filterOptions = [
    "filter1 filter3",
    "filter2 filter3",
    "filter4 filter5",
    "filter4",
    "filter1 filter3",
    "filter2 filter5",
    "filter4 filter5",
    "filter4",
  ];

  // Grid classes for responsive layout
  const gridClasses = customClassName.includes('course-grid') 
    ? `${customClassName}` 
    : `filter-contents flex flex-wrap sm:-mx-15px box-content mt-7 lg:mt-25px ${customClassName}`;

  return (
    <div
      className={gridClasses}
      data-aos="fade-up"
      style={customClassName.includes('course-grid') ? {
        display: 'grid',
        width: '100%',
        margin: '0',
        gap: '1rem',
        placeItems: 'stretch',
        justifyContent: 'stretch'
      } : undefined}
    >
      {courses?.length ? (
        courses.map((course, idx) => {
          // Transform API course data to match CourseCard expected format
          const transformedCourse = {
            ...course,
            // Required fields for CourseCard.tsx
            _id: course._id || course.id || `course-${idx}`,
            course_title: course.course_title || course.title || "Course Title",
            course_image: course.course_image || course.image || "/placeholder-course.jpg",
            course_category: course.course_category || course.category || "General",
            course_description: course.course_description || course.program_overview || course.description || "Course description not available",
            course_duration: course.course_duration || course.duration || "Duration not specified",
            course_sessions: course.no_of_Sessions?.toString() || course.lesson?.toString() || "0",
            is_Certification: course.is_Certification || "No",
            is_Assignments: course.is_Assignments || "No", 
            is_Projects: course.is_Projects || "No",
            is_Quizes: course.is_Quizes || "No",
            isFree: course.isFree || false,
            prices: course.prices || [],
            brochures: course.brochures || [],
            meta: course.meta || { views: 0 },
            class_type: course.class_type || "Blended",
            
            // Legacy fields for backward compatibility
            id: course._id || course.id || idx,
            title: course.course_title || course.title,
            description: course.course_description || course.program_overview || course.description,
            instructor: course.instructor_name || course.instructor || "MEDH Instructor",
            insName: course.instructor_name || course.insName || "MEDH Instructor",
            category: course.course_category || course.category,
            image: course.course_image || course.image,
            insImg: course.instructor_image || course.insImg || course.course_image || course.image,
            price: course.course_fee || (course.prices && course.prices.length > 0 ? course.prices[0].individual : null) || course.price || 0,
            duration: course.course_duration || course.duration,
            lesson: course.no_of_Sessions || course.lesson || 0,
            featured: course.featured || false,
            grade: course.course_grade,
            classType: course.class_type,
            certification: course.is_Certification,
            assignments: course.is_Assignments,
            projects: course.is_Projects,
            quizzes: course.is_Quizes,
            filterOption: filterOptions[idx % filterOptions.length],
          };

          return (
            <FilterCourseCard
              key={transformedCourse._id}
              course={transformedCourse}
              variant="standard"
              classType={transformedCourse.class_type}
              showDuration={true}
              hidePrice={false}
              hideDescription={false}
              index={idx}
              isLCP={idx < 2}
            />
          );
        })
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default FilterCards;
