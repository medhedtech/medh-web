"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaCalendarAlt, 
  FaFilter, 
  FaDownload, 
  FaEye,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCopy,
  FaLink,
  FaChartLine,
  FaCog,
  FaImage,
  FaUser,
  FaCalendar,
  FaEllipsisV,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaHeart,
  FaExternalLinkAlt,
  FaPen,
  FaEllipsisH,
  FaRobot,
  FaMagic,
  FaPause,
  FaPlay,
  FaStop
} from "react-icons/fa";
import { 
  MoreVertical, 
  Loader, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  CheckSquare,
  Square,
  RefreshCw,
  Settings,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink
} from "lucide-react";
import { apiUrls, aiUtils, IAIBlogEnhanceInput } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import useDeleteQuery from "@/hooks/deleteQuery.hook";
import usePutQuery from "@/hooks/putQuery.hook";
import AddBlog from "./AddBlogs";
import EditBlog from "./EditBlog";
import DatePicker from "react-datepicker";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced TypeScript interfaces
interface IBlogData {
  _id: string;
  title: string;
  description: string;
  content?: string;
  upload_image: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  slug: string;
  meta_title?: string;
  meta_description?: string;
  blog_link?: string;
  categories: Array<{
    _id: string;
    category_name: string;
  }>;
  tags: string[];
  views: number;
  likes: number;
  commentCount: number;
}

interface IAnalytics {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalLikes: number;
  avgViewsPerBlog: number;
  recentActivity: number;
}

interface ISortConfig {
  key: keyof IBlogData | 'author.name' | 'categories';
  direction: 'asc' | 'desc';
}

interface IFilterConfig {
  status: string[];
  featured: boolean | null;
  author: string[];
  categories: string[];
  dateRange: [Date | null, Date | null];
}

