'use client';

import React from "react";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import {
  CourseHeroBanner,
  AIAndDataScienceHero,
  DigitalMarketingHero,
  PersonalityDevelopmentHero,
  VedicMathematicsHero,
  COURSE_TYPES,
  COURSE_CONFIGS
} from "@/components/sections/hero-banners";

const TestCourseHeroPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Course Hero Banner Component Test
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Testing the unified hero banner component for all course types
            </p>
          </div>
        </div>

        {/* Course Type Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(COURSE_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    const element = document.getElementById(`hero-${key}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-4">
          {/* AI & Data Science */}
          <section id="hero-ai-data-science">
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI & Data Science Course Hero
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Course Type: {COURSE_TYPES.AI_DATA_SCIENCE}
                </p>
              </div>
            </div>
            <AIAndDataScienceHero />
          </section>

          {/* Digital Marketing */}
          <section id="hero-digital-marketing">
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Digital Marketing Course Hero
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Course Type: {COURSE_TYPES.DIGITAL_MARKETING}
                </p>
              </div>
            </div>
            <DigitalMarketingHero />
          </section>

          {/* Personality Development */}
          <section id="hero-personality-development">
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personality Development Course Hero
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Course Type: {COURSE_TYPES.PERSONALITY_DEVELOPMENT}
                </p>
              </div>
            </div>
            <PersonalityDevelopmentHero />
          </section>

          {/* Vedic Mathematics */}
          <section id="hero-vedic-mathematics">
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vedic Mathematics Course Hero
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Course Type: {COURSE_TYPES.VEDIC_MATHEMATICS}
                </p>
              </div>
            </div>
            <VedicMathematicsHero />
          </section>
        </div>

        {/* Component Information */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Component Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Features
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Unified design across all course types</li>
                  <li>• Course-specific color schemes</li>
                  <li>• Responsive design with mobile-first approach</li>
                  <li>• GPU-optimized animations</li>
                  <li>• Glassmorphism effects</li>
                  <li>• Dark mode support</li>
                  <li>• Accessibility features</li>
                  <li>• TypeScript support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Usage
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>
                    <strong>Import:</strong><br />
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      import {'{'} CourseHeroBanner {'}'} from '@/components/sections/hero-banners';
                    </code>
                  </p>
                  <p>
                    <strong>Basic Usage:</strong><br />
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      &lt;CourseHeroBanner courseType="ai-data-science" /&gt;
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TestCourseHeroPage; 