import { Suspense } from 'react';
import CoursesFilter from "@/components/sections/courses/CoursesFilter";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { BookOpen, Users, Star, ChevronRight, Sparkles, Clock, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Professional Courses | Medh - Upskill Your Career",
  description: "Discover industry-leading professional courses at Medh. From AI & Data Science to Digital Marketing, find the perfect course to advance your career.",
  keywords: "professional courses, skill development, career advancement, online learning, Medh education",
};

const Courses = async () => {
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-400" />,
      value: "20+",
      label: "Professional Courses"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400" />,
      value: "1000+",
      label: "Active Learners"
    },
    {
      icon: <Star className="w-6 h-6 text-primary-400" />,
      value: "4.9/5",
      label: "Average Rating"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary-400" />,
      title: "Expert-Led Training",
      description: "Learn from industry professionals with proven expertise"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary-400" />,
      title: "Flexible Learning",
      description: "Study at your own pace with lifetime access to course content"
    },
    {
      icon: <Award className="w-6 h-6 text-primary-400" />,
      title: "Industry Recognition",
      description: "Earn certificates valued by top employers globally"
    }
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

        {/* Courses Section */}
        <section id="courses-section" className="w-full py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="w-full">
            <Suspense 
              fallback={
                <div className="flex h-96 items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDuration: '2s' }}></div>
                  </div>
                </div>
              }
            >
              <CoursesFilter 
                CustomText="Professional Courses"
                CustomButton={
                  <div className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md">
                    View All Categories
                  </div>
                }
                // description="Explore our comprehensive range of professional courses designed to enhance your career prospects and industry expertise."
              />
            </Suspense>
          </div>
        </section>

        {/* Theme Controller */}
        <div className="fixed bottom-6 right-6 z-50">
          
        </div>
      </main>
    </PageWrapper>
  );
};

export default Courses;
