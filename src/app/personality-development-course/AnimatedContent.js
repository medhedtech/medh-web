'use client';

import SharedAnimatedContent from '@/components/shared/course-content/AnimatedContent';

/**
 * AnimatedContent component for Personality Development course
 * This component now uses the shared CourseContentAdapter
 */
const AnimatedContent = ({ components, exploreJourneyProps, bannerProps }) => {
  // Map the personality development components to the shared component structure
  const mappedComponents = {
    CourseBanner: components.CourseBanner,
    CourseContent: components.PersonalityCourse,
    CourseOverview: components.PersonalityOvereveiw,
    CourseFAQ: components.PersonalityFaq,
    CourseRelatedCourses: components.PersonalityRelatedCourse,
    ThemeController: components.ThemeController
  };

  // Options for the shared component
  const options = {
    ctaGradientColors: ["primary-500/10", "indigo-500/10", "purple-500/10"]
  };

  return (
    <SharedAnimatedContent
      components={mappedComponents}
      bannerProps={bannerProps}
      options={options}
    />
  );
};

export default AnimatedContent; 