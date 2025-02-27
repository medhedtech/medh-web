import { Suspense } from 'react';
import CoursesMain from "@/components/layout/main/CoursesMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { BookOpen, Users, Star, ChevronRight, Sparkles, Clock, Award } from 'lucide-react';

export const metadata = {
  title: "Courses | Medh - Education LMS Platform",
  description: "Discover a wide range of professional courses at Medh. From beginner to advanced levels, find the perfect course to enhance your skills.",
  keywords: "online courses, professional education, skill development, e-learning, Medh courses",
};

const Courses = async () => {
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      value: "500+",
      label: "Total Courses"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "50,000+",
      label: "Active Students"
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "4.8/5",
      label: "Average Rating"
    }
  ];

  // Additional features for the feature cards section
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "Learn from experts",
      description: "Get taught by industry professionals with real-world experience"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "Learn at your pace",
      description: "Access content 24/7 and study whenever works best for you"
    },
    {
      icon: <Award className="w-6 h-6 text-pink-400" />,
      title: "Get certified",
      description: "Earn recognized certificates to boost your resume"
    }
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
        {/* Hero Section with modern design */}
        <section className="relative w-full overflow-hidden bg-gradient-to-tr from-indigo-600 via-blue-700 to-purple-700 dark:from-indigo-900 dark:via-blue-900 dark:to-purple-900">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            {/* Enhanced animated circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-40 right-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-3000"></div>
            
            {/* Interactive grid pattern */}
            <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5 animate-pulse" style={{ animationDuration: '8s' }}></div>
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
          </div>

          {/* Content container */}
          <div className="container relative z-10 mx-auto px-4 h-full">
            <div className="flex flex-col items-center justify-center min-h-[90vh] py-20 text-center">
              {/* Enhanced live badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full mb-8 border border-white/10 shadow-lg transform hover:scale-105 transition-all group cursor-pointer">
                <span className="relative flex h-3 w-3 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-white text-sm font-medium tracking-wide group-hover:text-white/90 transition-colors">✨ Live Courses Available Now</span>
              </div>

              {/* Main heading with enhanced typography */}
              <div className="max-w-5xl mb-8 select-none">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
                  Level Up Your Skills
                  <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-gradient-x">
                    With Top-Tier Courses
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed mt-6">
                  Join our community of <span className="text-blue-200 font-semibold">50,000+ learners</span> and master the skills that drive tomorrow's innovation.
                </p>
              </div>

              {/* Enhanced CTA Section with improved buttons */}
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <a
                  href="#courses-section"
                  className="group relative px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transform hover:-translate-y-1 transition-all duration-300 flex items-center overflow-hidden"
                >
                  <span className="relative z-10 mr-2">Explore Courses</span>
                  <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a
                  href="/how-it-works"
                  className="group px-8 py-4 border-2 border-white/80 text-white rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                >
                  <span>How It Works</span>
                  <div className="w-1 h-1 rounded-full bg-white ml-2 group-hover:ml-3 transition-all"></div>
                </a>
              </div>

              {/* Enhanced Stats Section with improved cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 transform hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-colors shadow-inner">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-gray-700 dark:text-white/80 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced bottom curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 0L60 22.2222C120 44.4444 240 88.8889 360 111.111C480 133.333 600 133.333 720 111.111C840 88.8889 960 44.4444 1080 22.2222C1200 0 1320 0 1380 0H1440V200H1380C1320 200 1200 200 1080 200C960 200 840 200 720 200C600 200 480 200 360 200C240 200 120 200 60 200H0V0Z"
                fill="currentColor"
                className="text-gray-50 dark:text-gray-900"
              />
            </svg>
          </div>
        </section>

        {/* New Feature Cards Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Students <span className="text-primary-600 dark:text-primary-400">Love Us</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover the Medh difference and see why we're the platform of choice for the next generation of learners
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-gray-700">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section with improved loading state */}
        <section id="courses-section" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-primary-600 dark:text-primary-400 font-medium text-sm uppercase tracking-wider mb-2">Find Your Perfect Course</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Browse Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">Latest Courses</span>
              </h2>
            </div>
          
            <Suspense 
              fallback={
                <div className="flex h-96 items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-300 animate-spin" style={{ animationDuration: '2s' }}></div>
                    <p className="absolute top-full mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading amazing courses...</p>
                  </div>
                </div>
              }
            >
              <CoursesMain />
            </Suspense>
          </div>
        </section>

        {/* Theme Controller */}
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeController />
        </div>
      </main>
    </PageWrapper>
  );
};

export default Courses;
