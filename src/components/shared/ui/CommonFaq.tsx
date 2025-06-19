"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Mail, 
  HelpCircle, 
  Search, 
  AlertTriangle, 
  RefreshCw,
  BookOpen,
  HelpingHand
} from "lucide-react";
import axios from "axios";

export interface IFAQ {
  _id?: string;
  id?: string | number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface IFAQTheme {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  contactEmail?: string;
  contactText?: string;
  showContactSection?: boolean;
}

export interface ICommonFaqProps {
  title?: string;
  subtitle?: string;
  faqs?: IFAQ[];
  apiEndpoint?: string;
  theme?: IFAQTheme;
  showSearch?: boolean;
  showCategories?: boolean;
  defaultCategory?: string;
  categoriesEndpoint?: string;
  className?: string;
}

const defaultTheme: IFAQTheme = {
  primaryColor: "#3b82f6", // Blue 500
  secondaryColor: "#8b5cf6", // Violet 500
  accentColor: "#f59e0b", // Amber 500
  showContactSection: false,
};

const defaultIcons: Record<string, React.ReactNode> = {
  general: <HelpCircle strokeWidth={1.75} className="w-5 h-5" />,
  courses: <BookOpen strokeWidth={1.75} className="w-5 h-5" />,
  support: <HelpingHand strokeWidth={1.75} className="w-5 h-5" />
};

const IconWrapper: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  bgColor?: string;
  color?: string;
}> = ({ children, isOpen, bgColor = "#3b82f6", color = "#3b82f6" }) => (
  <div 
    style={{
      backgroundColor: isOpen ? `${bgColor}20` : `${bgColor}10`,
      color: color,
      boxShadow: isOpen ? `0 0 12px ${bgColor}40` : 'none',
    }}
    className={`
      p-3 rounded-xl flex items-center justify-center
      transition-all duration-300 transform 
      ${isOpen ? 'scale-110' : 'scale-100'}
      group-hover:scale-105 group-hover:shadow-md
    `}
    aria-hidden="true"
  >
    {children}
  </div>
);

