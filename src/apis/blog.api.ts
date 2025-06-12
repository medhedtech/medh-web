import { apiBaseUrl } from './config';
import { apiClient } from './apiClient';
import { apiUtils } from './index';
import {
  IBlog,
  IBlogCreateInput,
  IBlogUpdateInput,
  IBlogCommentInput,
  IBlogQueryParams,
  IBlogSearchParams,
  IBlogStatusUpdateInput
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
  featured?: boolean;
}

/**
 * Blog API service
 */
export const blogAPI = {
  /**
   * Get all blogs with optional filtering
   * GET /api/blogs?page=1&limit=10&status=published&sort_by=createdAt&sort_order=desc&featured=true&search=keyword
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
      status = "published",
      category = "",
      tags = "",
      author = "",
      date_range = {},
      with_content = false,
      count_only = false,
      exclude_ids = [],
      featured
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('sort_by', sort_by);
    queryParams.append('sort_order', sort_order);
    queryParams.append('status', status);
    
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', Array.isArray(category) ? category.join(',') : category);
    if (tags) queryParams.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
    if (author) queryParams.append('author', author);
    if (featured !== undefined) queryParams.append('featured', String(featured));
    if (with_content) queryParams.append('with_content', 'true');
    if (count_only) queryParams.append('count_only', 'true');
    if (exclude_ids.length > 0) queryParams.append('exclude_ids', exclude_ids.join(','));
    
    if (date_range.start) queryParams.append('date_start', date_range.start);
    if (date_range.end) queryParams.append('date_end', date_range.end);
    
         return apiClient.get<{ success: boolean; data: IBlog[]; pagination: { total: number; pages: number; page: number; limit: number } }>(
       `/blogs?${queryParams.toString()}`
     );
  },

  /**
   * Search blogs by keyword
   * GET /api/blogs/search?query=keyword&page=1&limit=10&status=published&sort_by=score
   * @param params - Search parameters
   * @returns Promise with search results
   */
  searchBlogs: async (params: IBlogSearchParams) => {
    const {
      query,
      limit = 10,
      fields = ["title", "content"],
      category = "",
      tags = ""
    } = params;
    
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('query', query.trim());
    queryParams.append('limit', String(limit));
    queryParams.append('status', 'published');
    queryParams.append('sort_by', 'score');
    
    if (category) queryParams.append('category', category);
    if (tags) queryParams.append('tags', tags);
    if (fields.length > 0) queryParams.append('fields', fields.join(','));
    
         return apiClient.get<{ success: boolean; data: IBlog[]; pagination?: { total: number; pages: number; page: number; limit: number } }>(
       `/blogs/search?${queryParams.toString()}`
     );
  },

  /**
   * Get featured blogs
   * GET /api/blogs/featured?page=1&limit=5&status=published
   * @param params - Query parameters
   * @returns Promise with featured blogs
   */
  getFeaturedBlogs: async (params: IBlogQueryParams = {}) => {
    const {
      page = 1,
      limit = 5,
      status = "published",
      category = "",
      tags = "",
      exclude_ids = []
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('status', status);
    
         if (category) queryParams.append('category', Array.isArray(category) ? category.join(',') : category);
     if (tags) queryParams.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
     if (exclude_ids.length > 0) queryParams.append('exclude_ids', exclude_ids.join(','));
    
         return apiClient.get<{ success: boolean; data: IBlog[]; pagination: { total: number; pages: number; page: number; limit: number } }>(
       `/blogs/featured?${queryParams.toString()}`
     );
  },

  /**
   * Get blogs by category
   * GET /api/blogs/category/:category?page=1&limit=10&status=published
   * @param category - Category name
   * @param params - Query parameters
   * @returns Promise with blogs in category
   */
  getBlogsByCategory: async (category: string, params: IBlogQueryParams = {}) => {
    if (!category) throw new Error('Category is required');
    
    const {
      page = 1,
      limit = 10,
      status = "published",
      sort_by = "createdAt",
      sort_order = "desc"
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('status', status);
    queryParams.append('sort_by', sort_by);
    queryParams.append('sort_order', sort_order);
    
         return apiClient.get<{ success: boolean; data: IBlog[]; pagination: { total: number; pages: number; page: number; limit: number }; category: string }>(
       `/blogs/category/${encodeURIComponent(category)}?${queryParams.toString()}`
     );
  },

  /**
   * Get blogs by tag
   * GET /api/blogs/tag/:tag?page=1&limit=10&status=published
   * @param tag - Tag name
   * @param params - Query parameters
   * @returns Promise with blogs with tag
   */
  getBlogsByTag: async (tag: string, params: IBlogQueryParams = {}) => {
    if (!tag) throw new Error('Tag is required');
    
    const {
      page = 1,
      limit = 10,
      status = "published",
      sort_by = "createdAt",
      sort_order = "desc"
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('status', status);
    queryParams.append('sort_by', sort_by);
    queryParams.append('sort_order', sort_order);
    
         return apiClient.get<{ success: boolean; data: IBlog[]; pagination: { total: number; pages: number; page: number; limit: number }; tag: string }>(
       `/blogs/tag/${encodeURIComponent(tag)}?${queryParams.toString()}`
     );
  },

  /**
   * Get a blog by its ID
   * GET /api/blogs/id/:id
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
   * GET /api/blogs/:slug
   * @param slug - Blog slug
   * @param incrementViews - Whether to increment view count
   * @returns Promise with blog detail
   */
  getBlogBySlug: async (slug: string, incrementViews: boolean = true) => {
    if (!slug) throw new Error('Blog slug is required');
    const queryParams = new URLSearchParams();
    if (!incrementViews) queryParams.append('increment_views', 'false');
    
    return apiClient.get<{ blog: IBlog }>(
      `${apiBaseUrl}/blogs/${slug}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    );
  },

  /**
   * Create a new blog (Protected route)
   * POST /api/blogs
   * @param blogData - Blog data to create
   * @returns Promise with created blog
   */
  createBlog: async (blogData: IBlogCreateInput) => {
    return apiClient.post<{ blog: IBlog; message: string }>(
      `${apiBaseUrl}/blogs`,
      blogData
    );
  },

  /**
   * Update an existing blog (Protected route)
   * PUT /api/blogs/:id
   * @param id - Blog ID to update
   * @param blogData - Updated blog data
   * @returns Promise with updated blog
   */
  updateBlog: async (id: string, blogData: IBlogUpdateInput) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.put<{ blog: IBlog; message: string }>(
      `${apiBaseUrl}/blogs/${id}`,
      blogData
    );
  },

  /**
   * Delete a blog (Protected route)
   * DELETE /api/blogs/:id
   * @param id - Blog ID to delete
   * @returns Promise with deletion response
   */
  deleteBlog: async (id: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.delete<{ message: string }>(
      `${apiBaseUrl}/blogs/${id}`
    );
  },

  /**
   * Like a blog post (Protected route)
   * POST /api/blogs/:id/like
   * @param id - Blog ID
   * @returns Promise with like response
   */
  likeBlog: async (id: string) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.post<{ blog: IBlog; message: string; liked: boolean }>(
      `${apiBaseUrl}/blogs/${id}/like`
    );
  },

  /**
   * Add a comment to a blog (Protected route)
   * POST /api/blogs/:id/comment
   * @param id - Blog ID
   * @param comment - Comment data
   * @returns Promise with comment response
   */
  addComment: async (id: string, comment: IBlogCommentInput) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.post<{ comment: IBlogComment; message: string }>(
      `${apiBaseUrl}/blogs/${id}/comment`,
      comment
    );
  },

  /**
   * Update the publication status of a blog (Protected route)
   * PUT /api/blogs/:id/status
   * @param id - Blog ID
   * @param status - New status data
   * @returns Promise with status update response
   */
  updateBlogStatus: async (id: string, statusData: IBlogStatusUpdateInput) => {
    if (!id) throw new Error('Blog ID is required');
    return apiClient.put<{ blog: IBlog; message: string }>(
      `${apiBaseUrl}/blogs/${id}/status`,
      statusData
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
    if (tags) queryParams.append('tags', tags);
    if (category) queryParams.append('category', category);
    
    return apiClient.get<{ blogs: IBlog[] }>(
      `${apiBaseUrl}/blogs/${blogId}/related?${queryParams.toString()}`
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