import { Metadata } from 'next';
import { getCourseById } from '@/apis/courses';
import { ICourse, ICourseWeek } from '@/types/course.types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const id = params?.id;
    if (!id) return notFound();

    const course = await getCourseById(id);

    return {
      title: course.course_title,
      description: course.course_description.program_overview,
      openGraph: {
        title: course.course_title,
        description: course.course_description.program_overview,
        images: [course.course_image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  try {
    const id = params?.id;
    if (!id) return notFound();

    const course = await getCourseById(id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Course Header */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.course_title}</h1>
            <p className="text-gray-600 mb-6">{course.course_description.program_overview}</p>
            
            {/* Course Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-semibold">Duration</h3>
                <p>{course.course_duration}</p>
              </div>
              <div>
                <h3 className="font-semibold">Level</h3>
                <p>{course.course_level}</p>
              </div>
              <div>
                <h3 className="font-semibold">Language</h3>
                <p>{course.language}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{course.course_category}</p>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              {course.curriculum.map((week: ICourseWeek) => (
                <div key={week.id} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Week {week.weekNumber}: {week.weekTitle}
                  </h3>
                  <p className="text-gray-600 mb-4">{week.weekDescription}</p>
                  <ul className="list-disc list-inside">
                    {week.topics.map((topic: string, index: number) => (
                      <li key={index} className="mb-2">{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <Image 
                src={course.course_image} 
                alt={course.course_title}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  {course.isFree ? 'Free' : `$${course.course_fee}`}
                </h3>
                {course.prices.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Group discounts available
                  </p>
                )}
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Enroll Now
              </button>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">This course includes:</h4>
                <ul className="space-y-2">
                  {course.is_Certification === 'Yes' && (
                    <li>✓ Certificate of completion</li>
                  )}
                  {course.is_Assignments === 'Yes' && (
                    <li>✓ Practice assignments</li>
                  )}
                  {course.is_Projects === 'Yes' && (
                    <li>✓ Hands-on projects</li>
                  )}
                  {course.is_Quizes === 'Yes' && (
                    <li>✓ Interactive quizzes</li>
                  )}
                  <li>✓ {course.no_of_Sessions} live sessions</li>
                  <li>✓ Lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading course:', error);
    return notFound();
  }
} 