"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Clock, Eye, Calendar, ArrowUpRight, Loader2, Sparkles, Brain, Wand2, TrendingUp } from "lucide-react";
import BlogCard from "@/components/sections/blogs/BlogCard";
import { useTheme } from "next-themes";
import { useGetQuery } from "@/hooks";
import { apiUrls, IBlog, aiUtils, IAIBlogSuggestionsInput, IAIBlogEnhanceInput } from "@/apis";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface BlogsMainProps {
  initialBlogs?: IBlog[];
  totalBlogs?: number;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
  initialFilters?: {
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
    page?: number;
  };
}

// Enhanced sorting options with AI features
const SORT_OPTIONS = [
  { id: 'latest', name: 'Latest', icon: Clock },
  { id: 'popular', name: 'Most Popular', icon: Eye },
  { id: 'featured', name: 'Featured', icon: ArrowUpRight },
  { id: 'ai-enhanced', name: 'AI Enhanced', icon: Sparkles },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
];

// View options
const VIEW_OPTIONS = [
  { id: 'grid', name: 'Grid View', icon: Grid },
  { id: 'list', name: 'List View', icon: List },
];

// AI Enhancement Modal Component
const AIEnhancementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  blog: IBlog | null;
  onEnhance: (blog: IBlog, enhancementType: string) => void;
}> = ({ isOpen, onClose, blog, onEnhance }) => {
  const [enhancementType, setEnhancementType] = useState('improve');
  const [customPrompt, setCustomPrompt] = useState('');
  
  if (!isOpen || !blog) return null;
  
  const enhancementOptions = [
    { id: 'improve', name: 'Improve Content', description: 'Enhance readability and engagement' },
    { id: 'expand', name: 'Expand Content', description: 'Add more details and examples' },
    { id: 'summarize', name: 'Create Summary', description: 'Generate a concise summary' },
    { id: 'rewrite', name: 'Rewrite Style', description: 'Change writing style and tone' },
    { id: 'custom', name: 'Custom Enhancement', description: 'Specify your own requirements' }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Content Enhancement
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Enhance "{blog.title}" with AI-powered improvements
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {enhancementOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  enhancementType === option.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="enhancement"
                  value={option.id}
                  checked={enhancementType === option.id}
                  onChange={(e) => setEnhancementType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          {enhancementType === 'custom' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Enhancement Instructions
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe how you want the content to be enhanced..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onEnhance(blog, enhancementType);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Enhance Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogsMain: React.FC<BlogsMainProps> = ({ 
  initialBlogs = [], 
  totalBlogs = 0,
  currentPage: initialCurrentPage = 1,
  totalPages: initialTotalPages = 1,
  hasMore: initialHasMore = false,
  initialFilters = {} 
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  // Enhanced state management
  const [blogs, setBlogs] = useState<IBlog[]>(initialBlogs);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");
  const [tempSearchTerm, setTempSearchTerm] = useState(initialFilters.search || "");
  const [selectedSort, setSelectedSort] = useState(initialFilters.featured ? "featured" : "latest");
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalCount, setTotalCount] = useState(totalBlogs);
  const [totalPagesCount, setTotalPagesCount] = useState(initialTotalPages);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Enhancement states
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedBlogForAI, setSelectedBlogForAI] = useState<IBlog | null>(null);
  const [aiProcessing, setAiProcessing] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  const blogsPerPage = 12;
  const isDark = mounted ? theme === 'dark' : false;

  // API hooks
  const { getQuery } = useGetQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch blogs based on current filters
  const fetchBlogs = async (
    search = searchTerm,
    sort = selectedSort,
    page = currentPage
  ) => {
    setIsLoading(true);
    try {
      const queryParams: any = {
        page,
        limit: blogsPerPage,
        sort_by: sort === 'latest' ? 'createdAt' : 
                 sort === 'popular' ? 'views' : 
                 sort === 'featured' ? 'featured' :
                 sort === 'ai-enhanced' ? 'ai_enhanced' :
                 sort === 'trending' ? 'trending_score' : 'createdAt',
        sort_order: 'desc',
        status: 'published',
        with_content: false,
      };

      if (search.trim()) {
        queryParams.search = search.trim();
      }

      if (initialFilters.category && initialFilters.category !== 'all') {
        queryParams.category = initialFilters.category;
      }

      if (sort === 'featured') {
        queryParams.featured = true;
      }

      if (sort === 'ai-enhanced') {
        queryParams.ai_enhanced = true;
      }

      const response = await getQuery({
        url: apiUrls.Blogs.getAllBlogs(queryParams),
        showToast: false,
      });

      if (response) {
        const blogsList = response.data || response || [];
        const total = response.pagination?.total || response.total || blogsList.length;
        const pages = response.pagination?.pages || Math.ceil(total / blogsPerPage);
        
        setBlogs(blogsList);
        setTotalCount(total);
        setTotalPagesCount(pages);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI content suggestions
  const generateAISuggestions = async () => {
    try {
      setShowAISuggestions(true);
      const input: IAIBlogSuggestionsInput = {
        topic: searchTerm || "education technology and learning",
        categories: ["education", "technology", "learning"],
        count: 5,
        approach: 'professional'
      };
      
      const response = await aiUtils.generateBlogSuggestions(input);
      
      if (response.success && response.data.suggestions) {
        setAiSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  };

  // Handle AI content enhancement
  const handleAIEnhancement = async (blog: IBlog, enhancementType: string) => {
    setAiProcessing(blog._id);
    
    try {
      const input: IAIBlogEnhanceInput = {
        blogId: blog._id,
        enhancementType: enhancementType as any,
        updateInDatabase: true
      };
      
      const response = await aiUtils.enhanceExistingBlog(input);
      
      if (response.success) {
        // Update the blog in the list
        setBlogs(prevBlogs => 
          prevBlogs.map(b => 
            b._id === blog._id 
              ? { ...b, content: response.data.enhancedContent, ai_enhanced: true }
              : b
          )
        );
        
        // Show success message or redirect to editor
        router.push(`/dashboard/blogs/edit/${blog._id}`);
      }
    } catch (error) {
      console.error('Error enhancing blog:', error);
    } finally {
      setAiProcessing(null);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSearchTerm !== searchTerm) {
      setSearchTerm(tempSearchTerm);
      setCurrentPage(1);
      
      // Update URL
      const params = new URLSearchParams(searchParams);
      if (tempSearchTerm.trim()) {
        params.set('search', tempSearchTerm.trim());
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.push(`/blogs?${params.toString()}`);
    }
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    if (sort !== selectedSort) {
      setSelectedSort(sort);
      setCurrentPage(1);
      
      // Update URL
      const params = new URLSearchParams(searchParams);
      if (sort === 'featured') {
        params.set('featured', 'true');
      } else if (sort === 'ai-enhanced') {
        params.set('ai_enhanced', 'true');
      } else {
        params.delete('featured');
        params.delete('ai_enhanced');
      }
      params.delete('page');
      router.push(`/blogs?${params.toString()}`);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/blogs?${params.toString()}`);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch blogs when filters change
  useEffect(() => {
    if (mounted) {
      fetchBlogs(searchTerm, selectedSort, currentPage);
    }
  }, [mounted, searchTerm, selectedSort, currentPage]);

  // Clear search
  const clearSearch = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setCurrentPage(1);
    
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    router.push(`/blogs?${params.toString()}`);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Enhanced Search and Filters Bar */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search with AI Suggestions */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, tutorials..."
                  value={tempSearchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                {tempSearchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* AI Suggestions Button */}
              <button
                type="button"
                onClick={generateAISuggestions}
                className="mt-2 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Brain className="w-4 h-4" />
                Get AI Content Suggestions
              </button>
            </form>
            
            {/* Enhanced Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Sort by:
              </span>
              <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                {SORT_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isActive = selectedSort === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{option.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {VIEW_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isActive = viewMode === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setViewMode(option.id as 'grid' | 'list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={option.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Results Info with AI Features */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading articles...</span>
                </div>
              ) : (
                <>
                  {totalCount > 0 ? (
                    <span>
                      Showing <strong>{((currentPage - 1) * blogsPerPage) + 1}</strong> to{" "}
                      <strong>{Math.min(currentPage * blogsPerPage, totalCount)}</strong> of{" "}
                      <strong>{totalCount}</strong> articles
                      {searchTerm && (
                        <span> for "<strong>{searchTerm}</strong>"</span>
                      )}
                    </span>
                  ) : (
                    <span>No articles found</span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Clear search
                </button>
              )}
              
              {/* AI Enhancement Toggle */}
              <button
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                  showAISuggestions
                    ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Tools
              </button>
            </div>
          </div>
        </div>
        
        {/* AI Suggestions Panel */}
        {showAISuggestions && aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Content Suggestions
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {suggestion.description}
                  </p>
                  <button
                    onClick={() => router.push(`/dashboard/blogs/new?suggestion=${encodeURIComponent(JSON.stringify(suggestion))}`)}
                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Wand2 className="w-4 h-4" />
                    Create Article
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading articles...</span>
            </div>
          </div>
        )}
        
        {/* Enhanced Blog Grid/List with AI Features */}
        {!isLoading && blogs.length > 0 && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
          }`}>
            {blogs.map((blog, index) => (
              <article 
                key={blog._id} 
                className={`group relative ${viewMode === 'list' ? 'flex gap-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300' : ''}`}
              >
                {/* AI Enhancement Button */}
                <button
                  onClick={() => {
                    setSelectedBlogForAI(blog);
                    setShowAIModal(true);
                  }}
                  className="absolute top-2 right-2 z-10 p-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-700"
                  title="Enhance with AI"
                >
                  {aiProcessing === blog._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
                
                {viewMode === 'grid' ? (
                  <BlogCard blog={blog} />
                ) : (
                  <>
                    {/* List View Image */}
                    <div className="flex-shrink-0">
                      <Link href={`/blogs/${blog.slug}`}>
                        <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden">
                          {blog.upload_image && (
                            <img
                              src={blog.upload_image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                    
                    {/* List View Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                          {blog.categories?.[0]?.category_name || 'Article'}
                        </span>
                        {blog.ai_enhanced && (
                          <span className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Enhanced
                          </span>
                        )}
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                        {blog.reading_time && (
                          <>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{blog.reading_time} min read</span>
                          </>
                        )}
                      </div>
                      
                      <Link href={`/blogs/${blog.slug}`}>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {blog.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {blog.description || blog.meta_description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {blog.author?.name && (
                            <span>By {blog.author.name}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.views || 0}</span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
                        >
                          Read more
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
                : "No articles are available at the moment. Check back later for new content."
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse all articles
              </button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && totalPagesCount > 1 && (
          <div className="mt-12">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPagesCount) }, (_, index) => {
                  let pageNumber;
                  if (totalPagesCount <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPagesCount - 2) {
                    pageNumber = totalPagesCount - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPagesCount}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Page {currentPage} of {totalPagesCount}
            </p>
          </div>
        )}
      </div>
      
      {/* AI Enhancement Modal */}
      <AIEnhancementModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        blog={selectedBlogForAI}
        onEnhance={handleAIEnhancement}
      />
    </section>
  );
};

export default BlogsMain;
