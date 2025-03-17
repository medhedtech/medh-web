import CourseDetailsMain from "@/components/layout/main/CourseDetailsMain";
import { generateCourseMetadata } from '@/config/metadata';
import { apiBaseUrl, apiUrls } from '@/apis';

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import courses from "@/../public/fakedata/courses.json";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Course Details | Medh - Education LMS Template",
  description: "Course Details | Medh - Education LMS Template",
};

const Course_Details = async ({ params }) => {
  const { id } = params;
  const isExistCourse = courses?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistCourse) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <CourseDetailsMain id={id} />
        
      </main>
    </PageWrapper>
  );
};

export async function generateStaticParams() {
  return courses?.map(({ id }) => ({ id: id.toString() }));
}

export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const res = await fetch(`${apiBaseUrl}${apiUrls.Courses.getCourseById(id)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await res.json();
    
    if (!data.success) {
      return generateCourseMetadata({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        noIndex: true
      });
    }
    
    const course = data.data;
    
    return generateCourseMetadata({
      title: course.title,
      description: course.description || `Learn ${course.title} with expert instructors at MEDH`,
      instructor: course.instructor?.name || 'MEDH Expert',
      category: course.category,
      price: course.price,
      image: course.thumbnail || '/images/courses/default.png',
      keywords: [
        course.category,
        'online course',
        'professional development',
        course.title.toLowerCase(),
        ...course.tags || []
      ]
    });
  } catch (error) {
    console.error("Error fetching course metadata:", error);
    return generateCourseMetadata({
      title: "Error Loading Course",
      description: "There was an error loading this course.",
      noIndex: true
    });
  }
}

export default Course_Details;
