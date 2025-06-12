"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import Pagination from "./pagination";
import { useTheme } from "next-themes";
import { useGetQuery } from "@/hooks";
import { apiUrls, IBlog } from "@/apis";

interface BlogsPrimaryProps {
  initialBlogs?: IBlog[];
  totalBlogs?: number;
  initialFilters?: {
    category?: string;
    tag?: string;
    featured?: boolean;
  };
}

// Glassmorphic styles for search and cards
const getGlassMorphicStyles = (isDark: boolean) => `
  .glass-search {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.4)' 
      : 'rgba(255, 255, 255, 0.7)'};
    backdrop-filter: blur(20px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.3)'};
    border-radius: 1rem;
    box-shadow: 
      ${isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1)'},
      inset 0 1px 0 ${isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.4)'};
  }
  
  .glass-filter-btn {
    background: ${isDark 
      ? 'rgba(15, 23, 42, 0.5)' 
      : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(12px);
    border: 1px solid ${isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.4)'};
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .glass-filter-btn:hover {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.2)' 
      : 'rgba(59, 172, 99, 0.15)'};
    border-color: ${isDark 
      ? 'rgba(59, 172, 99, 0.3)' 
      : 'rgba(59, 172, 99, 0.4)'};
    transform: translateY(-2px);
  }
  
  .glass-filter-btn.active {
    background: ${isDark 
      ? 'rgba(59, 172, 99, 0.3)' 
      : 'rgba(59, 172, 99, 0.2)'};
    border-color: ${isDark 
      ? 'rgba(59, 172, 99, 0.5)' 
      : 'rgba(59, 172, 99, 0.6)'};
    color: ${isDark ? '#10b981' : '#059669'};
  }
`;

const BlogsPrimary: React.FC<BlogsPrimaryProps> = ({ 
  initialBlogs = [], 
  totalBlogs = 0, 
  initialFilters = {} 
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [blogs, setBlogs] = useState<IBlog[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || "all");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(totalBlogs);
  
  const blogsPerPage = 9;
  const isDark = mounted ? theme === 'dark' : false;

  // API hooks
  const { getQuery, loading: blogsLoading } = useGetQuery();
  const { getQuery: getCategoriesQuery, loading: categoriesLoading } = useGetQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject glassmorphic styles
  useEffect(() => {
    if (!mounted) return;
    
    const existingStyle = document.getElementById('glassmorphic-blog-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'glassmorphic-blog-styles';
    styleSheet.innerText = getGlassMorphicStyles(isDark);
    document.head.appendChild(styleSheet);
    
    return () => {
      const styleToRemove = document.getElementById('glassmorphic-blog-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [mounted, isDark]);
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesQuery({
          url: apiUrls.Blogs.getBlogCategories,
          showToast: false,
        });
        
        if (response && Array.isArray(response)) {
          setCategories(["all", ...response]);
        } else if (response && response.categories && Array.isArray(response.categories)) {
          setCategories(["all", ...response.categories]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories
        setCategories(["all", "Technology", "Development", "Design", "AI", "CSS", "TypeScript"]);
      }
    };
    
    fetchCategories();
  }, [getCategoriesQuery]);
  
  // Fetch blogs based on current filters
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const queryParams: any = {
          page: currentPage,
          limit: blogsPerPage,
          sort_by: selectedSort === 'latest' ? 'createdAt' : 
                   selectedSort === 'popular' ? 'views' : 
                   selectedSort === 'featured' ? 'featured' : 'createdAt',
        sort_order: 'desc',
          status: 'published', // Only fetch published blogs
        };

        // Add search term if provided
        if (searchTerm.trim()) {
          queryParams.search = searchTerm.trim();
        }

        // Add category filter if not "all"
        if (selectedCategory && selectedCategory !== "all") {
          queryParams.category = selectedCategory;
        }

        // Special handling for featured sort
        let apiUrl;
        if (selectedSort === 'featured') {
          apiUrl = apiUrls.Blogs.getFeaturedBlogs({
            limit: blogsPerPage,
            with_content: false,
            category: selectedCategory !== "all" ? selectedCategory : "",
          });
        } else {
          apiUrl = apiUrls.Blogs.getAllBlogs(queryParams);
        }

        const response = await getQuery({
        url: apiUrl,
          showToast: false,
        });

        if (response) {
          // Handle different response structures
          let blogsList: IBlog[] = [];
          let total = 0;

          if (Array.isArray(response)) {
            // Direct array response
            blogsList = response;
            total = response.length;
          } else if (response.blogs && Array.isArray(response.blogs)) {
            // Response with blogs array
            blogsList = response.blogs;
            total = response.totalCount || response.total || response.blogs.length;
          } else if (response.data && Array.isArray(response.data)) {
            // Response with data array
            blogsList = response.data;
            total = response.totalCount || response.total || response.data.length;
          }

          setBlogs(blogsList);
          setTotalCount(total);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
        // Keep existing blogs on error
      }
    };

    fetchBlogs();
  }, [currentPage, selectedCategory, selectedSort, searchTerm, getQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  // Handle sort change
  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
    setCurrentPage(1); // Reset to first page
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / blogsPerPage);

  return (
    <section className="relative min-h-screen py-12 bg-gray-50/30 dark:bg-gray-900/30">
      <div className="container mx-auto px-4 max-w-7xl">
              {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-search relative">
              <div className="flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {['latest', 'popular', 'featured'].map((sortType) => (
                    <button
                key={sortType}
                onClick={() => handleSortChange(sortType)}
                className={`glass-filter-btn px-4 py-2 text-sm font-medium ${
                  selectedSort === sortType ? 'active' : ''
                }`}
              >
                {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                {selectedSort === sortType && (
                  <ArrowRight className="inline-block w-4 h-4 ml-2" />
                )}
                                </button>
                              ))}
                          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
                                <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`glass-filter-btn px-4 py-2 text-sm font-medium ${
                  selectedCategory === category ? 'active' : ''
                }`}
              >
                {category === "all" ? "All Articles" : category}
                {selectedCategory === category && (
                  <ArrowRight className="inline-block w-4 h-4 ml-2" />
                )}
                                  </button>
                                ))}
                              </div>
                            </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {blogsLoading ? (
              "Loading articles..."
            ) : (
              <>
                {totalCount} article{totalCount !== 1 ? 's' : ''} found
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {searchTerm && ` for "${searchTerm}"`}
              </>
            )}
          </p>
                  </div>

        {/* Loading State */}
        {blogsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array(9).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96"></div>
              </div>
            ))}
                    </div>
        )}

        {/* Professional Grid Layout */}
        {!blogsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog) => (
              <BlogCard 
                key={blog._id}
                blog={blog}
                className="h-full"
              />
            ))}
                  </div>
        )}

        {/* Empty State */}
        {!blogsLoading && blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-search inline-block p-8 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
                  </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? (
                  <>Try adjusting your search terms or filters</>
                ) : (
                  <>No articles are available at the moment</>
                )}
              </p>
            </div>
          </div>
        )}
            
            {/* Pagination */}
        {!blogsLoading && totalPages > 1 && (
          <div className="mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
              onPageChange={handlePageChange}
                />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogsPrimary;
