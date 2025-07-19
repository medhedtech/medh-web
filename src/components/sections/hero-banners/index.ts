// Main unified hero banner component
export { default as CourseHeroBanner } from './CourseHeroBanner';

// Pre-configured course-specific hero components
export {
  AIAndDataScienceHero,
  DigitalMarketingHero,
  PersonalityDevelopmentHero,
  VedicMathematicsHero,
  CourseHeroExamples
} from './CourseHeroExamples';

// Types and interfaces
export type { ICourseHeroBannerProps } from './CourseHeroBanner';

// Course type constants
export const COURSE_TYPES = {
  AI_DATA_SCIENCE: 'ai-data-science',
  DIGITAL_MARKETING: 'digital-marketing',
  PERSONALITY_DEVELOPMENT: 'personality-development',
  VEDIC_MATHEMATICS: 'vedic-mathematics'
} as const;

// Course configurations for reference
export const COURSE_CONFIGS = {
  'ai-data-science': {
    name: 'AI & Data Science',
    colors: ['blue', 'purple', 'indigo'],
    badge: 'New Course'
  },
  'digital-marketing': {
    name: 'Digital Marketing with Data Analytics',
    colors: ['cyan', 'blue', 'purple'],
    badge: 'Trending'
  },
  'personality-development': {
    name: 'Personality Development',
    colors: ['emerald', 'green', 'teal'],
    badge: 'All Ages Welcome'
  },
  'vedic-mathematics': {
    name: 'Vedic Mathematics',
    colors: ['amber', 'orange', 'yellow'],
    badge: 'All Ages Welcome'
  }
} as const; 