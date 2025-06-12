"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Grid3X3, List, ChevronDown, Tag, Calendar, User, Eye, Heart, MessageCircle, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

// Components
import BlogCard from "@/components/sections/blogs/BlogCard";
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
import Pagination from "@/components/sections/blogs/pagination";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// APIs and Types
import { blogAPI } from "@/apis/blog.api";
import { IBlog, IBlogQueryParams } from "@/types/blog.types";

// Interfaces
interface IBlogsMainProps {
  initialBlogs?: IBlog[];
  totalBlogs?: number;
  initialFilters?: {
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
  };
}

interface IBlogFilters {
  category: string;
  tag: string;
  featured: boolean;
  search: string;
  sort: 'latest' | 'popular' | 'trending';
}

interface IBlogStats {
  totalBlogs: number;
  totalPages: number;
  currentPage: number;
  featuredCount: number;
  categories: string[];
  tags: { name: string; count: number }[];
}

const DEFAULT_BLOG_IMAGE = 'https://placehold.co/600x400/f5f5f5/a0aec0?text=Medh+Blog';

const BlogsMain: React.FC<IBlogsMainProps> = ({ 
  initialBlogs = [], 
  totalBlogs = 0, 
  initialFilters = {} 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for blog data
  const [blogs, setBlogs] = useState<IBlog[]>(initialBlogs);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [blogStats, setBlogStats] = useState<IBlogStats>({
    totalBlogs,
    totalPages: Math.ceil(totalBlogs / 9),
    currentPage: 0,
    featuredCount: 0,
    categories: [],
    tags: []
  });
  
  const limit = 9;
  
  // State for filters
  const [filters, setFilters] = useState<IBlogFilters>({
    category: initialFilters.category || searchParams.get('category') || '',
    tag: initialFilters.tag || searchParams.get('tag') || '',
    featured: initialFilters.featured || searchParams.get('featured') === 'true',
    search: initialFilters.search || searchParams.get('search') || '',
    sort: (searchParams.get('sort') as 'latest' | 'popular' | 'trending') || 'latest'
  });
  
  // State for UI
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>(filters.search);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  
  // Memoized hero content
  const heroContent = useMemo(() => {
    let title = "LEARN GROW INSPIRE CONTINUOUSLY";
    let description = "Explore our latest educational insights, tips, and industry trends";
    
    if (filters.category) {
      title = `${filters.category} Articles`;
      description = `Explore our educational insights about ${filters.category}`;
    } else if (filters.tag) {
      title = `${filters.tag} Articles`;
      description = `Explore our educational content related to ${filters.tag}`;
    } else if (filters.featured) {
      title = "Featured Articles";
      description = "Our selection of must-read educational content";
    } else if (filters.search) {
      title = `Search Results for "${filters.search}"`;
      description = `Found ${blogStats.totalBlogs} articles matching your search`;
    }
    
    return { title, description };
  }, [filters, blogStats.totalBlogs]);
  
  // Fetch blog data
  const fetchBlogs = useCallback(async (page: number = 0, newFilters?: Partial<IBlogFilters>) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = { ...filters, ...newFilters };
      const queryParams: IBlogQueryParams = {
        page: page + 1,
        limit,
        sort_by: currentFilters.sort === 'latest' ? 'createdAt' : 
                currentFilters.sort === 'popular' ? 'views' : 
                currentFilters.sort === 'trending' ? 'likes' : 'createdAt',
        sort_order: 'desc',
        status: 'published'
      };
      
      if (currentFilters.search) queryParams.search = currentFilters.search;
      if (currentFilters.category) queryParams.category = currentFilters.category;
      if (currentFilters.tag) queryParams.tags = currentFilters.tag;
      if (currentFilters.featured) queryParams.featured = true;
      
      let result;
      
      // Use specific endpoints based on filters
      if (currentFilters.search && currentFilters.search.trim()) {
        result = await blogAPI.searchBlogs({
          query: currentFilters.search,
          limit,
          category: currentFilters.category || undefined,
          tags: currentFilters.tag || undefined
        });
      } else if (currentFilters.category) {
        result = await blogAPI.getBlogsByCategory(currentFilters.category, queryParams);
      } else if (currentFilters.tag) {
        result = await blogAPI.getBlogsByTag(currentFilters.tag, queryParams);
      } else if (currentFilters.featured) {
        result = await blogAPI.getFeaturedBlogs(queryParams);
      } else {
        result = await blogAPI.getAllBlogs(queryParams);
      }
      
      if (result.status === 'success' && result.data?.success && result.data?.data) {
        const transformedBlogs = result.data.data.map((blog: IBlog) => ({
          ...blog,
          upload_image: blog.upload_image || DEFAULT_BLOG_IMAGE
        }));
        
        setBlogs(transformedBlogs);
        setBlogStats(prev => ({
          ...prev,
          totalBlogs: result.data.pagination?.total || 0,
          totalPages: result.data.pagination?.pages || Math.ceil((result.data.pagination?.total || 0) / limit),
          currentPage: (result.data.pagination?.page || 1) - 1 // Convert to 0-based indexing
        }));
      } else {
        setError("Failed to fetch blogs");
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("An error occurred while fetching blogs");
      setBlogs([]);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [filters, limit]);
  
  // Fetch categories and tags
  const fetchMetadata = useCallback(async () => {
    try {
      const [categoriesResult, tagsResult] = await Promise.all([
        blogAPI.getBlogCategories(),
        blogAPI.getBlogTags(20, true)
      ]);
      
      setBlogStats(prev => ({
        ...prev,
        categories: categoriesResult.status === 'success' ? categoriesResult.data?.categories || [] : [],
        tags: tagsResult.status === 'success' ? tagsResult.data?.tags || [] : []
      }));
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  }, []);
  
  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilters(prev => ({ ...prev, search: '' }));
      return;
    }
    
    setSearchLoading(true);
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(0);
    
    try {
      await fetchBlogs(0, { search: query });
    } finally {
      setSearchLoading(false);
    }
  }, [fetchBlogs]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof IBlogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
    fetchBlogs(0, { [key]: value });
  }, [fetchBlogs]);
  
  // Handle pagination
  const handlePagination = useCallback((page: number) => {
    setCurrentPage(page);
    fetchBlogs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchBlogs]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: IBlogFilters = {
      category: '',
      tag: '',
      featured: false,
      search: '',
      sort: 'latest'
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(0);
    fetchBlogs(0, clearedFilters);
  }, [fetchBlogs]);
  
  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.featured) params.set('featured', 'true');
    if (filters.search) params.set('search', filters.search);
    if (filters.sort !== 'latest') params.set('sort', filters.sort);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);
  
  // Initial data fetch
  useEffect(() => {
    if (initialBlogs.length === 0) {
      fetchBlogs();
    }
    fetchMetadata();
  }, [fetchBlogs, fetchMetadata, initialBlogs.length]);
  
  // Search input handler
  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  // Search submit handler
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);
  
  // Active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      typeof value === 'boolean' ? value : value !== ''
    ).length - 1; // Subtract 1 for the sort filter which is always active
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroPrimary 
        title={heroContent.title}
        path="Blogs" 
        description={heroContent.description}
        className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 dark:from-primary-900/10 dark:via-gray-900 dark:to-secondary-900/10"
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary-600" />
                Search Articles
              </h3>
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Search articles..."
                    className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  {searchLoading && (
                    <div className="absolute right-3 top-3.5">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>
            
            {/* Filter Sidebar */}
            <BlogsSidebar
              categories={blogStats.categories}
              tags={blogStats.tags}
              selectedCategory={filters.category}
              selectedTag={filters.tag}
              onCategoryChange={(category) => handleFilterChange('category', category)}
              onTagChange={(tag) => handleFilterChange('tag', tag)}
              onFeaturedChange={(featured) => handleFilterChange('featured', featured)}
              featuredSelected={filters.featured}
            />
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Results Info */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Loading...
                      </div>
                    ) : (
                      `${blogStats.totalBlogs} articles found`
                    )}
                  </div>
                  
                  {/* Active Filters */}
                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                      </span>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Viewed</option>
                    <option value="trending">Most Liked</option>
                  </select>
                  
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } transition-colors`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } transition-colors`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => fetchBlogs(currentPage)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Loading State */}
            {loading && blogs.length === 0 && (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading articles...</p>
              </div>
            )}
            
            {/* Empty State */}
            {!loading && blogs.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {filters.search ? 
                    `No articles match your search for "${filters.search}"` :
                    "Try adjusting your filters to find more articles"
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {/* Blog Grid/List */}
            {!loading && blogs.length > 0 && (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }
              `}>
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    viewMode={viewMode}
                    onLike={async (blogId) => {
                      try {
                        await blogAPI.likeBlog(blogId);
                        // Update the blog in the list
                        setBlogs(prev => prev.map(b => 
                          b._id === blogId 
                            ? { ...b, likes: b.likes + 1 }
                            : b
                        ));
                        toast.success('Article liked!');
                      } catch (error) {
                        toast.error('Please login to like articles');
                      }
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && blogs.length > 0 && blogStats.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={blogStats.totalPages}
                onPageChange={handlePagination}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogsMain; 