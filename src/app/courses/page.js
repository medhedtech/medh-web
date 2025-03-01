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
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 pt-24 md:pt-28">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-40 left-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div className="absolute top-60 right-10 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
          </div>

          {/* Content container */}
          <div className="relative z-10 w-full max-w-[2100px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] py-20 text-center">
              {/* Live badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full mb-8 border border-white/10 shadow-lg transform hover:scale-105 transition-all">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
                <span className="text-white text-sm font-medium">Live Professional Courses Available</span>
              </div>

              {/* Main heading - Adjusted spacing */}
              <div className="max-w-4xl mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                  Transform Your Career with
                  <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                    Professional Skills
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Join our expert-led professional courses and master the skills that drive industry innovation
                </p>
              </div>

              {/* CTA Buttons - Adjusted spacing */}
              <div className="flex flex-wrap justify-center gap-6 mb-20">
                <a
                  href="#courses-section"
                  className="group inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/25 hover:-translate-y-0.5"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Learn More
                  <ChevronRight className="ml-2" />
                </a>
              </div>

              {/* Stats Section - Updated spacing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto mb-12">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-white dark:bg-gray-900">
          <div className="max-w-[2100px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose <span className="text-primary-600 dark:text-primary-400">Medh</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                Experience professional education designed for the modern learner
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-gray-700">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                description="Explore our comprehensive range of professional courses designed to enhance your career prospects and industry expertise."
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
