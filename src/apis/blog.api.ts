import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';
import {
  IBlog,
  IBlogCreateInput,
  IBlogUpdateInput,
  IBlogCommentInput,
  IBlogQueryParams,
  IBlogSearchParams
} from '../types/blog.types';

/**
 * Blog type definitions
 */
export interface IBlogComment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  blog_link: string;
  upload_image: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  categories: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  likes: number;
  comments: IBlogComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IBlogCreateInput {
  title: string;
  content: string;
  excerpt?: string;
  blog_link: string;
  upload_image: string;
  categories?: string[];
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface IBlogUpdateInput extends Partial<IBlogCreateInput> {
  featured?: boolean;
}

export interface IBlogCommentInput {
  content: string;
}

export interface IBlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  status?: string;
  category?: string;
  tags?: string;
  author?: string;
  date_range?: { 
    start?: string; 
    end?: string 
  };
  with_content?: boolean;
  count_only?: boolean;
  exclude_ids?: string[];
}

/**
 * Blog API service
 */
export const blogAPI = {
  /**
   * Get all blogs with optional filtering
   * @param params - Query parameters for filtering
   * @returns Promise with blog list response
   */
  getAllBlogs: async (params: IBlogQueryParams = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort_by = "createdAt",
      sort_order = "desc",
      status = "",
      category = "",
      tags = "",
      author = "",
      date_range = {},
      with_content = false,
      count_only = false,
      exclude_ids = []
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    apiUtils.appendParam('search', search, queryParams);
    apiUtils.appendParam('status', status, queryParams);
    apiUtils.appendParam('author', author, queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    apiUtils.appendArrayParam('tags', tags, queryParams);
    if (date_range && Object.keys(date_range).length > 0) {
      apiUtils.appendParam('date_start', date_range.start, queryParams);
      apiUtils.appendParam('date_end', date_range.end, queryParams);
    }
    apiUtils.appendParam('sort_by', sort_by, queryParams);
    apiUtils.appendParam('sort_order', sort_order, queryParams);
    apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
    apiUtils.appendParam('count_only', count_only ? 'true' : 'false', queryParams);
    apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
    
    return apiClient.get<{ blogs: IBlog[]; totalCount: number }>(
      `${apiBaseUrl}/blogs${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    );
  },

  /**
   * Get a blog by its ID
   * @param id - Blog ID
   * @returns Promise with blog detail
   */
  getBlogById: async (id: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.get<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/id/${id}`
    );
  },

  /**
   * Get a blog by its slug
   * @param slug - Blog slug
   * @param incrementViews - Whether to increment view count
   * @returns Promise with blog detail
   */
  getBlogBySlug: async (slug: string, incrementViews: boolean = true) => {
    if (!slug) throw new Error('Blog slug is required');
    const queryParams = new URLSearchParams();
    queryParams.append('increment_views', incrementViews ? 'true' : 'false');
    
    return apiClient.get<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/slug/${slug}?${queryParams.toString()}`
    );
  },

  /**
   * Create a new blog
   * @param blogData - Blog data to create
   * @returns Promise with created blog
   */
  createBlog: async (blogData: IBlogCreateInput) => {
    return apiClient.post<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs`,
      blogData
    );
  },

  /**
   * Update an existing blog
   * @param id - Blog ID to update
   * @param blogData - Updated blog data
   * @returns Promise with updated blog
   */
  updateBlog: async (id: string, blogData: IBlogUpdateInput) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.put<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/${id}`,
      blogData
    );
  },

  /**
   * Delete a blog
   * @param id - Blog ID to delete
   * @returns Promise with deletion response
   */
  deleteBlog: async (id: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.delete(
      `${apiBaseUrl}/blogs/${id}`
    );
  },

  /**
   * Toggle the featured status of a blog
   * @param id - Blog ID
   * @returns Promise with toggle response
   */
  toggleFeatured: async (id: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.patch<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/${id}/feature`
    );
  },

  /**
   * Update the publication status of a blog
   * @param id - Blog ID
   * @param status - New status (draft, published, archived)
   * @returns Promise with status update response
   */
  updateBlogStatus: async (id: string, status: 'draft' | 'published' | 'archived') => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.patch<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/${id}/status`,
      { status }
    );
  },

  /**
   * Like a blog post
   * @param id - Blog ID
   * @param userId - User ID performing the like
   * @returns Promise with like response
   */
  likeBlog: async (id: string, userId: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.post<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/${id}/like`,
      { userId }
    );
  },

  /**
   * Add a comment to a blog
   * @param id - Blog ID
   * @param comment - Comment data
   * @returns Promise with comment response
   */
  addComment: async (id: string, comment: IBlogCommentInput) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.post<{ comment: IBlogComment }>(
      `${apiBaseUrl}/blogs/${id}/comment`,
      comment
    );
  },

  /**
   * Delete a comment from a blog
   * @param blogId - Blog ID
   * @param commentId - Comment ID to delete
   * @returns Promise with deletion response
   */
  deleteComment: async (blogId: string, commentId: string) => {
    if (!blogId) throw new Error('Blog ID is required');
    if (!commentId) throw new Error('Comment ID is required');
    return apiClient.delete(
      `${apiBaseUrl}/blogs/${blogId}/comment/${commentId}`
    );
  },

  /**
   * Get all blog categories
   * @returns Promise with categories list
   */
  getBlogCategories: async () => {
    return apiClient.get<{ categories: string[] }>(
      `${apiBaseUrl}/blogs/categories`
    );
  },

  /**
   * Get all blog tags with optional count
   * @param limit - Maximum number of tags to return
   * @param withCount - Whether to include post count for each tag
   * @returns Promise with tags list
   */
  getBlogTags: async (limit: number = 20, withCount: boolean = true) => {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    queryParams.append('with_count', withCount ? 'true' : 'false');
    
    return apiClient.get<{ tags: { name: string; count?: number }[] }>(
      `${apiBaseUrl}/blogs/tags?${queryParams.toString()}`
    );
  },

  /**
   * Get related blogs based on a blog ID
   * @param blogId - Blog ID to find related content for
   * @param limit - Maximum number of related blogs to return
   * @param tags - Optional specific tags to match
   * @param category - Optional specific category to match
   * @returns Promise with related blogs
   */
  getRelatedBlogs: async (blogId: string, limit: number = 3, tags?: string, category?: string) => {
    if (!blogId) throw new Error('Blog ID is required');
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    apiUtils.appendArrayParam('tags', tags, queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    
    return apiClient.get<{ blogs: IBlog[] }>(
      `${apiBaseUrl}/blogs/${blogId}/related?${queryParams.toString()}`
    );
  },

  /**
   * Get featured blogs
   * @param limit - Maximum number of featured blogs to return
   * @param withContent - Whether to include full blog content
   * @param category - Optional category filter
   * @param tags - Optional tags filter
   * @param excludeIds - Blog IDs to exclude
   * @returns Promise with featured blogs
   */
  getFeaturedBlogs: async (limit: number = 6, withContent: boolean = false, category?: string, tags?: string, excludeIds: string[] = []) => {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    apiUtils.appendParam('with_content', withContent ? 'true' : 'false', queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    apiUtils.appendArrayParam('tags', tags, queryParams);
    apiUtils.appendArrayParam('exclude_ids', excludeIds, queryParams);
    
    return apiClient.get<{ blogs: IBlog[] }>(
      `${apiBaseUrl}/blogs/featured?${queryParams.toString()}`
    );
  },

  /**
   * Search blogs by keyword
   * @param query - Search query string
   * @param limit - Maximum number of results
   * @param fields - Fields to search within
   * @param category - Optional category filter
   * @param tags - Optional tags filter
   * @returns Promise with search results
   */
  searchBlogs: async (query: string, limit: number = 10, fields: string[] = ["title", "content"], category?: string, tags?: string) => {
    if (!query || query.trim().length === 0) throw new Error('Search query is required');
    
    const queryParams = new URLSearchParams();
    queryParams.append('query', query.trim());
    queryParams.append('limit', String(limit));
    apiUtils.appendArrayParam('fields', fields, queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    apiUtils.appendArrayParam('tags', tags, queryParams);
    
    return apiClient.get<{ blogs: IBlog[] }>(
      `${apiBaseUrl}/blogs/search?${queryParams.toString()}`
    );
  },

  /**
   * Get analytics for a specific blog
   * @param blogId - Blog ID
   * @returns Promise with blog analytics
   */
  getBlogAnalytics: async (blogId: string) => {
    if (!blogId) throw new Error('Blog ID is required');
    return apiClient.get<{ analytics: any }>(
      `${apiBaseUrl}/blogs/${blogId}/analytics`
    );
  }
}; 