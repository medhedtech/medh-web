'use client';

import { Cpu, Database, Brain, Star, Users, BookOpen } from 'lucide-react';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseBanner from "@/components/shared/banners/CourseBanner";
import ThemeController from "@/components/shared/others/ThemeController";

// Section components
import CourseAiOverview from "@/components/sections/course-ai/courseai-overview";
import CourseAiCourseBanner from "@/components/sections/course-ai/courseAiCourseBanner";
import CourseAiFaq from "@/components/sections/course-ai/courseAiFaq";
import CourseAiRelatedCourses from "@/components/sections/course-ai/courseAiRelatedCourse";
import CourseOptions from "@/components/sections/course-ai/courseOptions";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import AnimatedContent from './AnimatedContent';

// Assets
import Banner from "@/assets/Header-Images/ai-and-data/ai-with-data-science.png";
import DevelopmentImg from "@/assets/Header-Images/ai-and-data/image-3rd.jpg";

function CourseAi() {
  const bannerProps = {
    badge: "New Course",
    title: "Artificial Intelligence &",
    titleHighlight: "Data Science",
    description: "Gain in-depth knowledge and hands-on experience to excel in the dynamic world of technology and analytics.",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-primary-500 animate-pulse-slow" />,
        value: "1000+",
        label: "Students Enrolled"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500 animate-bounce-slow" />,
        value: "4.8/5",
        label: "Course Rating"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-primary-500 animate-pulse-slow" />,
        value: "24+",
        label: "Modules"
      }
    ],
    features: [
      {
        icon: <Cpu className="w-6 h-6 text-primary-500" />,
        title: "Machine Learning",
        description: "Advanced algorithms and models"
      },
      {
        icon: <Database className="w-6 h-6 text-primary-500" />,
        title: "Data Science",
        description: "Data analysis and visualization"
      },
      {
        icon: <Brain className="w-6 h-6 text-primary-500" />,
        title: "Neural Networks",
        description: "Deep learning architectures"
      }
    ],
    mainImage: Banner,
    studentImage: DevelopmentImg,
    theme: {
      primary: 'blue',
      secondary: 'indigo'
    }
  };

  return (
    <PageWrapper>
      <AnimatedContent 
        components={{
          CourseBanner,
          CourseAiOverview,
          CourseOptions,
          CourseAiFaq,
          CourseAiCourseBanner,
          CourseAiRelatedCourses,
          ExploreJourney,
          ThemeController
        }}
        exploreJourneyProps={{
          mainText: "Master AI & Data Science. Future-proof Your Career.",
          subText: "Enroll Now!"
        }}
        bannerProps={bannerProps}
      />
    </PageWrapper>
  );
}

export default CourseAi;
