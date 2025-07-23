"use client";

import React from "react";
import { Database, Brain, Rocket, BarChart, Globe, Target, Users, Star, Heart, Calculator, Gauge, Zap } from 'lucide-react';
import CourseHeroBanner from './CourseHeroBanner';

// AI & Data Science Course Example
export const AIAndDataScienceHero: React.FC = () => {
  const features = [
    {
      icon: <Database className="w-7 h-7 text-blue-500 gpu-accelerated" />,
      title: "Data Science",
      description: "Master data analysis, visualization, and statistical modeling with Python, R, and advanced analytics tools"
    },
    {
      icon: <Brain className="w-7 h-7 text-blue-500 gpu-accelerated" />,
      title: "Machine Learning",
      description: "Build intelligent systems using ML algorithms, neural networks, and deep learning frameworks"
    },
    {
      icon: <Rocket className="w-7 h-7 text-blue-500 gpu-accelerated" />,
      title: "AI Applications",
      description: "Develop real-world AI solutions for computer vision, NLP, and automation technologies"
    }
  ];

  return (
    <CourseHeroBanner
      courseType="ai-data-science"
      title="AI & Data Science"
      description={
        <>
          Supercharge your career with cutting-edge AI and Data Science skills. Master machine 
          <br className="hidden sm:inline" />
          data analysis, and AI technologies that are transforming industries worldwide.
        </>
      }
      features={features}
      enrollmentPath="/enrollment/ai-and-data-science"
      badge="New Course"
    />
  );
};

// Digital Marketing Course Example
export const DigitalMarketingHero: React.FC = () => {
  const features = [
    {
      icon: <BarChart className="w-7 h-7 text-cyan-500 gpu-accelerated" />,
      title: "Data Analytics",
      description: "Master Google Analytics, social media insights, and marketing performance tracking"
    },
    {
      icon: <Globe className="w-7 h-7 text-cyan-500 gpu-accelerated" />,
      title: "Digital Strategy",
      description: "Develop comprehensive digital marketing campaigns across multiple platforms"
    },
    {
      icon: <Target className="w-7 h-7 text-cyan-500 gpu-accelerated" />,
      title: "SEO & SEM",
      description: "Optimize websites for search engines and manage paid advertising campaigns"
    }
  ];

  return (
    <CourseHeroBanner
      courseType="digital-marketing"
      title="Digital Marketing with Data Analytics"
      description={
        <>
          Transform your marketing career with data-driven strategies. Learn SEO,social 
          <br className="hidden sm:inline" />
          media marketing, analytics, and campaign optimization for the digital age.
        </>
      }
      features={features}
      enrollmentPath="/enrollment/digital-marketing"
      badge="Trending"
    />
  );
};

// Personality Development Course Example
export const PersonalityDevelopmentHero: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-7 h-7 text-emerald-500 gpu-accelerated" />,
      title: "Communication Skills",
      description: "Master public speaking, interpersonal communication, and presentation techniques"
    },
    {
      icon: <Star className="w-7 h-7 text-emerald-500 gpu-accelerated" />,
      title: "Leadership Development",
      description: "Build confidence, decision-making skills, and team management abilities"
    },
    {
      icon: <Heart className="w-7 h-7 text-emerald-500 gpu-accelerated" />,
      title: "Personal Growth",
      description: "Develop emotional intelligence, self-awareness, and positive mindset"
    }
  ];

  return (
    <CourseHeroBanner
      courseType="personality-development"
      title="Personality Development"
      description={
        <>
          Transform your personality and unlock your potential with expert-led training 
          <br className="hidden sm:inline" />
          that builds confidence, communication skills, and leadership qualities.
        </>
      }
      features={features}
      enrollmentPath="/enrollment/personality-development"
      badge="All Ages Welcome"
    />
  );
};

// Vedic Mathematics Course Example
export const VedicMathematicsHero: React.FC = () => {
  const features = [
    {
      icon: <Calculator className="w-7 h-7 text-amber-500 gpu-accelerated" />,
      title: "Mental Calculation",
      description: "Master ancient Vedic techniques for lightning-fast mental arithmetic"
    },
    {
      icon: <Brain className="w-7 h-7 text-amber-500 gpu-accelerated" />,
      title: "Cognitive Enhancement",
      description: "Improve memory, concentration, and logical thinking abilities"
    },
    {
      icon: <Gauge className="w-7 h-7 text-amber-500 gpu-accelerated" />,
      title: "Speed Mathematics",
      description: "Solve complex mathematical problems quickly and accurately"
    }
  ];

  return (
    <CourseHeroBanner
      courseType="vedic-mathematics"
      title="Vedic Mathematics"
      description={
        <>
          Discover ancient wisdom for modern problem-solving. Learn Vedic mathematics 
          <br className="hidden sm:inline" />
          techniques that make complex calculations simple and enjoyable.
        </>
      }
      features={features}
      enrollmentPath="/enrollment/vedic-mathematics"
      badge="All Ages Welcome"
    />
  );
};

// Usage Examples Component
export const CourseHeroExamples: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">AI & Data Science Course Hero</h2>
        <AIAndDataScienceHero />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Digital Marketing Course Hero</h2>
        <DigitalMarketingHero />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Personality Development Course Hero</h2>
        <PersonalityDevelopmentHero />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Vedic Mathematics Course Hero</h2>
        <VedicMathematicsHero />
      </div>
    </div>
  );
};

export default CourseHeroExamples; 