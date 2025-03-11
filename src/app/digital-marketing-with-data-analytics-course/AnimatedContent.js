'use client';

import React from 'react';
import { CourseContentAdapter } from '@/components/shared/course-content';

/**
 * AnimatedContent component for Digital Marketing course
 * This component now uses the shared CourseContentAdapter
 */
function AnimatedContent({ components, exploreJourneyProps }) {
  return (
    <CourseContentAdapter
      components={components}
      exploreJourneyProps={exploreJourneyProps}
      courseType="digital-marketing"
    />
  );
}

export default AnimatedContent; 