'use client';

import React from 'react';
import type { FC, ReactElement } from 'react';
import SharedAnimatedContent from '@/components/shared/course-content/AnimatedContent';

interface IAnimatedContentProps {
  components: {
    CourseBanner: () => ReactElement;
    PersonalityOvereveiw: FC<any>;
    PersonalityCourse: FC<any>;
    PersonalityFaq: FC<any>;
    PersonalityRelatedCourse: FC<any>;
    ThemeController: FC<any>;
    ExploreJourney: FC<any>;
  };
  exploreJourneyProps: {
    mainText: string;
    subText: string;
  };
  bannerProps: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    enrollmentPath: string;
    stats: Array<{
      icon: ReactElement;
      value: string;
      label: string;
    }>;
    features: Array<{
      icon: ReactElement;
      title: string;
      description: string;
    }>;
    mainImage: string;
    studentImage: string;
    themeClasses: {
      badge: string;
      badgeContainer: string;
      title: string;
      button: string;
      secondaryButton: string;
      gradientFrom: string;
      gradientVia: string;
      gradientTo: string;
      backgroundPrimary: string;
      backgroundSecondary: string;
    };
  };
}

const AnimatedContent: FC<IAnimatedContentProps> = ({ 
  components, 
  exploreJourneyProps, 
  bannerProps 
}) => {
  const mappedComponents = {
    CourseBanner: components.CourseBanner,
    CourseContent: components.PersonalityCourse,
    CourseOverview: components.PersonalityOvereveiw,
    CourseFAQ: components.PersonalityFaq,
    CourseRelatedCourses: components.PersonalityRelatedCourse,
    ThemeController: components.ThemeController,
    ExploreJourney: components.ExploreJourney
  };

  const options = {
    ctaGradientColors: ["primary-500/10", "indigo-500/10", "purple-500/10"],
    layout: {
      contentWidth: "max-w-none w-full px-0",
      spacing: "space-y-8 md:space-y-12 lg:space-y-16",
      sectionPadding: "px-0",
      filters: {
        container: "w-full max-w-none px-0",
        content: "w-full",
        gradeFilter: {
          wrapper: "w-full border-0",
          dropdown: "w-full rounded-xl shadow-lg",
          header: "p-5 bg-purple-50 dark:bg-purple-900/20",
          content: "p-4 space-y-3",
          option: "p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        }
      }
    }
  };

  return (
    <SharedAnimatedContent
      components={mappedComponents}
      bannerProps={bannerProps}
      options={options}
      exploreJourneyProps={exploreJourneyProps}
    />
  );
};

export default AnimatedContent; 