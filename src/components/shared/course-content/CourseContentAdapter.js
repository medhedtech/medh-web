'use client';

import React from 'react';
import AnimatedContent from './AnimatedContent';

/**
 * Adapter component to transition from course-specific AnimatedContent components to the shared one
 * 
 * This component maps course-specific component names to the standardized names used by the shared AnimatedContent component
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element}
 */
function CourseContentAdapter(props) {
  const { 
    components,
    exploreJourneyProps = {}, 
    bannerProps = {},
    courseType = 'default',
    ...rest 
  } = props;

  // Different course types and their component mapping configurations
  const courseConfigs = {
    // Digital Marketing course
    'digital-marketing': {
      componentMap: {
        // Map from Digital Marketing component names to standard names
        CourseBanner: components.DigiMarketingBanner,
        CourseOverview: components.DigiMarketingOverview,
        CourseContent: components.DigiMarketingCource,
        CourseFAQ: components.DigiMarketingFaq,
        // CourseContentBanner: components.DigiMarketingCourceBanner,
        CourseRelatedCourses: components.DigiMarketingRalatedCource,
        // ExploreJourney: components.ExploreJourney,
        ThemeController: components.ThemeController
      },
      options: {
        ctaGradientColors: ["cyan-500/10", "blue-500/10", "purple-500/10"],
        accentColor: "cyan-500",
        hoverAccentColor: "cyan-600"
      }
    },
    
    // Vedic Mathematics course
    'vedic-mathematics': {
      componentMap: {
        // Map from Vedic Mathematics component names to standard names
        CourseBanner: components.VedicBanner,
        CourseOverview: components.VedicOverview,
        CourseContent: components.VedicCource,
        CourseFAQ: components.VedicFaq,
        // CourseContentBanner: components.VedicCourceBanner,
        CourseRelatedCourses: components.VedicRalatedCource,
        // ExploreJourney: components.ExploreJourney,
        ThemeController: components.ThemeController
      },
      options: {
        ctaGradientColors: ["yellow-500/10", "orange-500/10", "red-500/10"],
        accentColor: "orange-500",
        hoverAccentColor: "orange-600"
      }
    },
    
    // Personality Development course
    'personality-development': {
      componentMap: {
        // Map from Personality Development component names to standard names
        CourseBanner: components.CourseBanner,
        CourseOverview: components.PersonalityOverview,
        CourseContent: components.PersonalityCourse,
        CourseFAQ: components.PersonalityFaq,
        // CourseContentBanner: components.PersonalityCourseBanner,
        CourseRelatedCourses: components.PersonalityRelatedCourse,
        // ExploreJourney: components.ExploreJourney,
        ThemeController: components.ThemeController
      },
      options: {
        ctaGradientColors: ["purple-500/10", "pink-500/10", "fuchsia-500/10"],
        accentColor: "purple-500",
        hoverAccentColor: "purple-600",
        springAnimation: {
          type: "spring",
          stiffness: 500,
          damping: 25
        }
      }
    },
    
    // AI and Data Science course
    'ai-data-science': {
      componentMap: {
        // Map from AI and Data Science component names to standard names
        CourseBanner: components.CourseBanner,
        CourseOverview: components.CourseAiOverview,
        CourseContent: components.CourseOptions,
        CourseFAQ: components.CourseAiFaq,
        // CourseContentBanner: components.CourseAiCourseBanner,
        CourseRelatedCourses: components.CourseAiRelatedCourses,
        // ExploreJourney: components.ExploreJourney,
        ThemeController: components.ThemeController
      },
      options: {
        ctaGradientColors: ["blue-500/10", "indigo-500/10", "purple-500/10"],
        accentColor: "primary-500",
        hoverAccentColor: "primary-600"
      }
    },
    
    // Default course (fallback)
    'default': {
      componentMap: components,
      options: {}
    }
  };

  // Get the configuration for the current course type or use default
  const courseConfig = courseConfigs[courseType] || courseConfigs.default;
  
  return (
    <AnimatedContent
      components={courseConfig.componentMap}
      // exploreJourneyProps={exploreJourneyProps}
      bannerProps={bannerProps}
      options={courseConfig.options}
      {...rest}
    />
  );
}

export default CourseContentAdapter; 