const CommonFaq: React.FC<ICommonFaqProps> = ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to your most common questions",
  faqs = [],
  apiEndpoint,
  theme = defaultTheme,
  showSearch = true,
  showCategories = false,
  defaultCategory = "all",
  categoriesEndpoint,
  className = "",
}) => {
  const [faqItems, setFaqItems] = useState<IFAQ[]>(faqs);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(!!apiEndpoint);
  const [categoriesLoading, setCategoriesLoading] = useState(!!categoriesEndpoint);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState<IFAQ[]>(faqs);
  const [retrying, setRetrying] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  // Fetch categories if endpoint is provided
  useEffect(() => {
    if (!categoriesEndpoint) return;

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await axios.get(categoriesEndpoint);
        if (response.data?.categories && Array.isArray(response.data.categories)) {
          setCategories(['all', ...response.data.categories]);
        } else {
          setCategories(['all']);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories(['all']);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [categoriesEndpoint]);

  // Fetch FAQs if endpoint is provided
  useEffect(() => {
    if (!apiEndpoint) {
      setFaqItems(faqs);
      setLoading(false);
      return;
    }

    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = apiEndpoint;
        
        if (showCategories && selectedCategory !== "all") {
          url = `${url}/${selectedCategory}`;
        }
        
        const response = await axios.get(url);
        const fetchedFaqs = response.data.faqs || response.data;
        
        setFaqItems(fetchedFaqs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again or select a different category.");
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [apiEndpoint, selectedCategory, retrying, faqs, showCategories]);

  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFaqs(faqItems);
      return;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = faqItems.filter(
      faq => 
        faq.question.toLowerCase().includes(lowercasedQuery) || 
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
    
    setFilteredFaqs(filtered);
  }, [searchQuery, faqItems]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Reset search when changing category
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRetry = () => {
    setRetrying(prev => !prev);
  };

  // Function to get default icon for a FAQ
  const getIcon = (faq: IFAQ, index: number) => {
    if (faq.icon) return faq.icon;
    
    if (faq.category && defaultIcons[faq.category.toLowerCase()]) {
      return defaultIcons[faq.category.toLowerCase()];
    }
    
    // Default icons based on index for variety
    const iconIndex = index % 3;
    if (iconIndex === 0) return <HelpCircle strokeWidth={1.75} className="w-5 h-5" />;
    if (iconIndex === 1) return <BookOpen strokeWidth={1.75} className="w-5 h-5" />;
    return <HelpingHand strokeWidth={1.75} className="w-5 h-5" />;
  };

  // Function to color code categories
  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'all': theme.primaryColor,
      'general': theme.primaryColor,
      'courses': theme.secondaryColor || theme.primaryColor,
      'payment': theme.accentColor || theme.primaryColor,
      'support': theme.secondaryColor || theme.primaryColor
    };
    
    return categoryMap[category.toLowerCase()] || theme.primaryColor;
  };

  // Loading skeletons
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 flex justify-between items-center">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Get the primary color with fallback
  const primaryColor = theme.primaryColor || defaultTheme.primaryColor;

  return (
    <section className={`relative py-16 overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.04]" />
      <div className={`absolute -top-1/4 right-1/2 w-[120%] aspect-square bg-[${primaryColor}]/10 rounded-full blur-3xl transform translate-x-1/2 opacity-30 dark:opacity-20 animate-float mix-blend-multiply dark:mix-blend-soft-light`} />
      <div className={`absolute top-1/4 left-1/2 w-[120%] aspect-square bg-[${primaryColor}]/10 rounded-full blur-3xl transform -translate-x-1/2 opacity-30 dark:opacity-20 animate-float animation-delay-1000 mix-blend-multiply dark:mix-blend-soft-light`} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-[#F6B335]/10 backdrop-blur-sm mb-6">
            <HelpCircle className={`w-5 h-5 text-[${primaryColor}] stroke-[1.75]`} style={{ fill: `${primaryColor}10` }} aria-hidden="true" />
            <span className={`text-[${primaryColor}] font-semibold`}>FAQ</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          
          <div className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="relative max-w-xl mx-auto mt-8 mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search FAQs..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          )}

          {/* Category Filters */}
          {showCategories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="flex flex-wrap gap-2 justify-center items-center">
                <AnimatePresence mode="wait">
                  {/* Show loading skeleton for categories */}
                  {categoriesLoading ? (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      {categories.map((category) => (
                        <motion.button
                          key={category}
                          variants={buttonVariants}
                          initial="idle"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleCategoryChange(category)}
                          suppressHydrationWarning
                          className={`px-4 py-2 rounded-md transition-all duration-200 ${
                            selectedCategory === category
                              ? `bg-[${primaryColor}] text-white shadow-md`
                              : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                          }`}
                          style={{ 
                            borderBottom: selectedCategory === category 
                              ? `3px solid ${getCategoryColor(category)}` 
                              : 'none'
                          }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </motion.button>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading state */}
        {loading && <LoadingSkeleton />}

        {/* Error state */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center max-w-3xl mx-auto"
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
                suppressHydrationWarning
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* FAQ Items */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq._id || faq.id || index}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    bg-white dark:bg-gray-800/50 backdrop-blur-sm 
                    rounded-xl overflow-hidden 
                    border border-gray-100 dark:border-gray-700/50
                    transition-all duration-300
                    ${hoveredIndex === index ? 'shadow-lg scale-[1.01]' : 'shadow-md'}
                  `}
                  style={{
                    boxShadow: openIndex === index ? `0 0 15px ${faq.iconColor || primaryColor}10` : ''
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    suppressHydrationWarning
                  >
                    <IconWrapper 
                      isOpen={openIndex === index || hoveredIndex === index}
                      bgColor={faq.iconBg || primaryColor}
                      color={faq.iconColor || primaryColor}
                    >
                      {getIcon(faq, index)}
                    </IconWrapper>
                    <span className={`font-semibold pr-8 flex-grow transition-colors duration-300 ${
                      openIndex === index 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-800 dark:text-gray-100'
                    }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ 
                        rotate: openIndex === index ? 180 : 0,
                        color: openIndex === index ? faq.iconColor || primaryColor : '#9CA3AF'
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-5 h-5 stroke-[2]" />
                    </motion.div>
                  </button>

                  <AnimatePresence mode="wait">
                    {openIndex === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.3, delay: 0.1 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50"
                          style={{
                            background: `linear-gradient(to right, ${faq.iconBg || primaryColor}10, transparent)`,
                          }}
                        >
                          <div className="pl-12 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
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
                    suppressHydrationWarning
                    className={`text-[${primaryColor}] hover:text-[${primaryColor}]/80 dark:text-[${primaryColor}]/90 dark:hover:text-[${primaryColor}]/70 font-medium`}
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Contact Info */}
        {theme.showContactSection && theme.contactEmail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className={`bg-gradient-to-r from-[${primaryColor}]/10 via-white to-[${primaryColor}]/10 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto border border-[${primaryColor}]/20 shadow-lg`}>
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-xl bg-[${primaryColor}]/20 flex items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:bg-[${primaryColor}]/30`}
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Mail 
                    className={`w-8 h-8 text-[${primaryColor}] stroke-[1.5]`}
                    style={{ fill: `${primaryColor}20`, color: primaryColor }}
                    aria-hidden="true" 
                  />
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 text-lg">
                  {theme.contactText || "Have more questions? Contact us at"}{" "}
                  <a
                    href={`mailto:${theme.contactEmail}`}
                    className={`text-[${primaryColor}] font-semibold hover:underline inline-flex items-center gap-1 group`}
                    style={{ color: primaryColor }}
                  >
                    {theme.contactEmail}
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="inline-block transition-transform"
                    >
                      →
                    </motion.span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </section>
  );
};

export default CommonFaq; 