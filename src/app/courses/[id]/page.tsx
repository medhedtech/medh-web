import { Metadata } from "next";
import CourseDetailsMain from "@/components/layout/main/CourseDetailsMain";
import { apiBaseUrl, apiUrls } from '@/apis';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import courses from "@/../public/fakedata/courses.json";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  const course = courses?.find(({ id: courseId }) => courseId === parseInt(id));

  if (!course) {
    return {
      title: "Course Not Found | Medh",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | Medh - Upskill Your Career`,
    description: `Learn about ${course.title} at Medh. Enhance your skills today!`,
    keywords: `${course.title}, course details, enrollment, Medh courses`,
  };
}

const Course_Details = async ({ params }: PageProps) => {
  const { id } = params;
  const isExistCourse = courses?.find(({ id: courseId }) => courseId === parseInt(id));
  
  if (!isExistCourse) {
    notFound();
  }
  
  return (
    <PageWrapper>
      <main>
        <CourseDetailsMain id={id} courseId={id} />
      </main>
    </PageWrapper>
  );
};

export default Course_Details; 