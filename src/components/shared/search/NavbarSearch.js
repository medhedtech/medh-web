"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * YouTube-inspired search bar for the navbar
 * Features:
 * - Expandable search on mobile
 * - Keyboard navigation support
 * - Clean animation transitions
 */
const NavbarSearch = ({ isScrolled, smallScreen = false }) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
    }
  };
  
  // Clear search and collapse on mobile when ESC key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setQuery("");
      if (smallScreen) {
        setIsExpanded(false);
      }
    }
  };
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Handle clicks outside to collapse search on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        smallScreen && 
        isExpanded && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [smallScreen, isExpanded]);

  return (
    <div className={`relative ${smallScreen ? "flex-grow" : "w-full max-w-xs"}`}>
      {/* Mobile search icon (only visible when collapsed) */}
      {smallScreen && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      )}
      
      {/* Search form (always visible on desktop, conditionally on mobile) */}
      <form 
        onSubmit={handleSearch}
        className={`
          ${smallScreen && !isExpanded ? "hidden" : "flex"}
          ${smallScreen && isExpanded ? "absolute right-0 left-0 z-20" : ""}
          items-center transition-all duration-200
        `}
      >
        <div className={`
          relative w-full 
          ${isScrolled ? "h-8" : "h-10"}
          transition-all duration-300
        `}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, lessons..."
            className={`
              w-full h-full pl-9 pr-8
              ${isScrolled ? "text-sm" : "text-base"}
              bg-gray-100 dark:bg-gray-800 border-0
              rounded-full focus:ring-2 focus:ring-primary-500
              dark:text-white dark:placeholder-gray-400
              transition-all duration-200
            `}
          />
          
          {/* Search icon inside input */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X 
                size={16} 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" 
              />
            </button>
          )}
        </div>
        
        {/* Close button on mobile expanded view */}
        {smallScreen && isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="ml-2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default NavbarSearch; 