const formatDate = (date: string): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const AdminBlogs: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  
  // State Management
  const [showAddBlogForm, setShowAddBlogForm] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<IBlogData | null>(null);
  const [blogs, setBlogs] = useState<IBlogData[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  
  // AI Enhancement State
  const [showAiEnhancement, setShowAiEnhancement] = useState<boolean>(false);
  const [aiEnhancementProgress, setAiEnhancementProgress] = useState<{
    isRunning: boolean;
    isPaused: boolean;
    currentIndex: number;
    totalBlogs: number;
    currentBlog: IBlogData | null;
    processedBlogs: string[];
    failedBlogs: { id: string; error: string }[];
    successCount: number;
    failureCount: number;
  }>({
    isRunning: false,
    isPaused: false,
    currentIndex: 0,
    totalBlogs: 0,
    currentBlog: null,
    processedBlogs: [],
    failedBlogs: [],
    successCount: 0,
    failureCount: 0
  });
  
  // Sorting and Filtering
  const [sortConfig, setSortConfig] = useState<ISortConfig>({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState<IFilterConfig>({
    status: [],
    featured: null,
    author: [],
    categories: [],
    dateRange: [null, null]
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  const { getQuery, loading: getLoading } = useGetQuery();
  const { deleteQuery, loading: deleteLoading } = useDeleteQuery();
  const { putQuery, loading: putLoading } = usePutQuery();
  
  const isDark = mounted ? theme === 'dark' : true;

  // Mount effect
  useEffect(() => {
    setMounted(true);
    
    // Global click handler to close dropdowns
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        // Close all dropdowns
        document.querySelectorAll('.absolute.opacity-100').forEach(dropdown => {
          dropdown.classList.add('opacity-0', 'invisible');
          dropdown.classList.remove('opacity-100', 'visible');
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Analytics calculation
  const analytics: IAnalytics = useMemo(() => {
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;
    const draftBlogs = blogs.filter(blog => blog.status === 'draft').length;
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
    const avgViewsPerBlog = totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;
    const recentActivity = blogs.filter(blog => 
      new Date(blog.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      totalLikes,
      avgViewsPerBlog,
      recentActivity
    };
  }, [blogs]);

  // Fetch Blogs Data
  const fetchBlogs = useCallback(async (): Promise<void> => {
    try {
      await getQuery({
        url: apiUrls?.Blogs?.getAllBlogs({
          page: 1,
          limit: 1000,
          sort_by: "createdAt",
          sort_order: "desc",
          with_content: false
        }),
        onSuccess: (response: any) => {
          let blogData: IBlogData[] = [];
          
          if (response?.success && Array.isArray(response?.data)) {
            blogData = response.data;
          } else if (Array.isArray(response?.data?.blogs)) {
            blogData = response.data.blogs;
          } else if (Array.isArray(response?.blogs)) {
            blogData = response.blogs;
          } else if (Array.isArray(response)) {
            blogData = response;
          }

          setBlogs(blogData);
          showToast.success(`Successfully loaded ${blogData.length} blogs`);
        },
        onFail: (err: any) => {
          console.error("API error:", err);
          setBlogs([]);
          showToast.error("Failed to fetch blogs");
        },
      });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
      showToast.error("Something went wrong!");
    }
  }, [getQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filtering and Sorting Logic
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = [...blogs];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((blog) =>
        blog.title?.toLowerCase().includes(query) ||
        blog.description?.toLowerCase().includes(query) ||
        blog.author?.name?.toLowerCase().includes(query) ||
        blog.categories?.some(cat => cat.category_name?.toLowerCase().includes(query)) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(blog => filters.status.includes(blog.status));
    }

    // Apply featured filter
    if (filters.featured !== null) {
      filtered = filtered.filter(blog => blog.featured === filters.featured);
    }

    // Apply author filter
    if (filters.author.length > 0) {
      filtered = filtered.filter(blog => filters.author.includes(blog.author._id));
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(blog => 
        blog.categories?.some(cat => filters.categories.includes(cat._id))
      );
    }

    // Apply date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(blog => {
        const blogDate = new Date(blog.createdAt);
        return blogDate >= filters.dateRange[0]! && blogDate <= filters.dateRange[1]!;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'author.name':
          aValue = a.author?.name || '';
          bValue = b.author?.name || '';
          break;
        case 'categories':
          aValue = a.categories?.[0]?.category_name || '';
          bValue = b.categories?.[0]?.category_name || '';
          break;
        default:
          aValue = a[sortConfig.key as keyof IBlogData];
          bValue = b[sortConfig.key as keyof IBlogData];
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [blogs, searchQuery, filters, sortConfig]);

  // Pagination
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBlogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);

  // Handlers
  const handleSort = (key: keyof IBlogData | 'author.name' | 'categories') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedBlogs.size === paginatedBlogs.length) {
      setSelectedBlogs(new Set());
    } else {
      setSelectedBlogs(new Set(paginatedBlogs.map(blog => blog._id)));
    }
  };

  const handleSelectBlog = (blogId: string) => {
    const newSelected = new Set(selectedBlogs);
    if (newSelected.has(blogId)) {
      newSelected.delete(blogId);
    } else {
      newSelected.add(blogId);
    }
    setSelectedBlogs(newSelected);
  };

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      // Check if API is available
      if (!apiUrls?.Blogs?.deleteBlog) {
        showToast.error("Delete API is not available. Please check your connection.");
        return;
      }

      await deleteQuery({
        url: apiUrls.Blogs.deleteBlog(id),
        onSuccess: (res: { message?: string }) => {
          showToast.success(res?.message || "Blog deleted successfully");
          fetchBlogs();
          setSelectedBlogs(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        },
        onFail: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete blog";
          showToast.error(errorMessage);
          console.error("Delete failed:", error);
          
          // Fallback: Remove from local state if server delete fails
          if (window.confirm("Server delete failed. Remove from local view anyway?")) {
            setBlogs(prev => prev.filter(blog => blog._id !== id));
            setSelectedBlogs(prev => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
            showToast.info("Removed from local view (server may still have the blog)");
          }
        },
      });
    } catch (error) {
      showToast.error("Network error occurred. Please check your connection.");
      console.error("Error:", error);
    }
  }, [deleteQuery, fetchBlogs]);

  const handleBulkDelete = async () => {
    if (selectedBlogs.size === 0) {
      showToast.warning("Please select blogs to delete");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedBlogs.size} selected blogs? This action cannot be undone.`)) return;

    // Check if API is available
    if (!apiUrls?.Blogs?.deleteBlog) {
      showToast.error("Delete API is not available. Please check your connection.");
      return;
    }

    let successCount = 0;
    let failCount = 0;
    const failedIds: string[] = [];

    showToast.info(`Deleting ${selectedBlogs.size} blogs...`);

    for (const id of Array.from(selectedBlogs)) {
      try {
        await deleteQuery({
          url: apiUrls.Blogs.deleteBlog(id),
          onSuccess: () => {
            successCount++;
          },
          onFail: (error: any) => {
            failCount++;
            failedIds.push(id);
            console.error(`Failed to delete blog ${id}:`, error);
          }
        });
      } catch (error) {
        failCount++;
        failedIds.push(id);
        console.error(`Error deleting blog ${id}:`, error);
      }
    }

    // Show results
    if (successCount > 0) {
      showToast.success(`Successfully deleted ${successCount} blogs`);
    }
    
    if (failCount > 0) {
      showToast.error(`Failed to delete ${failCount} blogs`);
      
      // Offer to remove failed ones from local view
      if (window.confirm(`${failCount} blogs couldn't be deleted from server. Remove them from local view anyway?`)) {
        setBlogs(prev => prev.filter(blog => !failedIds.includes(blog._id)));
        showToast.info("Removed failed deletions from local view");
      }
    }

    // Clear selection and refresh
    setSelectedBlogs(new Set());
    if (successCount > 0) {
      fetchBlogs();
    }
  };

  const handleToggleFeatured = async (blog: IBlogData) => {
    try {
      // Check if API is available
      if (!apiUrls?.Blogs?.toggleFeatured) {
        showToast.error("Featured toggle API is not available. Please check your connection.");
        return;
      }

      const newFeaturedStatus = !blog.featured;
      
      await putQuery({
        url: apiUrls.Blogs.toggleFeatured(blog._id),
        putData: { featured: newFeaturedStatus },
        onSuccess: () => {
          showToast.success(`Blog ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`);
          fetchBlogs();
        },
        onFail: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to update blog";
          showToast.error(errorMessage);
          
          // Fallback: Update local state if server update fails
          if (window.confirm("Server update failed. Update local view anyway?")) {
            setBlogs(prev => prev.map(b => 
              b._id === blog._id ? { ...b, featured: newFeaturedStatus } : b
            ));
            showToast.info("Updated local view (server may not reflect changes)");
          }
        }
      });
    } catch (error) {
      showToast.error("Network error occurred. Please check your connection.");
      console.error("Toggle featured error:", error);
    }
  };

  const handleStatusChange = async (blog: IBlogData, newStatus: string) => {
    try {
      // Check if API is available
      if (!apiUrls?.Blogs?.updateBlogStatus) {
        showToast.error("Status update API is not available. Please check your connection.");
        return;
      }

      await putQuery({
        url: apiUrls.Blogs.updateBlogStatus(blog._id),
        putData: { status: newStatus },
        onSuccess: () => {
          showToast.success(`Blog status updated to ${newStatus}`);
          fetchBlogs();
        },
        onFail: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to update blog status";
          showToast.error(errorMessage);
          
          // Fallback: Update local state if server update fails
          if (window.confirm("Server update failed. Update local view anyway?")) {
            setBlogs(prev => prev.map(b => 
              b._id === blog._id ? { ...b, status: newStatus as 'draft' | 'published' | 'archived' } : b
            ));
            showToast.info("Updated local view (server may not reflect changes)");
          }
        }
      });
    } catch (error) {
      showToast.error("Network error occurred. Please check your connection.");
      console.error("Status change error:", error);
    }
  };

  // Handle Edit Blog - Fetch full content before editing
  const handleEditBlog = async (blog: IBlogData) => {
    try {
      showToast.info("Loading blog content for editing...");
      
      await getQuery({
        url: apiUrls?.Blogs?.getBlogById(blog._id),
        onSuccess: (response: any) => {
          let fullBlogData: IBlogData;
          
          if (response?.success && response?.data) {
            fullBlogData = response.data;
          } else if (response?.blog) {
            fullBlogData = response.blog;
          } else {
            fullBlogData = response;
          }
          
          console.log('Full blog data loaded for editing:', fullBlogData);
          setEditingBlog(fullBlogData);
          showToast.success("Blog loaded for editing!");
        },
        onFail: (error) => {
          console.error("Failed to fetch full blog data:", error);
          showToast.error("Failed to load blog content. Using basic data...");
          // Fallback to basic blog data
          setEditingBlog(blog);
        }
      });
    } catch (error) {
      console.error("Error loading blog for editing:", error);
      showToast.error("Error loading blog. Using basic data...");
      setEditingBlog(blog);
    }
  };

  // AI Enhancement Functions
  const enhanceBlogWithAI = async (blog: IBlogData): Promise<IBlogData> => {
    try {
      // Step 1: Get AI enhanced content
      const input: IAIBlogEnhanceInput = {
        blogId: blog._id,
        content: blog.content || blog.description,
        enhancementType: 'improve',
        updateInDatabase: true
      };

      const response = await aiUtils.enhanceExistingBlog(input);

      if (!response.success) {
        throw new Error(response.message || 'AI enhancement failed');
      }

      const enhancedData = response.data;
      
      // Step 2: Return the updated blog with enhanced content
      const finalUpdatedBlog: IBlogData = {
        ...blog,
        content: enhancedData.enhancedContent || blog.content,
        updatedAt: new Date().toISOString() // Update the timestamp
      };

      return finalUpdatedBlog;
    } catch (error) {
      console.error("AI Enhancement Error:", error);
      throw new Error(aiUtils.handleAIError(error));
    }
  };

  const startAiEnhancement = async () => {
    const blogsToProcess = selectedBlogs.size > 0 
      ? blogs.filter(blog => selectedBlogs.has(blog._id))
      : blogs;

    if (blogsToProcess.length === 0) {
      showToast.warning("No blogs to enhance. Please select blogs or ensure you have blogs in your list.");
      return;
    }

    setShowAiEnhancement(true);
    
    let currentProgress = {
      isRunning: true,
      isPaused: false,
      currentIndex: 0,
      totalBlogs: blogsToProcess.length,
      currentBlog: blogsToProcess[0],
      processedBlogs: [],
      failedBlogs: [],
      successCount: 0,
      failureCount: 0
    };

    setAiEnhancementProgress(currentProgress);

    // Process blogs one by one
    for (let i = 0; i < blogsToProcess.length; i++) {
      // Check if paused - use a ref to get current state
      while (currentProgress.isPaused && currentProgress.isRunning) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Get latest state
        setAiEnhancementProgress(prev => {
          currentProgress = prev;
          return prev;
        });
      }

      // Check if stopped
      if (!currentProgress.isRunning) {
        break;
      }

      const currentBlog = blogsToProcess[i];
      
      currentProgress = {
        ...currentProgress,
        currentIndex: i,
        currentBlog: currentBlog
      };
      
      setAiEnhancementProgress(currentProgress);

      try {
        const enhancedBlog = await enhanceBlogWithAI(currentBlog);
        
        // Update the blog in the list
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog._id === enhancedBlog._id ? enhancedBlog : blog
          )
        );

        currentProgress = {
          ...currentProgress,
          processedBlogs: [...currentProgress.processedBlogs, currentBlog._id],
          successCount: currentProgress.successCount + 1
        };
        
        setAiEnhancementProgress(currentProgress);
        showToast.success(`✅ Enhanced & Saved: ${currentBlog.title}`);
        
        // Add delay between requests to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        currentProgress = {
          ...currentProgress,
          failedBlogs: [...currentProgress.failedBlogs, { id: currentBlog._id, error: errorMessage }],
          failureCount: currentProgress.failureCount + 1
        };
        
        setAiEnhancementProgress(currentProgress);
        showToast.error(`❌ Failed to enhance: ${currentBlog.title} - ${errorMessage}`);
      }
    }

    // Complete the process
    currentProgress = {
      ...currentProgress,
      isRunning: false,
      currentBlog: null
    };
    
    setAiEnhancementProgress(currentProgress);
    showToast.success(`🎉 AI Enhancement completed! ${currentProgress.successCount} blogs enhanced & saved, ${currentProgress.failureCount} failed.`);
  };

  const pauseAiEnhancement = () => {
    setAiEnhancementProgress(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
    showToast.info(aiEnhancementProgress.isPaused ? "AI Enhancement resumed." : "AI Enhancement paused.");
  };

  const stopAiEnhancement = () => {
    setAiEnhancementProgress(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false
    }));
    showToast.info("AI Enhancement process stopped.");
  };

  const closeAiEnhancement = () => {
    setShowAiEnhancement(false);
    setAiEnhancementProgress({
      isRunning: false,
      isPaused: false,
      currentIndex: 0,
      totalBlogs: 0,
      currentBlog: null,
      processedBlogs: [],
      failedBlogs: [],
      successCount: 0,
      failureCount: 0
    });
  };

  // Analytics Cards Component
  const AnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              Total Blogs
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {analytics.totalBlogs}
            </p>
        </div>
          <FileText className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl border ${
            isDark 
            ? 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30' 
            : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
              Published
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {analytics.publishedBlogs}
            </p>
          </div>
          <TrendingUp className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl border ${
                  isDark 
            ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              Total Views
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(analytics.totalViews)}
            </p>
          </div>
          <Eye className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-xl border ${
            isDark 
            ? 'bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700/30' 
            : 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
              Avg. Views
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatNumber(analytics.avgViewsPerBlog)}
            </p>
          </div>
          <BarChart3 className={`h-8 w-8 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
        </div>
      </motion.div>
    </div>
  );

  if (showAddBlogForm) {
    return <AddBlog onCancel={() => { setShowAddBlogForm(false); fetchBlogs(); }} />;
  }

  if (editingBlog) {
  return (
      <EditBlog 
        blog={editingBlog} 
        onCancel={() => setEditingBlog(null)}
        onSave={(updatedBlog) => {
          setBlogs(prev => prev.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
          ));
          setEditingBlog(null);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <FaEdit className="w-8 h-8" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Blog Management
                </h1>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your blog content, track performance, and engage with your audience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Refresh Data */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                fetchBlogs();
                showToast.success("Data refreshed!");
              }}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                isDark 
                  ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
              }`}
              title="Refresh Data"
            >
              <div className="w-4 h-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>

            {/* Analytics Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                showAnalytics
                  ? isDark
                    ? 'border-emerald-600 bg-emerald-900/30 text-emerald-400'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : isDark 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle Analytics Dashboard"
            >
              <FaChartLine className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </motion.button>

            {/* AI Enhancement */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startAiEnhancement}
              disabled={aiEnhancementProgress.isRunning}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                aiEnhancementProgress.isRunning
                  ? 'opacity-50 cursor-not-allowed border-gray-400'
                  : isDark 
                    ? 'border-purple-600 text-purple-400 hover:bg-purple-900/30' 
                    : 'border-purple-500 text-purple-600 hover:bg-purple-50'
              }`}
              title="Enhance All Blogs with AI"
            >
              <FaRobot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Enhance</span>
            </motion.button>

            {/* Export All */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                showToast.info("Export all blogs feature coming soon!");
              }}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                isDark 
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' 
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
              }`}
              title="Export All Blogs"
            >
              <FaDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
            
            {/* Create Blog */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddBlogForm(true)}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FaPlus className="w-4 h-4 mr-2" />
              <span>Create Blog</span>
            </motion.button>
          </div>
            </div>

        {/* Analytics Cards */}
        <AnimatePresence>
          {showAnalytics && <AnalyticsCards />}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`border rounded-xl shadow-sm overflow-hidden backdrop-blur-xl ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 border-gray-200'
        }`}>
          {/* Toolbar */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                    placeholder="Search blogs, authors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500'
                  }`}
                />
              </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg transition-all ${
                    showFilters
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                      : isDark 
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaFilter className="w-4 h-4 mr-2 inline" />
                  Filters
                </button>
              </div>

              {/* Enhanced Bulk Actions */}
              {selectedBlogs.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedBlogs.size} blog{selectedBlogs.size > 1 ? 's' : ''} selected
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Bulk Status Update */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          // Handle bulk status update
                          showToast.info(`Bulk status update to ${e.target.value} coming soon!`);
                          e.target.value = '';
                        }
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Change Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>

                    {/* Bulk Feature Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        showToast.info("Bulk feature toggle coming soon!");
                      }}
                      className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                        isDark 
                          ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-900/30' 
                          : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title="Toggle Featured Status"
                    >
                      <FaStar className="w-4 h-4" />
                      Feature
                    </motion.button>

                    {/* Bulk Export */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        showToast.info("Bulk export feature coming soon!");
                      }}
                      className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                        isDark 
                          ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' 
                          : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Export Selected Blogs"
                    >
                      <FaDownload className="w-4 h-4" />
                      Export
                    </motion.button>

                    {/* Bulk Delete */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete ({selectedBlogs.size})
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Status
                      </label>
                      <select
                        multiple
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          status: Array.from(e.target.selectedOptions, option => option.value)
                        }))}
                        className={`w-full p-2 border rounded-lg ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* Featured Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Featured
                      </label>
                      <select
                        value={filters.featured === null ? '' : filters.featured.toString()}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          featured: e.target.value === '' ? null : e.target.value === 'true'
                        }))}
                        className={`w-full p-2 border rounded-lg ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">All</option>
                        <option value="true">Featured</option>
                        <option value="false">Not Featured</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Date Range
                      </label>
                <DatePicker
                  selectsRange={true}
                        startDate={filters.dateRange[0]}
                        endDate={filters.dateRange[1]}
                        onChange={(update) => setFilters(prev => ({
                          ...prev,
                          dateRange: update as [Date | null, Date | null]
                        }))}
                  placeholderText="Select date range"
                        className={`w-full p-2 border rounded-lg ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={() => setFilters({
                          status: [],
                          featured: null,
                          author: [],
                          categories: [],
                          dateRange: [null, null]
                        })}
                        className={`w-full px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          isDark 
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                            : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <FaTimes className="w-3 h-3" />
                        Clear All
                      </button>
            </div>
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedBlogs.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`sticky top-0 z-40 px-6 py-4 border-b ${
                  isDark 
                    ? 'bg-gray-800/95 border-gray-700 backdrop-blur-sm' 
                    : 'bg-white/95 border-gray-200 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {selectedBlogs.size} blog{selectedBlogs.size !== 1 ? 's' : ''} selected
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {/* Bulk AI Enhancement */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startAiEnhancement}
                        disabled={aiEnhancementProgress.isRunning}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          aiEnhancementProgress.isRunning
                            ? 'opacity-50 cursor-not-allowed bg-gray-400'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {aiEnhancementProgress.isRunning ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                        ) : (
                          <FaMagic className="w-4 h-4" />
                        )}
                        Enhance with AI
                      </motion.button>

                      {/* Bulk Delete */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBulkDelete}
                        disabled={deleteLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          deleteLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {deleteLoading ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                        Delete Selected
                      </motion.button>

                      {/* Bulk Status Change */}
                      <select
                        onChange={(e) => {
                          if (e.target.value && selectedBlogs.size > 0) {
                            const newStatus = e.target.value;
                            if (window.confirm(`Change status of ${selectedBlogs.size} blogs to ${newStatus}?`)) {
                              Array.from(selectedBlogs).forEach(blogId => {
                                const blog = blogs.find(b => b._id === blogId);
                                if (blog) {
                                  handleStatusChange(blog, newStatus);
                                }
                              });
                            }
                            e.target.value = '';
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Change Status...</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>

                      {/* Clear Selection */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBlogs(new Set())}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaTimes className="w-3 h-3" />
                        Clear Selection
                      </motion.button>
                    </div>
                  </div>

                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tip: Click outside to close dropdowns
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div className="overflow-x-auto">
            {getLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className={`w-8 h-8 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading blogs...
                  </p>
                </div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className={`h-16 w-16 mx-auto mb-4 flex items-center justify-center ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    <FaEdit className="w-12 h-12" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    No blogs found
                  </h3>
                  <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery || filters.status.length > 0 || filters.featured !== null
                      ? "No blogs match your current filters. Try adjusting your search criteria."
                      : "Get started by creating your first blog post."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddBlogForm(true)}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
                    >
                      <FaPlus className="w-4 h-4" />
                      Create First Blog
                    </motion.button>
                    {(searchQuery || filters.status.length > 0 || filters.featured !== null) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSearchQuery("");
                          setFilters({
                            status: [],
                            featured: null,
                            author: [],
                            categories: [],
                            dateRange: [null, null]
                          });
                        }}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors border ${
                          isDark 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Clear Filters
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="w-12 p-4">
                      <button
                        onClick={handleSelectAll}
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                          selectedBlogs.size === paginatedBlogs.length && paginatedBlogs.length > 0
                            ? 'bg-emerald-600 border-emerald-600'
                            : isDark 
                              ? 'border-gray-600 hover:border-gray-500' 
                              : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {selectedBlogs.size === paginatedBlogs.length && paginatedBlogs.length > 0 && (
                          <FaCheck className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </th>
                    {[
                      { key: 'upload_image', label: 'Image', sortable: false },
                      { key: 'title', label: 'Title', sortable: true },
                      { key: 'author.name', label: 'Author', sortable: true },
                      { key: 'status', label: 'Status', sortable: true },
                      { key: 'featured', label: 'Featured', sortable: true },
                      { key: 'views', label: 'Views', sortable: true },
                      { key: 'likes', label: 'Likes', sortable: true },
                      { key: 'createdAt', label: 'Created', sortable: true },
                      { key: 'actions', label: 'Actions', sortable: false }
                    ].map((column) => (
                      <th
                        key={column.key}
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {column.sortable ? (
                          <button
                            onClick={() => handleSort(column.key as any)}
                            className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                          >
                            {column.label}
                            {sortConfig.key === column.key ? (
                              sortConfig.direction === 'asc' ? (
                                <FaSortUp className="w-3 h-3" />
                              ) : (
                                <FaSortDown className="w-3 h-3" />
                              )
                            ) : (
                              <FaSort className="w-3 h-3 opacity-50" />
                            )}
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {paginatedBlogs.map((blog) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                        selectedBlogs.has(blog._id) ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''
                      }`}
                    >
                      <td className="w-12 p-4">
                        <button
                          onClick={() => handleSelectBlog(blog._id)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                            selectedBlogs.has(blog._id)
                              ? 'bg-emerald-600 border-emerald-600'
                              : isDark 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {selectedBlogs.has(blog._id) && (
                            <FaCheck className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {blog.upload_image ? (
                            <img 
                              src={blog.upload_image} 
                              alt={blog.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-6 h-6 text-gray-400"><svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg></div>';
                                }
                              }}
                            />
                          ) : (
                            <FaImage className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <h3 className={`font-semibold truncate ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {blog.title}
                          </h3>
                          <p className={`text-sm truncate ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {blog.description}
                          </p>
        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-3 h-3 text-gray-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {blog.author?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {blog.status === 'published' && <FaCheckCircle className="w-3 h-3 text-green-500" />}
                          {blog.status === 'draft' && <FaExclamationTriangle className="w-3 h-3 text-yellow-500" />}
                          {blog.status === 'archived' && <FaTimesCircle className="w-3 h-3 text-gray-500" />}
                          <select
                            value={blog.status}
                            onChange={(e) => handleStatusChange(blog, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                              blog.status === 'published'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : blog.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(blog)}
                          className={`transition-colors ${
                            blog.featured
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : isDark 
                                ? 'text-gray-600 hover:text-yellow-500' 
                                : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          {blog.featured ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FaEye className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatNumber(blog.views || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FaHeart className="w-4 h-4 text-red-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatNumber(blog.likes || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="w-3 h-3 text-gray-400" />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* View Blog */}
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2.5 rounded-lg transition-all duration-200 group border-2 ${
                              isDark 
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 hover:shadow-lg border-blue-700/50 hover:border-blue-500' 
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md border-blue-200 hover:border-blue-400'
                            }`}
                            title="🔗 View Blog Post in New Tab"
                          >
                            <FaExternalLinkAlt className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                          </motion.a>

                          {/* Edit Blog */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditBlog(blog)}
                            disabled={getLoading}
                            className={`p-2.5 rounded-lg transition-all duration-200 group border-2 ${
                              getLoading
                                ? 'opacity-50 cursor-not-allowed border-gray-300'
                                : isDark 
                                  ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 hover:shadow-lg border-emerald-700/50 hover:border-emerald-500' 
                                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:shadow-md border-emerald-200 hover:border-emerald-400'
                            }`}
                            title="✏️ Edit Blog with AI Assistant"
                          >
                            {getLoading ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
                            ) : (
                              <FaPen className="w-4 h-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-200" />
                            )}
                          </motion.button>

                          {/* Quick Actions Dropdown */}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                if (dropdown) {
                                  dropdown.classList.toggle('opacity-0');
                                  dropdown.classList.toggle('invisible');
                                  dropdown.classList.toggle('opacity-100');
                                  dropdown.classList.toggle('visible');
                                }
                              }}
                              className={`p-2.5 rounded-lg transition-all duration-200 border-2 group ${
                                isDark 
                                  ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 border-purple-700/50 hover:border-purple-500 hover:shadow-lg' 
                                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 hover:border-purple-400 hover:shadow-md'
                              }`}
                              title="⚙️ More Actions & Settings"
                            >
                              <FaEllipsisH className="w-4 h-4 group-hover:scale-110 transition-all duration-200" />
                            </motion.button>
                            
                            {/* Enhanced Dropdown Menu */}
                            <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border opacity-0 invisible transition-all duration-200 z-[9999] ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 shadow-black/50' 
                                : 'bg-white border-gray-200 shadow-gray-500/20'
                            }`}>
                              <div className="py-2">
                                {/* Duplicate Blog */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const duplicatedBlog = {
                                      ...blog,
                                      title: `${blog.title} (Copy)`,
                                      slug: `${blog.slug}-copy-${Date.now()}`,
                                      status: 'draft' as const,
                                      featured: false
                                    };
                                    showToast.info("Blog duplication feature coming soon!");
                                    // Close dropdown
                                    const dropdown = e.currentTarget.closest('.absolute') as HTMLElement;
                                    if (dropdown) {
                                      dropdown.classList.add('opacity-0', 'invisible');
                                      dropdown.classList.remove('opacity-100', 'visible');
                                    }
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                    isDark 
                                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <FaCopy className="w-4 h-4" />
                                  <span>Duplicate Blog</span>
                                </button>

                                {/* Copy Link */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const blogUrl = `${window.location.origin}/blogs/${blog.slug}`;
                                    if (navigator.clipboard) {
                                      navigator.clipboard.writeText(blogUrl).then(() => {
                                        showToast.success("Blog URL copied to clipboard!");
                                      }).catch(() => {
                                        // Fallback for older browsers
                                        const textArea = document.createElement('textarea');
                                        textArea.value = blogUrl;
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        document.execCommand('copy');
                                        document.body.removeChild(textArea);
                                        showToast.success("Blog URL copied to clipboard!");
                                      });
                                    } else {
                                      // Fallback for browsers without clipboard API
                                      const textArea = document.createElement('textarea');
                                      textArea.value = blogUrl;
                                      document.body.appendChild(textArea);
                                      textArea.select();
                                      document.execCommand('copy');
                                      document.body.removeChild(textArea);
                                      showToast.success("Blog URL copied to clipboard!");
                                    }
                                    // Close dropdown
                                    const dropdown = e.currentTarget.closest('.absolute') as HTMLElement;
                                    if (dropdown) {
                                      dropdown.classList.add('opacity-0', 'invisible');
                                      dropdown.classList.remove('opacity-100', 'visible');
                                    }
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                    isDark 
                                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <FaLink className="w-4 h-4" />
                                  <span>Copy Link</span>
                                </button>

                                {/* Analytics */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToast.info(`Analytics for "${blog.title}": ${blog.views || 0} views, ${blog.likes || 0} likes`);
                                    // Close dropdown
                                    const dropdown = e.currentTarget.closest('.absolute') as HTMLElement;
                                    if (dropdown) {
                                      dropdown.classList.add('opacity-0', 'invisible');
                                      dropdown.classList.remove('opacity-100', 'visible');
                                    }
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                    isDark 
                                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <FaChartLine className="w-4 h-4" />
                                  <span>View Analytics</span>
                                </button>
                                
                                {/* SEO Analysis */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const seoInfo = `SEO Analysis for "${blog.title}":
• Title Length: ${blog.title?.length || 0} chars ${blog.title?.length > 60 ? '(Too long)' : '(Good)'}
• Description: ${blog.description?.length || 0} chars ${blog.description?.length > 160 ? '(Too long)' : '(Good)'}
• Slug: ${blog.slug ? 'Present' : 'Missing'}
• Featured Image: ${blog.upload_image ? 'Present' : 'Missing'}`;
                                    showToast.info(seoInfo);
                                    // Close dropdown
                                    const dropdown = e.currentTarget.closest('.absolute') as HTMLElement;
                                    if (dropdown) {
                                      dropdown.classList.add('opacity-0', 'invisible');
                                      dropdown.classList.remove('opacity-100', 'visible');
                                    }
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                    isDark 
                                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <FaCog className="w-4 h-4" />
                                  <span>SEO Analysis</span>
                                </button>
                                
                                <div className={`border-t my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                  <div className="px-4 py-2">
                                    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                      Danger Zone
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Delete Blog */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                                      handleDelete(blog._id);
                                    }
                                    // Close dropdown
                                    const dropdown = e.currentTarget.closest('.absolute') as HTMLElement;
                                    if (dropdown) {
                                      dropdown.classList.add('opacity-0', 'invisible');
                                      dropdown.classList.remove('opacity-100', 'visible');
                                    }
                                  }}
                                  disabled={deleteLoading}
                                  className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${
                                    deleteLoading
                                      ? 'opacity-50 cursor-not-allowed'
                                      : isDark 
                                        ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                  }`}
                                >
                                  {deleteLoading ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                  ) : (
                                    <FaTrash className="w-4 h-4" />
                                  )}
                                  <span>Delete Blog</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedBlogs.length)} of {filteredAndSortedBlogs.length} results
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 border rounded ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
      </div>

                <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded transition-colors ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark 
                          ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Previous
                </button>
                  
                  <span className={`px-3 py-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded transition-colors ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark 
                          ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Next
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Enhancement Modal */}
      <AnimatePresence>
        {showAiEnhancement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !aiEnhancementProgress.isRunning) {
                closeAiEnhancement();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FaRobot className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        AI Content Enhancement
                      </h2>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedBlogs.size > 0 
                          ? `Enhancing ${selectedBlogs.size} selected blogs`
                          : `Enhancing all ${blogs.length} blogs`
                        }
                      </p>
                    </div>
                  </div>
                  {!aiEnhancementProgress.isRunning && (
                    <button
                      onClick={closeAiEnhancement}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Content */}
              <div className="px-6 py-6 space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Progress
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {aiEnhancementProgress.currentIndex + 1} / {aiEnhancementProgress.totalBlogs}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3`}>
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((aiEnhancementProgress.currentIndex + 1) / aiEnhancementProgress.totalBlogs) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Current Blog */}
                {aiEnhancementProgress.currentBlog && (
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Currently Processing
                      </span>
                    </div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {aiEnhancementProgress.currentBlog.title}
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {aiEnhancementProgress.currentBlog.description?.substring(0, 100)}...
                    </p>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className={`text-center p-3 rounded-lg ${
                    isDark ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {aiEnhancementProgress.successCount}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      Enhanced
                    </div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDark ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {aiEnhancementProgress.failureCount}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                      Failed
                    </div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {aiEnhancementProgress.totalBlogs - aiEnhancementProgress.currentIndex - 1}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Remaining
                    </div>
                  </div>
                </div>

                {/* Failed Blogs List */}
                {aiEnhancementProgress.failedBlogs.length > 0 && (
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'bg-red-900/10 border-red-700/30' : 'bg-red-50 border-red-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                      Failed Enhancements ({aiEnhancementProgress.failedBlogs.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {aiEnhancementProgress.failedBlogs.map((failed, index) => {
                        const blog = blogs.find(b => b._id === failed.id);
                        return (
                          <div key={index} className={`text-xs ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                            • {blog?.title || 'Unknown Blog'}: {failed.error}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {aiEnhancementProgress.isRunning && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={pauseAiEnhancement}
                          className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                            isDark 
                              ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-900/30' 
                              : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                          }`}
                        >
                          {aiEnhancementProgress.isPaused ? (
                            <>
                              <FaPlay className="w-4 h-4" />
                              Resume
                            </>
                          ) : (
                            <>
                              <FaPause className="w-4 h-4" />
                              Pause
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={stopAiEnhancement}
                          className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                            isDark 
                              ? 'border-red-600 text-red-400 hover:bg-red-900/30' 
                              : 'border-red-500 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <FaStop className="w-4 h-4" />
                          Stop
                        </motion.button>
                      </>
                    )}
                  </div>
                  
                  {!aiEnhancementProgress.isRunning && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeAiEnhancement}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                    >
                      Close
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogs; 