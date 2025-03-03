"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { apiBaseUrl, apiUrls } from "@/apis";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import AccordionController from "@/components/shared/accordion/AccordionController";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Search, Filter, RefreshCw } from "lucide-react";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [retrying, setRetrying] = useState(false);
  const containerRef = useRef(null);

  // Theme colors - consistent with other FAQ components
  const themeColors = {
    primary: {
      light: '#3b82f6', // Blue 500
      medium: '#2563eb', // Blue 600
      dark: '#1d4ed8', // Blue 700
    },
    secondary: {
      light: '#8b5cf6', // Violet 500
      medium: '#7c3aed', // Violet 600
      dark: '#6d28d9', // Violet 700
    },
    accent: {
      light: '#f59e0b', // Amber 500
      medium: '#d97706', // Amber 600
      dark: '#b45309', // Amber 700
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getAllCategories}`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch FAQs based on selected category
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        let url;
        
        if (selectedCategory !== "all") {
          url = `${apiBaseUrl}${apiUrls.faqs.getFaqsByCategory}/${selectedCategory}`;
        } else {
          url = `${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`;
        }
        
        const response = await axios.get(url);
        setFaqs(response.data.faqs || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again or select a different category.");
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [selectedCategory, retrying]);

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Reset search when changing category
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = () => {
    setRetrying(prev => !prev);
  };

  // Function to color code categories
  const getCategoryColor = (category) => {
    const categoryMap = {
      'all': themeColors.primary.medium,
      'general': themeColors.primary.light,
      'courses': themeColors.secondary.light,
      'payment': themeColors.accent.light,
      'technical': '#10b981', // Emerald 500
      'support': '#ec4899'  // Pink 500
    };
    
    return categoryMap[category.toLowerCase()] || themeColors.primary.medium;
  };

  // Loading skeletons
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 flex justify-between items-center">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton-pulse"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-pulse"></div>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 skeleton-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3 skeleton-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 skeleton-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 pb-100px">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to your questions about our courses, payment options, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          {/* Title section */}
          <div className="lg:col-start-1 lg:col-span-2" data-aos="fade-up">
            <div className="lg:-rotate-90 lg:translate-y-3/4 relative hidden lg:block">
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-size-150 lg:text-size-140 2xl:text-size-200 text-lightGrey dark:text-blackColor-dark opacity-50 uppercase font-bold leading-[1]"
              >
                faq
              </motion.h4>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-start-3 lg:col-span-10">
            {/* Search and filter area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 space-y-4"
            >
              {/* Search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* Category selection */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center mr-2 text-gray-600 dark:text-gray-300">
                  <Filter size={16} className="mr-2" />
                  <span>Filter by:</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.button
                    key="all"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleCategoryChange("all")}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      selectedCategory === "all"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    }`}
                    style={{ 
                      borderBottom: selectedCategory === "all" ? `3px solid ${getCategoryColor('all')}` : 'none'
                    }}
                  >
                    All
                  </motion.button>
                  
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-md transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                      }`}
                      style={{ 
                        borderBottom: selectedCategory === category ? `3px solid ${getCategoryColor(category)}` : 'none'
                      }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Loading state */}
            {loading && <LoadingSkeleton />}

            {/* Error state */}
            {error && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
              >
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Something went wrong</h3>
                  <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                  <motion.button
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* FAQs accordions */}
            {!loading && !error && (
              <motion.div
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredFaqs.length > 0 ? (
                  <AccordionContainer>
                    <AnimatePresence>
                      {filteredFaqs.map((faq, idx) => (
                        <motion.div 
                          key={faq._id || idx}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="will-change-transform"
                        >
                          <Accordion
                            idx={idx}
                            isActive={idx === 0 ? true : false}
                            accordion={"secondaryLg"}
                          >
                            <AccordionController type={"secondaryLg"}>
                              {faq.question}
                            </AccordionController>
                            <AccordionContent>
                              <div className="content-wrapper py-4 px-5">
                                <p className="leading-7 text-contentColor dark:text-contentColor-dark mb-15px">
                                  {faq.answer}
                                </p>
                              </div>
                            </AccordionContent>
                          </Accordion>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </AccordionContainer>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center"
                  >
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No FAQs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchQuery ? "Try a different search term or" : "Try selecting a different category or"} check back later.
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
