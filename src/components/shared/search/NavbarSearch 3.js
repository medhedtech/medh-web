"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, History, Loader2 } from "lucide-react";

/**
 * Enhanced search bar for the navbar with immersive mobile experience
 * Features:
 * - Centered immersive search on mobile with smooth animations
 * - Keyboard navigation support with auto-focus
 * - Search suggestions and history
 * - Touch-friendly mobile interactions
 * - Improved accessibility
 */
const NavbarSearch = ({ 
  isScrolled, 
  smallScreen = false, 
  isImmersiveInMobileMenu = false,
  onMobileMenuClose
}) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        try {
          setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
        } catch (e) {
          console.error('Error loading recent searches:', e);
        }
      }
    }
  }, []);

  // Save a search to history
  const saveToHistory = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const newSearches = [
      searchTerm,
      ...recentSearches.filter(item => item !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(newSearches);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
  }, [recentSearches]);

  // Clear search history
  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches');
    }
  }, []);

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      saveToHistory(query.trim());
      
      // Slight delay to show loading indicator
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsExpanded(false);
        setIsImmersive(false);
        setHasFocus(false);
        setIsLoading(false);

        // Close mobile menu if in mobile menu context
        if (isImmersiveInMobileMenu && typeof onMobileMenuClose === 'function') {
          onMobileMenuClose();
        }
      }, 300);
    }
  }, [query, router, saveToHistory, isImmersiveInMobileMenu, onMobileMenuClose]);
  
  // Clear search and collapse on mobile when ESC key is pressed
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setQuery("");
      setHasFocus(false);
      if (smallScreen) {
        setIsExpanded(false);
        setIsImmersive(false);
      }
    } else if (e.key === "Enter" && query.trim()) {
      handleSearch(e);
    }
  }, [smallScreen, query, handleSearch]);
  
  // Handle selection of a recent search
  const selectRecentSearch = useCallback((searchTerm) => {
    setQuery(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsExpanded(false);
    setIsImmersive(false);
    setHasFocus(false);
  }, [router]);
  
  // Open the immersive search experience
  const openImmersiveSearch = useCallback(() => {
    // First expand 
    setIsExpanded(true);
    
    // Then after a small delay, activate the immersive mode
    setTimeout(() => {
      setIsImmersive(true);
      // Add body class to prevent scrolling
      document.body.classList.add('overflow-hidden');
    }, 50);
    
    // Focus the input after animation completes
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 350); // Slightly faster to improve responsiveness
  }, []);
  
  // Close the search experience
  const closeSearch = useCallback(() => {
    setIsImmersive(false);
    setHasFocus(false);
    
    // Remove body class to allow scrolling again
    document.body.classList.remove('overflow-hidden');
    
    // After the animation finishes, collapse the regular expanded mode
    setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  }, []);
  
  // Clean up body class when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  // Handle clicks outside to collapse search on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target)
      ) {
        setHasFocus(false);
        
        if (smallScreen && isImmersive) {
          closeSearch();
        } else if (smallScreen && isExpanded) {
          setIsExpanded(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [smallScreen, isExpanded, isImmersive, closeSearch]);

  // When in mobile menu, adapt the UI accordingly
  useEffect(() => {
    if (isImmersiveInMobileMenu) {
      // Auto expand when in mobile menu
      setIsExpanded(true);
      // Don't use immersive mode inside mobile menu
      setIsImmersive(false);
    }
  }, [isImmersiveInMobileMenu]);

  return (
    <>
      {/* Backdrop for immersive mode - only show when not in mobile menu */}
      {isImmersive && !isImmersiveInMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={closeSearch}
        />
      )}
      
      <div 
        ref={searchContainerRef}
        className={`
          relative 
          ${smallScreen && !isImmersiveInMobileMenu ? "flex-grow-0 flex items-center justify-center" : "w-full max-w-xs"} 
          ${isImmersive && !isImmersiveInMobileMenu ? "z-50" : ""}
          ${smallScreen && !isImmersiveInMobileMenu ? "static" : ""}
          ${isImmersiveInMobileMenu ? "w-full" : ""}
        `}
      >
        {/* Mobile search icon (only visible when collapsed and not in mobile menu) */}
        {smallScreen && !isExpanded && !isImmersiveInMobileMenu && (
          <button
            onClick={openImmersiveSearch}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open search"
          >
            <Search size={22} />
          </button>
        )}
        
        {/* Search form */}
        <form 
          onSubmit={handleSearch}
          className={`
            ${smallScreen && !isExpanded && !isImmersiveInMobileMenu ? "hidden" : "flex"}
            ${smallScreen && isExpanded && !isImmersiveInMobileMenu ? "absolute" : ""}
            ${isImmersive && !isImmersiveInMobileMenu ? "fixed left-0 right-0 top-24 mx-auto max-w-md px-4 z-50" : "right-0 left-0 z-20"}
            ${isImmersiveInMobileMenu ? "w-full" : ""}
            items-center transition-all duration-300 ease-in-out
            ${!isImmersive && smallScreen && isExpanded && !isImmersiveInMobileMenu ? "w-[calc(100vw-32px)] mx-auto max-w-md px-4" : ""}
          `}
          style={{ 
            transform: isImmersive && !isImmersiveInMobileMenu ? 'translateY(0)' : '',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className={`
            relative w-full 
            ${isScrolled && !isImmersive && !isImmersiveInMobileMenu ? "h-9" : "h-10"}
            ${isImmersive && !isImmersiveInMobileMenu ? "h-14" : ""}
            ${isImmersiveInMobileMenu ? "h-12" : ""}
            transition-all duration-300
          `}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setHasFocus(true)}
              placeholder={isImmersive ? "What do you want to learn?" : "Search courses, lessons..."}
              className={`
                w-full h-full pl-10 pr-8
                ${isScrolled && !isImmersive ? "text-sm" : "text-base"}
                ${isImmersive ? "text-lg shadow-xl" : ""}
                ${isImmersiveInMobileMenu ? "rounded-lg" : "rounded-full"}
                bg-gray-100 dark:bg-gray-800 border-0
                focus:ring-2 focus:ring-primary-500
                dark:text-white dark:placeholder-gray-400
                transition-all duration-200
              `}
              aria-label="Search"
            />
            
            {/* Search icon inside input */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isLoading ? (
                <Loader2 size={isImmersive ? 22 : 18} className="text-primary-500 dark:text-primary-400 animate-spin" />
              ) : (
                <Search size={isImmersive ? 22 : 18} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            
            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X 
                  size={isImmersive ? 22 : 18} 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" 
                />
              </button>
            )}
            
            {/* Recent searches dropdown - don't show in mobile menu */}
            {hasFocus && recentSearches.length > 0 && !isImmersiveInMobileMenu && (
              <div className={`
                absolute top-full left-0 right-0 mt-2
                bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-800
                rounded-lg shadow-lg overflow-hidden
                z-50 max-h-60 overflow-y-auto
              `}>
                <div className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <span className="flex items-center"><History size={14} className="mr-1.5" /> Recent searches</span>
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Clear
                  </button>
                </div>
                <ul className="py-1">
                  {recentSearches.map((term, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => selectRecentSearch(term)}
                        className="w-full text-left px-4 py-2.5 flex items-center text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <History size={14} className="mr-2 text-gray-400" />
                        <span className="truncate">{term}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Controls container for better spacing - Don't show in mobile menu */}
          {!isImmersiveInMobileMenu && (
            <div className="flex gap-2 ml-2">
              {/* Close button */}
              {(smallScreen && isExpanded) && (
                <button
                  type="button"
                  onClick={closeSearch}
                  className={`
                    p-2 
                    ${isImmersive ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"} 
                    rounded-full text-gray-500 dark:text-gray-400 
                    hover:text-gray-700 dark:hover:text-gray-300
                    transition-colors
                  `}
                  aria-label="Close search"
                >
                  <X size={isImmersive ? 24 : 20} />
                </button>
              )}
              
              {/* Search button */}
              {smallScreen && isExpanded && query.trim() && (
                <button
                  type="submit"
                  className={`
                    p-2
                    bg-primary-500 rounded-full 
                    text-white hover:bg-primary-600 
                    dark:hover:bg-primary-400 transition-colors
                    ${isImmersive ? "h-14 w-14 flex items-center justify-center" : ""}
                  `}
                  aria-label="Submit search"
                >
                  <ArrowRight size={isImmersive ? 24 : 20} />
                </button>
              )}
            </div>
          )}
          
          {/* Submit button for mobile menu mode */}
          {isImmersiveInMobileMenu && query.trim() && (
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-primary-600 dark:text-primary-400"
              aria-label="Submit search"
            >
              <ArrowRight size={20} />
            </button>
          )}
        </form>
        
        {/* Search tips (only in immersive mode and not in mobile menu) */}
        {isImmersive && !isImmersiveInMobileMenu && (
          <div className="fixed left-0 right-0 top-[35%] text-center text-white z-50 px-6">
            <p className="text-sm opacity-90 mb-4 font-medium">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
              {["Python", "Web Development", "Data Science", "Machine Learning", "Mobile Development"].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(suggestion);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="px-4 py-2.5 bg-gray-800/70 backdrop-blur-sm rounded-full text-sm hover:bg-gray-700/80 transition-colors border border-gray-700/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches in mobile menu (simplified) */}
        {isImmersiveInMobileMenu && recentSearches.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <History size={12} className="mr-1" /> Recent searches
              </p>
              <button 
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 3).map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(term);
                    handleSearch();
                  }}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavbarSearch; 