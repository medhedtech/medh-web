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
  defaultCategory?: string;
  categoriesEndpoint?: string;
  className?: string;
  variant?: "default" | "minimal";
  containerWidth?: "edge" | "contained";
  cardContainer?: boolean;
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
      backgroundColor: `${bgColor}10`,
      color: color,
      boxShadow: 'none',
    }}
    className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full transition-all duration-300 transform scale-100"
    aria-hidden="true"
  >
    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const CommonFaq: React.FC<ICommonFaqProps> = ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to your most common questions",
  faqs = [],
  apiEndpoint,
  theme = defaultTheme,
  showSearch = true,
  defaultCategory = "all",
  categoriesEndpoint,
  className = "",
  variant = "default",
  containerWidth = "contained",
  cardContainer = false,
}) => {
  const [faqItems, setFaqItems] = useState<IFAQ[]>(faqs);
  const [loading, setLoading] = useState(!!apiEndpoint);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState<IFAQ[]>(faqs);
  const [retrying, setRetrying] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

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
  }, [apiEndpoint, retrying, faqs]);

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

  // Minimal variant rendering
  if (variant === "minimal") {
    // Helper for Medh green BookOpen icon
    const getMinimalIcon = (faq: IFAQ, idx: number) => {
      if (faq.icon) return faq.icon;
      if ((faq.category && faq.category.toLowerCase() === "courses") || faq.question.toLowerCase().includes("course")) {
        return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: "#3bac63" }} />;
      }
      return getIcon(faq, idx);
    };
    return (
      <section className={`relative overflow-hidden ${className}`}>
        <div className={`relative ${containerWidth === "edge" ? "w-full" : "max-w-2xl mx-auto"}`}>
          {cardContainer ? (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg rounded-none sm:rounded-2xl px-[45px] py-[28px]">
              {/* Section Header */}
              {title && (
                <h2 className="text-center font-semibold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 mt-2 sm:mt-4 text-slate-800 dark:text-slate-100">
                  {title}
                </h2>
              )}
              {/* Loading state */}
              {loading && <LoadingSkeleton />}
              {/* Error state */}
              {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center max-w-2xl mx-auto">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Something went wrong</h3>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <button
                      onClick={handleRetry}
                      suppressHydrationWarning
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors hover:scale-105"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              {/* Minimal FAQ Items */}
              {!loading && !error && (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => (
                      <li key={faq._id || faq.id || idx} className="">
                        <button
                          className={
                            "w-full flex items-start gap-3 py-4 focus:outline-none transition-colors min-h-[44px] " +
                            (openIndex === idx
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                          }
                          aria-expanded={openIndex === idx}
                          aria-controls={`faq-panel-${idx}`}
                          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                          <span className="flex-shrink-0 mt-1">
                            {getMinimalIcon(faq, idx)}
                          </span>
                          <span className="flex-1 text-left">
                            <span className="block font-medium text-sm sm:text-base md:text-lg text-slate-900 dark:text-slate-100">
                              {faq.question}
                            </span>
                          </span>
                          <svg
                            className={
                              "w-5 h-5 ml-2 transition-transform duration-200 " +
                              (openIndex === idx ? "rotate-180" : "rotate-0")
                            }
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          id={`faq-panel-${idx}`}
                          className={
                            "overflow-hidden transition-all duration-300 " +
                            (openIndex === idx ? "max-h-96 py-2" : "max-h-0 py-0")
                          }
                          aria-hidden={openIndex !== idx}
                        >
                          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No FAQs found.
                    </li>
                  )}
                </ul>
              )}
              {/* Contact Section (if present) */}
              {theme.showContactSection && theme.contactEmail && (
                <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 text-center">
                  <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
                    {theme.contactText || "Have more questions? Contact our team at"} {" "}
                    <a href={`mailto:${theme.contactEmail}`} className="text-[#3bac63] underline font-semibold">{theme.contactEmail}</a>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Section Header */}
              {title && (
                <h2 className="text-center font-semibold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 mt-2 sm:mt-4 text-slate-800 dark:text-slate-100">
                  {title}
                </h2>
              )}
              {/* Loading state */}
              {loading && <LoadingSkeleton />}
              {/* Error state */}
              {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center max-w-2xl mx-auto">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Something went wrong</h3>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <button
                      onClick={handleRetry}
                      suppressHydrationWarning
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors hover:scale-105"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              {/* Minimal FAQ Items */}
              {!loading && !error && (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, idx) => (
                      <li key={faq._id || faq.id || idx} className="">
                        <button
                          className={
                            "w-full flex items-start gap-3 py-4 focus:outline-none transition-colors min-h-[44px] " +
                            (openIndex === idx
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/60")
                          }
                          aria-expanded={openIndex === idx}
                          aria-controls={`faq-panel-${idx}`}
                          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                          <span className="flex-shrink-0 mt-1">
                            {getMinimalIcon(faq, idx)}
                          </span>
                          <span className="flex-1 text-left">
                            <span className="block font-medium text-sm sm:text-base md:text-lg text-slate-900 dark:text-slate-100">
                              {faq.question}
                            </span>
                          </span>
                          <svg
                            className={
                              "w-5 h-5 ml-2 transition-transform duration-200 " +
                              (openIndex === idx ? "rotate-180" : "rotate-0")
                            }
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          id={`faq-panel-${idx}`}
                          className={
                            "overflow-hidden transition-all duration-300 " +
                            (openIndex === idx ? "max-h-96 py-2" : "max-h-0 py-0")
                          }
                          aria-hidden={openIndex !== idx}
                        >
                          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No FAQs found.
                    </li>
                  )}
                </ul>
              )}
              {/* Contact Section (if present) */}
              {theme.showContactSection && theme.contactEmail && (
                <div className="mt-6 sm:mt-8 border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 pb-4 text-center">
                  <span className="block text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium">
                    {theme.contactText || "Have more questions? Contact our team at"} {" "}
                    <a href={`mailto:${theme.contactEmail}`} className="text-[#3bac63] underline font-semibold">{theme.contactEmail}</a>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Search Bar */}
          {showSearch && (
            <div className="mb-2">
              <div
                className="inline-block text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 via-lime-500 to-emerald-600 bg-clip-text text-transparent"
              >
                Explore FAQs
              </div>
              <div className="border-b-4 border-emerald-500 w-24 mx-auto mt-2 mb-0 rounded-full"></div>
            </div>
          )}

          {/* Subtitle */}
        
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
              <button
                onClick={handleRetry}
                suppressHydrationWarning
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors hover:scale-105"
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </button>
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
            className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={faq._id || faq.id || index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200
                    ${openIndex === index 
                      ? 'border-emerald-200 dark:border-emerald-700 shadow-lg bg-emerald-50/30 dark:bg-emerald-900/10' 
                      : 'border-slate-200 dark:border-slate-600 shadow-sm'
                    }
                  `}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center gap-4 text-left transition-colors duration-200"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    suppressHydrationWarning
                    style={{ minHeight: '44px' }}
                  >
                    <IconWrapper 
                      isOpen={openIndex === index || hoveredIndex === index}
                      bgColor={faq.iconBg || primaryColor}
                      color={faq.iconColor || primaryColor}
                    >
                      {getIcon(faq, index)}
                    </IconWrapper>
                    
                    <div className="flex-grow pr-4">
                      <span className={`font-bold text-base md:text-lg transition-all duration-300 block ${
                        openIndex === index 
                          ? 'text-emerald-700 dark:text-emerald-400' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    
                    <motion.div
                      animate={{ 
                        rotate: openIndex === index ? 180 : 0,
                        scale: openIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        openIndex === index 
                          ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown 
                        className={`w-5 h-5 stroke-[2] transition-colors duration-300 ${
                          openIndex === index 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
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
                            height: { duration: 0.4, ease: "easeOut" },
                            opacity: { duration: 0.3, delay: 0.1 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: "easeIn" },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          {/* Gradient divider */}
                          <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-700/50 to-transparent" />
                          
                          <div className="px-6 py-6 bg-gradient-to-r from-emerald-50/30 via-white/50 to-emerald-50/30 dark:from-emerald-900/10 dark:via-slate-800/50 dark:to-emerald-900/10">
                            <motion.div 
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                              className="pl-16 text-slate-700 dark:text-slate-300 leading-relaxed text-base"
                            >
                              {faq.answer}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                  {theme.contactEmail === "care@medh.co" ? (
                    <a
                      href="https://mail.google.com/mail/u/0/?to=care@medh.co&fs=1&tf=cm"
                      target="_blank"
                      rel="noopener noreferrer"
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
                  ) : (
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
                  )}
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
