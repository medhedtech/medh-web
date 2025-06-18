"use client";
import { useState, useEffect, useCallback } from 'react';
import { apiUrls } from '@/apis';
import useGetQuery from './getQuery.hook';
import { showToast } from '@/utils/toastManager';

// ----------------------
// Type Definitions
// ----------------------

export interface BlogComment {
  _id: string;
  user: string; // User ID
  content: string;
  createdAt: string;
}

export interface BlogCategory {
  _id: string;
  category_name: string;
  category_image: string;
}

export interface BlogData {
  _id: string;
  title: string;
  description: string;
  content: string;
  blog_link: string | null;
  upload_image: string;
  author: string; // Author ID
  categories: string[]; // Array of category IDs
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  likes: number;
  comments: BlogComment[];
  meta_title: string;
  meta_description: string;
  reading_time: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  commentCount: number;
}

interface BlogApiResponse {
  success: boolean;
  data: BlogData;
}

export interface CommentInput {
  content: string;
}

// ----------------------
// Main Hook
// ----------------------

export const useBlog = (blogId: string = '') => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogData[]>([]);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [getLoading, setGetLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { getQuery } = useGetQuery();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
      }
    };
    
    checkAuth();
    // Set up event listener for storage changes (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Increment retry count and reset error/loading states
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    setLoading(true);
  }, []);

  // Get auth token from local storage
  const getAuthToken = useCallback((): string => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication Required');
      }
      return token;
    }
    return '';
  }, []);

  // Handle API errors
  const handleApiError = useCallback((error: any): Error => {
    console.error("API Error:", error);
    if (error.message === 'Network Error' || (!error.response && !error.success)) {
      return new Error('Network Error: Please check your internet connection');
    }
    
    // Handle authentication errors specially
    if (error.response?.status === 401 || error.response?.status === 403) {
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        // Optional: Clear token if it's invalid
        // localStorage.removeItem('token');
      }
      return new Error('Authentication required: Please log in to continue');
    }
    
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return new Error(message);
  }, []);

  // Like blog - Protected action
  const likeBlog = useCallback(async (): Promise<boolean> => {
    if (!blogId) {
      showToast.error('No blog selected to like');
      return false;
    }
    
    if (!isAuthenticated) {
      showToast.info('Please log in to like this blog');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };

      const response = await getQuery({
        url: apiUrls.Blogs.likeBlog(blogId),
        config: { method: 'POST', headers }
      });

      if (response?.success) {
        setBlogData(prev => prev ? { ...prev, likes: prev.likes + 1 } : prev);
        showToast.success('Blog liked!');
        return true;
      }
      throw new Error("Failed to like blog");
    } catch (err: any) {
      const processedError = handleApiError(err);
      showToast.error(processedError.message);
      return false;
    } finally {
      setPostLoading(false);
    }
  }, [blogId, getQuery, getAuthToken, handleApiError, isAuthenticated]);

  // Add comment - Protected action
  const addComment = useCallback(async (comment: CommentInput): Promise<boolean> => {
    if (!blogId) {
      showToast.error('No blog selected to comment on');
      return false;
    }
    
    if (!isAuthenticated) {
      showToast.info('Please log in to comment on this blog');
      return false;
    }
    
    try {
      setPostLoading(true);
      const token = getAuthToken();
      const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
      };

      const response = await getQuery({
        url: apiUrls.Blogs.addComment(blogId),
        config: { method: 'POST', headers, data: comment }
      });

      if (response?.success) {
        setBlogData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            comments: [...prev.comments, response.data],
            commentCount: prev.commentCount + 1
          };
        });
        showToast.success('Comment added successfully!');
        return true;
      }
      throw new Error("Failed to add comment");
    } catch (err: any) {
      const processedError = handleApiError(err);
      showToast.error(processedError.message);
      return false;
    } finally {
      setPostLoading(false);
    }
  }, [blogId, getQuery, getAuthToken, handleApiError, isAuthenticated]);

  // Fetch blog data - Public action with optional auth
  useEffect(() => {
    const fetchData = async () => {
      if (!blogId) return;
      
      try {
        setLoading(true);
        setGetLoading(true);
        setError(null);

        // Base headers for public requests
        let headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        // Add auth token if available (for liked status, etc.)
        if (isAuthenticated) {
          try {
            const token = getAuthToken();
            if (token) {
              headers['x-access-token'] = token;
            }
          } catch (err) {
            console.warn('Authentication token error, proceeding with public access');
          }
        }

        // First try to fetch by ID
        let response: BlogApiResponse | null = null;
        let error: any = null;

        try {
          response = await getQuery({
            url: apiUrls.Blogs.getBlogById(blogId),
            config: { headers }
          });
        } catch (err) {
          error = err;
          console.warn('Failed to fetch by ID, trying slug...');
        }

        // If ID fetch fails, try by slug
        if (!response?.success && blogId) {
          try {
            response = await getQuery({
              url: apiUrls.Blogs.getBlogBySlug(blogId),
              config: { headers }
            });
            error = null; // Clear error if slug fetch succeeds
          } catch (err) {
            if (!error) error = err; // Keep original error if both fail
          }
        }

        // Handle the final response
        if (response?.success && response.data) {
          setBlogData(response.data);
          
          // Only fetch related blogs if we have tags or categories
          if (response.data.tags?.length || response.data.categories?.length) {
            try {
              const relatedResponse = await getQuery({
                url: apiUrls.Blogs.getRelatedBlogs({
                  blogId,
                  limit: 3,
                  tags: response.data.tags?.join(',') || '',
                  category: Array.isArray(response.data.categories) 
                    ? response.data.categories[0] 
                    : response.data.categories
                }),
                config: { headers }
              });

              if (relatedResponse?.success) {
                setRelatedBlogs(relatedResponse.data);
              }
            } catch (err) {
              console.warn('Failed to fetch related blogs:', err);
              // Don't set error state for related blogs failure
            }
          }
        } else if (error) {
          throw error;
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err: any) {
        const processedError = handleApiError(err);
        setError(processedError);
        if (processedError.message !== 'Authentication Required') {
          showToast.error(processedError.message);
        }
      } finally {
        setLoading(false);
        setGetLoading(false);
      }
    };

    fetchData();
  }, [blogId, retryCount, getQuery, getAuthToken, handleApiError, isAuthenticated]);

  return {
    loading,
    error,
    blogData,
    relatedBlogs,
    handleRetry,
    likeBlog,
    addComment,
    getLoading,
    postLoading,
    isAuthenticated,
  };
};

export default useBlog; 