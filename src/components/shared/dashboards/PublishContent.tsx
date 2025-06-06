import CourseCard from "../courses/CourseCard";

interface Course {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_description: string;
  course_image: string;
  course_category: string;
  course_subcategory?: string;
  course_fee: number;
  course_duration: number;
  status: 'Draft' | 'Published' | 'Pending' | 'Archived';
  assigned_instructor?: {
    _id: string;
    full_name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  no_of_Sessions?: number;
  is_Certification?: string;
  is_Assignments?: string;
  is_Projects?: string;
  is_Quizes?: string;
  language?: string;
  course_grade?: string;
  class_type?: string;
}

interface PublishContentProps {
  courses: Course[];
  loading?: boolean;
}

const PublishContent: React.FC<PublishContentProps> = ({ courses, loading = false }) => {
  // Show loading skeleton
  if (loading) {
    return (
      <>
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="animate-pulse p-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
          </div>
        ))}
      </>
    );
  }

  // Show empty state
  if (!courses || courses.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="text-4xl mb-4">📖</div>
        <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
          No Published Courses
        </h3>
        <p className="text-grayColor dark:text-grayColor-dark">
          You don't have any published courses yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {courses.map((course, idx) => (
        <CourseCard key={course._id || idx} course={course} type={"primary"} />
      ))}
    </>
  );
};

export default PublishContent;
