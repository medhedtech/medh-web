import React from 'react';
import { CourseContentAdapter } from '@/components/shared/course-content';

/**
 * AnimatedContent component for AI and Data Science course
 * This component now uses the shared CourseContentAdapter
 */
function AnimatedContent({ components, exploreJourneyProps, bannerProps }) {
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