'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, Users, Award, CreditCard, Star, BookOpen, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

// Core components
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import Preloader from "@/components/shared/others/Preloader";
import VedicBanner from "@/components/sections/vedic-mathematics/vedicBanner";
import VedicOverview from "@/components/sections/vedic-mathematics/vedicOverview";
import VedicFaq from "@/components/sections/vedic-mathematics/vedicFaq";

// API and utilities
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

// Import custom styles
import './styles.css';
import VedicCource from '@/components/sections/vedic-mathematics/vedicCource';

// Animations
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Duration options based on actual course offerings
const DURATION_OPTIONS = [
  { id: 'short', name: '3 Months (12 weeks)', label: 'Quick Learning', description: 'Perfect for beginners looking to quickly grasp core Vedic Mathematics concepts' },
  { id: 'medium', name: '6 Months (24 weeks)', label: 'Comprehensive', description: 'Deeper understanding with extensive practice and application' },
  { id: 'long', name: '9 Months (36 weeks)', label: 'Complete Mastery', description: 'Master all aspects of Vedic Mathematics with advanced techniques' }
];

// Grade options
const GRADE_OPTIONS = [
  { id: 'grade5-6', label: 'Grade 5-6', description: 'Fundamental concepts tailored for younger students' },
  { id: 'grade7-8', label: 'Grade 7-8', description: 'Advanced concepts for middle school students' }
];

// Utility functions
const formatDuration = (duration) => {
  if (!duration) return 'Self-paced';
  return duration;
};

const formatPrice = (price) => {
  if (!price) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper to extract weeks and months from duration string
const parseDuration = (durationString) => {
  if (!durationString) return { months: 0, weeks: 0 };
  
  const monthsMatch = durationString.match(/(\d+)\s*months?/i);
  const weeksMatch = durationString.match(/(\d+)\s*weeks?/i);
  
  return {
    months: monthsMatch ? parseInt(monthsMatch[1]) : 0,
    weeks: weeksMatch ? parseInt(weeksMatch[1]) : 0
  };
};

// Duration filter function
const getDurationFilter = (selectedDuration) => {
  switch (selectedDuration) {
    case 'short':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months <= 3;
      };
    case 'medium':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months > 3 && months <= 6;
      };
    case 'long':
      return (course) => {
        const { months } = parseDuration(course.course_duration);
        return months > 6;
      };
    default:
      return () => true; // Show all
  }
};

// Grade filter function
const getGradeFilter = (selectedGrade) => {
  if (!selectedGrade || selectedGrade === 'all') return () => true;
  
  return (course) => {
    return course.course_grade?.includes(selectedGrade.replace('grade', 'Grade '));
  };
};

function VedicMathematics() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('medium');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const { getQuery } = useGetQuery();
  const router = useRouter();

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        getQuery({
          url: apiUrls.courses.getAllCoursesWithLimits(1, 100, "Vedic Mathematics", "", "", "Published"),
          onSuccess: (response) => {
            console.log('Vedic Mathematics courses:', response);
            const courseData = response?.courses || [];
            setCourses(courseData);
            setFilteredCourses(courseData);
            setLoading(false);
            
            // Select the first course by default if available
            if (courseData.length > 0) {
              setSelectedCourse(courseData[0]);
            }
          },
          onFail: (err) => {
            console.error("Error fetching courses:", err);
            setError(err?.message || 'Failed to load courses');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Unexpected error in fetchCourses:", err);
        setError(err?.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getQuery]);

  // Filter courses when duration or grade changes
  useEffect(() => {
    if (!courses.length) return;
    
    // Get the appropriate filter functions
    const durationFilter = getDurationFilter(selectedDuration);
    const gradeFilter = getGradeFilter(selectedGrade);
    
    // Apply both filters
    const filtered = courses.filter(course => {
      return durationFilter(course) && gradeFilter(course);
    });
    
    setFilteredCourses(filtered);
    
    // Update selected course if current selection is not in filtered results
    if (filtered.length > 0) {
      if (!selectedCourse || !filtered.some(course => course._id === selectedCourse._id)) {
        setSelectedCourse(filtered[0]);
      }
    } else {
      setSelectedCourse(null);
    }
  }, [selectedDuration, selectedGrade, courses, selectedCourse]);

  // Handle duration selection
  const handleDurationChange = (durationId) => {
    setSelectedDuration(durationId);
  };

  // Handle grade selection
  const handleGradeChange = (gradeId) => {
    setSelectedGrade(gradeId);
  };

  // Handle course selection
  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
  };

  // Handle enrollment
  const handleEnroll = () => {
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }
    
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!user) {
      toast.error('Please login to enroll in this course');
      router.push('/login');
      return;
    }
    
    // Redirect to enrollment page
    router.push('/enrollment/vedic-mathematics');
  };

  // Handle view details
  const handleViewDetails = () => {
    if (selectedCourse) {
      router.push(`/enrollment/vedic-mathematics/details`);
    }
  };

  // Handle section navigation
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8 p-4 max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
      <div className="flex justify-center my-10">
        <div className="vedic-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
          Failed to load courses
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Navigation items
  const navigationItems = [
    { key: 'overview', label: 'Course Overview', icon: BookOpen },
    { key: 'curriculum', label: 'Curriculum', icon: Calendar },
    { key: 'faq', label: 'FAQs', icon: ChevronDown }
  ];

  return (
    <PageWrapper>
        {/* Content with Header Offset */}
        <main>
          
          {/* Course Banner */}
          <VedicBanner />

          {/* Course List */}
          <VedicCource />

          {/* Course Overview */}
          <VedicOverview />

          {/* FAQs Section */}
          <VedicFaq />
        </main>

        {/* Theme Controller - Now positioned in bottom right */}
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeController />
        </div>

        {/* Bottom Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </PageWrapper>
  );
}

export default VedicMathematics;
