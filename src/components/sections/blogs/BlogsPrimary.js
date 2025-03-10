"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Filter, ChevronDown, X, Tag, Grid3X3, List } from "lucide-react";
import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import BlogCard from "@/components/sections/blogs/BlogCard";
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
import Pagination from "./pagination";

// Default blog image as fallback - using a placeholder URL instead of a local file
const DEFAULT_BLOG_IMAGE = 'https://placehold.co/600x400/f5f5f5/a0aec0?text=Medh+Blog';

const BlogsPrimary = ({ initialBlogs = [], totalBlogs = 0, initialFilters = {} }) => {
  // State for blog data
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [blogsCount, setBlogsCount] = useState(totalBlogs);
  const limit = 9;
  const totalPages = Math.ceil(blogsCount / limit);
  
  // State for filters
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    tag: initialFilters.tag || '',
    featured: initialFilters.featured || false,
    search: '',
    sort: 'latest'
  });
  
  // State for UI
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Refs
  const blogsRef = useRef(null);
  const filterRef = useRef(null);
  const { getQuery } = useGetQuery();
  
  // Effect to handle filter dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Effect to update URL with filters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      
      // Clear existing parameters
      Array.from(url.searchParams.keys()).forEach(key => {
        url.searchParams.delete(key);
      });
      
      // Add active filters to URL
      if (filters.category) url.searchParams.set('category', filters.category);
      if (filters.tag) url.searchParams.set('tag', filters.tag);
      if (filters.featured) url.searchParams.set('featured', 'true');
      if (filters.search) url.searchParams.set('search', filters.search);
      
      // Update browser history without reloading
      window.history.pushState({}, '', url.toString());
    }
  }, [filters]);
  
  // Effect to fetch categories and tags
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getQuery({
          url: apiUrls.Blogs.getBlogCategories,
        });
        
        if (result.success) {
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchTags = async () => {
      try {
        const result = await getQuery({
          url: apiUrls.Blogs.getBlogTags ? apiUrls.Blogs.getBlogTags() : '/blogs/tags',
        });
        
        if (result.success) {
          setTags(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    
    fetchCategories();
    fetchTags();
  }, []);
  
  // Effect to load initial blogs if none provided
  useEffect(() => {
    if (initialBlogs.length === 0) {
      fetchBlogs();
    }
  }, []);
  
  // Modified function to transform blogs with default image when needed
  const fetchBlogs = async (page = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = {
        limit: limit,
        page: page + 1,
        sort_by: filters.sort === 'latest' ? 'createdAt' : 
                filters.sort === 'popular' ? 'views' : 'createdAt',
        sort_order: 'desc',
        status: 'published'
      };
      
      if (filters.category) queryParams.category = filters.category;
      if (filters.tag) queryParams.tags = filters.tag;
      if (filters.search) queryParams.search = filters.search;
      
      const apiUrl = filters.featured 
        ? apiUrls.Blogs.getFeaturedBlogs({
            ...queryParams,
            type: 'featured'
          })
        : apiUrls.Blogs.getAllBlogs(queryParams);
      
      const result = await getQuery({
        url: apiUrl,
      });
      
      if (result.success) {
        // Transform blogs to ensure they have an image property
        const transformedBlogs = (result.data || []).map(blog => ({
          ...blog,
          upload_image: blog.upload_image || DEFAULT_BLOG_IMAGE
        }));
        
        setBlogs(transformedBlogs);
        
        // If count not provided from server, fetch it
        if (!totalBlogs) {
          const countResult = await getQuery({
            url: apiUrls.Blogs.getAllBlogs({
              count_only: true,
              category: filters.category || '',
              tags: filters.tag || '',
              search: filters.search || '',
              status: 'published'
            }),
          });
          
          if (countResult.success) {
            setBlogsCount(countResult.data.count || 0);
          }
        }
      } else {
        setError("Failed to fetch blogs");
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("An error occurred while fetching blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle pagination
  const handlePagination = (id) => {
    if (blogsRef.current) {
      blogsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    if (typeof id === "number") {
      setCurrentPage(id);
      setSkip(limit * id);
      fetchBlogs(id);
    } else if (id === "prev" && currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setSkip(limit * newPage);
      fetchBlogs(newPage);
    } else if (id === "next" && currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setSkip(limit * newPage);
      fetchBlogs(newPage);
    }
  };
  
  // Function to apply filters
  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
    setSkip(0);
    fetchBlogs(0);
  };
  
  // Function to clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      tag: '',
      featured: false,
      search: '',
      sort: 'latest'
    });
    setCurrentPage(0);
    setSkip(0);
    fetchBlogs(0);
  };
  
  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: e.target.search.value });
  };

  return (
    <div className="container py-10 md:py-16 lg:py-20" ref={blogsRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          {/* Filters and search bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative w-full md:w-auto md:min-w-[300px]">
                <input
                  type="text"
                  name="search"
                  placeholder="Search articles..."
                  className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  defaultValue={filters.search}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Search size={18} />
                </button>
              </form>
              
              {/* Filter button and View mode */}
              <div className="flex items-center gap-3">
                {/* View mode toggle */}
                <div className="hidden md:flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
                
                {/* Filter dropdown */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <Filter size={18} />
                    <span>Filter</span>
                    <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                      
                      {/* Categories */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <input
                                  type="radio"
                                  id={`category-${category.id}`}
                                  name="category"
                                  className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                                  checked={filters.category === category.name}
                                  onChange={() => applyFilters({ category: category.name })}
                                />
                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {category.name} {category.count && `(${category.count})`}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No categories available</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Popular Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {tags.slice(0, 10).map((tag, index) => (
                            <button
                              key={index}
                              onClick={() => applyFilters({ tag: tag.name })}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                                filters.tag === tag.name
                                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              <Tag size={12} className="mr-1" />
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sort */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sort By</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="sort-latest"
                              name="sort"
                              className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                              checked={filters.sort === 'latest'}
                              onChange={() => applyFilters({ sort: 'latest' })}
                            />
                            <label
                              htmlFor="sort-latest"
                              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              Latest
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="sort-popular"
                              name="sort"
                              className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                              checked={filters.sort === 'popular'}
                              onChange={() => applyFilters({ sort: 'popular' })}
                            />
                            <label
                              htmlFor="sort-popular"
                              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              Popular
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Featured */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500"
                            checked={filters.featured}
                            onChange={(e) => applyFilters({ featured: e.target.checked })}
                          />
                          <label
                            htmlFor="featured"
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            Featured blogs only
                          </label>
                        </div>
                      </div>
                      
                      {/* Apply button */}
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            {(filters.category || filters.tag || filters.featured || filters.search) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                
                {filters.category && (
                  <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm">
                    <span>Category: {filters.category}</span>
                    <button
                      onClick={() => applyFilters({ category: '' })}
                      className="ml-2 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {filters.tag && (
                  <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm">
                    <span>Tag: {filters.tag}</span>
                    <button
                      onClick={() => applyFilters({ tag: '' })}
                      className="ml-2 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {filters.featured && (
                  <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm">
                    <span>Featured only</span>
                    <button
                      onClick={() => applyFilters({ featured: false })}
                      className="ml-2 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {filters.search && (
                  <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm">
                    <span>Search: {filters.search}</span>
                    <button
                      onClick={() => applyFilters({ search: '' })}
                      className="ml-2 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill().map((_, index) => (
                <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchBlogs(currentPage)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No blogs found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {Object.values(filters).some(value => value) 
                  ? "Try adjusting your filters or search term" 
                  : "Check back later for new content"}
              </p>
              {Object.values(filters).some(value => value) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
          
          {/* Blogs grid */}
          {!loading && !error && blogs.length > 0 && (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-6"
            }>
              {blogs.map((blog, index) => (
                <BlogCard 
                  key={blog._id || index}
                  blog={blog}
                  variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && blogs.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePagination={handlePagination}
              />
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <BlogsSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogsPrimary;
