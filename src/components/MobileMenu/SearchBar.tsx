"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { MENU_CONFIG } from '@/constants/menu';
import { STYLES } from '@/constants/uiStyles';
import { ISearchBarProps, ISearchSuggestion } from './types';

/**
 * SearchBar Component
 * Enhanced search functionality with debouncing and recent searches
 */
const SearchBar: React.FC<ISearchBarProps> = ({ onClose }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<ISearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Load recent searches on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      } catch (error) {
        console.error("Error parsing recent searches:", error);
        localStorage.removeItem("recentSearches");
      }
    }
  }, []);
  
  // Debounced search function
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (value.trim()) {
      setIsSearching(true);
      
      // Set new timeout for debounced search (300ms)
      searchTimeout.current = setTimeout(() => {
        // Simulate API call for suggestions
        setSearchSuggestions([
          { type: 'course', title: 'React Development', path: '/courses/react' },
          { type: 'blog', title: 'Modern Web Development', path: '/blogs/web-dev' },
          { type: 'instructor', title: 'John Doe', path: '/instructors/john-doe' },
        ]);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchSuggestions([]);
      setIsSearching(false);
    }
  }, []);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };
  
  // Search suggestion component
  const SearchSuggestion = ({ type, title, path }: ISearchSuggestion) => {
    const SuggestionIcon = MENU_CONFIG.suggestionTypes[type] || MENU_CONFIG.suggestionTypes.default;
    
    return (
      <Link 
        href={path}
        onClick={onClose}
        className={STYLES.suggestionItem}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full
          bg-primary-100 dark:bg-primary-900/20
          text-primary-600 dark:text-primary-400
          flex items-center justify-center mr-3">
          <SuggestionIcon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {type}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          ref={searchInputRef}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search..."
          className={`w-full py-3 pl-11 pr-4 text-base rounded-xl
            transition-all duration-200
            ${searchFocused 
              ? 'bg-white dark:bg-gray-800 ring-2 ring-primary-500 shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-800/60'}
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none`}
          aria-label="Search"
        />
        <Search className={`absolute left-3 top-3.5 h-5 w-5
          ${searchFocused 
            ? 'text-primary-500 dark:text-primary-400' 
            : 'text-gray-400 dark:text-gray-500'}
          transition-colors duration-200`}
        />
        
        {isSearching && (
          <div className="absolute right-3 top-3.5">
            <div className="h-5 w-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
          </div>
        )}
      </form>

      {/* Search suggestions */}
      {searchQuery && searchSuggestions.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg
          border border-gray-200 dark:border-gray-700 overflow-hidden
          animate-fadeIn">
          {searchSuggestions.map((suggestion, index) => (
            <SearchSuggestion 
              key={index}
              {...suggestion}
            />
          ))}
        </div>
      )}

      {/* Recent searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Recent Searches
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-primary-500 hover:text-primary-600"
              aria-label="Clear recent searches"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(search);
                  searchInputRef.current?.focus();
                }}
                className="px-3 py-1.5 text-sm rounded-lg
                  bg-gray-100 dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  transition-colors duration-200"
                aria-label={`Search for ${search}`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 