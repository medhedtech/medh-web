'use client';

import React from 'react';
import { CourseContentAdapter } from '@/components/shared/course-content';

/**
 * AnimatedContent component for Vedic Mathematics course
 * This component now uses the shared CourseContentAdapter
 */
function AnimatedContent({ components, exploreJourneyProps }) {
  return (
    <CourseContentAdapter
      components={components}
      exploreJourneyProps={exploreJourneyProps}
      courseType="vedic-mathematics"
    />
  );
}

export default AnimatedContent; 