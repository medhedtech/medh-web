import React from 'react';
// @ts-ignore - CourseContentAdapter is a JavaScript component without TypeScript definitions
import { CourseContentAdapter } from '@/components/shared/course-content';

/**
 * Props interface for components passed to AnimatedContent
 */
interface IAnimatedContentComponents {
  /** Course banner component */
  CourseBanner?: React.ComponentType<any>;
  /** Course overview component */
  CourseAiOverview?: React.ComponentType<any>;
  /** Course options/content component */
  CourseOptions?: React.ComponentType<any>;
  /** Course FAQ component */
  CourseAiFaq?: React.ComponentType<any>;
  /** Course related courses component */
  CourseAiRelatedCourses?: React.ComponentType<any>;
  /** Theme controller component */
  ThemeController?: React.ComponentType<any>;
  /** Any additional components */
  [key: string]: React.ComponentType<any> | undefined;
}

/**
 * Props interface for explore journey configuration
 */
interface IExploreJourneyProps {
  /** Main text for the explore journey section */
  mainText?: string;
  /** Sub text for the explore journey section */
  subText?: string;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Props interface for banner configuration
 */
interface IBannerProps {
  /** Badge text */
  badge?: string;
  /** Main title */
  title?: string;
  /** Highlighted portion of the title */
  titleHighlight?: string;
  /** Description text */
  description?: string;
  /** Enrollment path URL */
  enrollmentPath?: string;
  /** Statistics array */
  stats?: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
  }>;
  /** Features array */
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  /** Main banner image */
  mainImage?: any;
  /** Student image */
  studentImage?: any;
  /** Theme classes configuration */
  themeClasses?: {
    badge?: string;
    badgeContainer?: string;
    title?: string;
    button?: string;
    secondaryButton?: string;
    gradientFrom?: string;
    gradientVia?: string;
    gradientTo?: string;
    backgroundPrimary?: string;
    backgroundSecondary?: string;
  };
  /** Additional banner properties */
  [key: string]: any;
}

/**
 * Props interface for AnimatedContent component
 */
interface IAnimatedContentProps {
  /** Component registry for dynamic rendering */
  components: IAnimatedContentComponents;
  /** Configuration for explore journey section */
  exploreJourneyProps?: IExploreJourneyProps;
  /** Configuration for banner section */
  bannerProps?: IBannerProps;
}

/**
 * AnimatedContent component for AI and Data Science course
 * 
 * This component serves as a specialized wrapper for the AI and Data Science course,
 * utilizing the shared CourseContentAdapter with course-specific configurations.
 * It provides a clean interface for rendering course content with consistent animations
 * and layout patterns while maintaining type safety.
 * 
 * @param props - The component props
 * @returns React element containing the course content
 */
function AnimatedContent({ 
  components, 
  exploreJourneyProps, 
  bannerProps 
}: IAnimatedContentProps): React.ReactElement {
  return (
    <CourseContentAdapter
      components={components}
      exploreJourneyProps={exploreJourneyProps}
      bannerProps={bannerProps}
      courseType="ai-data-science"
      disableScrollToTop={true}
    />
  );
}

export default AnimatedContent;
export type { 
  IAnimatedContentProps, 
  IAnimatedContentComponents, 
  IExploreJourneyProps, 
  IBannerProps 
};
