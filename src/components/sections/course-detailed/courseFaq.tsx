"use client";
import React, { useEffect, useState, useRef } from "react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls, apiBaseUrl } from "@/apis";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { ChevronDown, ChevronRight, HelpCircle, AlertCircle, Search, RefreshCw, ExternalLink, BookOpen, Clock, Plus, Minus } from "lucide-react";
import axios from "axios";
import DOMPurify from "dompurify";
import { getCourseById } from "@/apis/course/course";

// Define interfaces for our data types
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CourseDetails {
  id: string;
  category?: string;
  course_category?: string;
  courseCategory?: string;
  [key: string]: any; // For other potential properties
}

interface ThemeColors {
  primary: {
    light: string;
    medium: string;
    dark: string;
  };
  secondary: {
    light: string;
    medium: string;
    dark: string;
  };
  accent: {
    light: string;
    medium: string;
    dark: string;
  };
  neutral: {
    light: string;
    medium: string;
    dark: string;
  };
}

interface CourseFaqProps {
  courseId: string;
}

export default function CourseFaq({ courseId }: CourseFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { getQuery, loading: courseLoading } = useGetQuery();
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noFaqsFound, setNoFaqsFound] = useState<boolean>(false);
  const [showFaqSection, setShowFaqSection] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [retrying, setRetrying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Theme colors - centralized for consistency with other FAQ components
  const themeColors: ThemeColors = {
    primary: {
      light: '#10b981',
      medium: '#059669',
      dark: '#047857',
    },
    secondary: {
      light: '#3b82f6',
      medium: '#2563eb',
      dark: '#1d4ed8',
    },
    accent: {
      light: '#8b5cf6',
      medium: '#7c3aed',
      dark: '#6d28d9',
    },
    neutral: {
      light: '#f3f4f6',
      medium: '#9ca3af',
      dark: '#4b5563',
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30, 
        mass: 1
      }
    }
  };
  
  const contentVariants: Variants = {
    hidden: { opacity: 0, height: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      height: "auto",
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        opacity: { duration: 0.2 }
      }
    }
  };

  // Function to get gradient background colors based on index
  const getGradientColors = (index: number): [string, string] => {
    const palettes: [string, string][] = [
      ['#10b981', '#059669'],
      ['#3b82f6', '#2563eb'],
      ['#8b5cf6', '#7c3aed'],
      ['#f59e0b', '#d97706'],
      ['#ec4899', '#db2777'],
    ];
    
    return palettes[index % palettes.length];
  };

  // Fetch course details to get the category
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId]);

  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqs);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(lowercasedQuery) || 
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
    
    setFilteredFaqs(filtered);
  }, [searchQuery, faqs]);

  const fetchCourseDetails = async (id: string): Promise<void> => {
    try {
      console.log("Fetching course details for ID:", id);
      await getQuery({
        url: getCourseById(id),
        onSuccess: (response: any) => {
          console.log("Raw course data received:", response);
          const courseData = response?.data || {};
          console.log("Processed course data:", courseData);
          
          // Extract category from the correct path
          const category = courseData.course_category || courseData.category || courseData.courseCategory;
          console.log("Course category:", category);
          
          if (!category) {
            console.error("No category found in course data");
            setError("Unable to find course category");
            setShowFaqSection(true);
            setFaqs([]);
            setFilteredFaqs([]);
            return;
          }
          
          setCourseDetails(courseData);
          fetchFaqsByCategory(category);
        },
        onFail: (err: Error) => {
          console.error("Error fetching course details:", err);
          setError("Unable to fetch course details");
          setShowFaqSection(true);
          setFaqs([]);
          setFilteredFaqs([]);
        },
      });
    } catch (error) {
      console.error("Exception in fetching course details:", error);
      setError("Unable to fetch course details");
      setShowFaqSection(true);
      setFaqs([]);
      setFilteredFaqs([]);
    }
  };

  const extractFaqsFromResponse = (response: any): FAQ[] => {
    console.log("Extracting FAQs from response:", response);
    
    if (!response || !response.data) {
      return [];
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.faqs && Array.isArray(response.data.faqs)) {
      return response.data.faqs;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      console.log("Found FAQs in response.data.data:", response.data.data);
      return response.data.data;
    }
    
    return [];
  };

  const fetchAllFaqs = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch all FAQs as fallback");
    
    try {
      const allFaqsResponse = await axios.get(`${apiBaseUrl}/faq/getAll`);
      console.log("All FAQs response:", allFaqsResponse);
      
      const extractedFaqs = extractFaqsFromResponse(allFaqsResponse);
      console.log("Extracted all FAQs:", extractedFaqs);
      
      if (extractedFaqs.length > 0) {
        setFaqs(extractedFaqs);
        setFilteredFaqs(extractedFaqs);
        setShowFaqSection(true);
        setNoFaqsFound(false);
      } else {
        console.log("No FAQs found in the response");
        setNoFaqsFound(true);
        setShowFaqSection(true);
      }
    } catch (err) {
      console.error("Error fetching all FAQs:", err);
      setShowFaqSection(true);
      setError("Unable to load FAQs at this time");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaqsByCategory = async (category: string): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log("Fetching FAQs for category:", category);
    
    const encodedCategory = encodeURIComponent(category);
    
    try {
      console.log(`Fetching from category endpoint: ${apiBaseUrl}/faq/category/${encodedCategory}`);
      const response = await axios.get(`${apiBaseUrl}/faq/category/${encodedCategory}`);
      console.log("Category FAQs response:", response);
      
      const categoryFaqsData = extractFaqsFromResponse(response);
      console.log("Processed category FAQs data:", categoryFaqsData);
      
      if (categoryFaqsData.length > 0) {
        console.log("Setting category FAQs:", categoryFaqsData);
        setFaqs(categoryFaqsData);
        setFilteredFaqs(categoryFaqsData);
        setNoFaqsFound(false);
      } else {
        console.log("No FAQs found for this category");
        setNoFaqsFound(true);
        setFaqs([]);
        setFilteredFaqs([]);
      }
      
      setShowFaqSection(true);
      setLoading(false);
    } catch (err) {
      console.error("Error in FAQ fetching process:", err);
      setError("Unable to load FAQs for this course category");
      setShowFaqSection(true);
      setFaqs([]);
      setFilteredFaqs([]);
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = (): void => {
    setRetrying(prev => !prev);
  };

  const getIconForQuestion = (question: string) => {
    const color = themeColors.primary.light;
    
    if (question.toLowerCase().includes("course") || question.toLowerCase().includes("learn")) 
      return <BookOpen className="w-5 h-5" style={{ color }} />;
    if (question.toLowerCase().includes("time") || question.toLowerCase().includes("long") || question.toLowerCase().includes("duration")) 
      return <Clock className="w-5 h-5" style={{ color }} />;
    
    return <HelpCircle className="w-5 h-5" style={{ color }} />;
  };

  // Find the category to display
  const displayCategory = courseDetails?.category || courseDetails?.course_category || "";

  return (
    <section className="w-full py-4 sm:py-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-3 sm:px-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
          {/* Header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8"
          >
            {/* Search input */}
            {faqs.length > 0 && (
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={handleSearch}
                  aria-label="Search FAQs"
                />
              </div>
            )}
          </motion.div>

          {/* Order notice */}
          {filteredFaqs.length > 0 && !loading && !courseLoading && !searchQuery && (
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> 
              <span>FAQs are displayed in the order they were uploaded.</span>
            </div>
          )}

          {/* Loading state */}
          {(courseLoading || loading) && (
            <div className="space-y-4 mt-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton-pulse"></div>
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-pulse"></div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 skeleton-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3 skeleton-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 skeleton-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && !courseLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-5 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex flex-col items-center text-center"
            >
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-red-500 dark:text-red-400" />
              <h3 className="text-base sm:text-lg font-medium mb-2">Something went wrong</h3>
              <p className="text-sm sm:text-base mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md inline-flex items-center transition-colors text-sm"
                onClick={handleRetry}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </motion.button>
            </motion.div>
          )}

          {/* No FAQs found message */}
          {noFaqsFound && !error && !loading && !courseLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-5 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 mr-0 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">No specific FAQs available for this course category yet</h3>
                  <p className="text-sm sm:text-base text-center sm:text-left">Our team is working on adding more FAQs for this specific course category. Meanwhile, check out our <a href="/faq" className="font-medium underline hover:text-blue-800 dark:hover:text-blue-200 inline-flex items-center">general FAQs page <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" /></a> or contact our support team for assistance.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQs list */}
          {filteredFaqs.length > 0 && !loading && !courseLoading && (
            <motion.div
              ref={containerRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 sm:space-y-4"
            >
              {filteredFaqs.map((faq, index) => {
                const [startColor, endColor] = getGradientColors(index);
                const isExpanded = openIndex === index;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="overflow-hidden"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className={`
                        border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden
                        transition-all duration-200
                        ${hoveredIndex === index ? 'shadow-md' : 'shadow-sm'}
                      `}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <motion.button
                        onClick={() => toggleFAQ(index)}
                        className={`w-full flex items-center justify-between p-3 sm:p-4 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${
                          isExpanded 
                            ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                        whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.02)" }}
                      >
                        <div className="flex items-start sm:items-center mr-2">
                          <div className="mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                            {getIconForQuestion(faq.question)}
                          </div>
                          <h3 className={`text-sm sm:text-base font-medium pr-6 sm:pr-8 ${
                            isExpanded 
                              ? "text-emerald-700 dark:text-emerald-400" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            {faq.question}
                          </h3>
                        </div>
                        <div className={`flex-shrink-0 p-1 rounded-full transition-all duration-300 transform ${
                          isExpanded ? "rotate-180 text-emerald-600 dark:text-emerald-400" : "text-gray-400 hover:text-emerald-500"
                        }`}>
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            id={`faq-content-${index}`}
                            className="overflow-hidden"
                          >
                            <div 
                              className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
                              style={{ 
                                borderLeft: `3px solid ${startColor}`,
                                paddingLeft: '1rem',
                                fontSize: '0.95rem'
                              }}
                            >
                              <div 
                                className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ 
                                  __html: DOMPurify.sanitize(faq.answer.replace(/\n/g, '<br/>'))
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        
          {/* No search results message */}
          {faqs.length > 0 && filteredFaqs.length === 0 && searchQuery && !loading && !courseLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-5 mt-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center"
            >
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No matching FAQs found</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                We couldn't find any FAQs matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm sm:text-base"
              >
                Clear search
              </button>
            </motion.div>
          )}
          
          {/* Footer contact info card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-100/70 dark:border-blue-800/50"
          >
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
              <HelpCircle className="w-6 h-6 mx-auto sm:mx-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 text-blue-500 dark:text-blue-400" />
              <span>
                If you have any other questions or concerns not covered in the FAQs, please feel free to 
                <a href="/contact-us" className="font-medium mx-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline inline-flex items-center">
                  contact our support team<ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1" />
                </a>.
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
} 