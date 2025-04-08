import { apiBaseUrl, apiUtils } from './index';
import {
  IBlog,
  IBlogCreateInput,
  IBlogUpdateInput,
  IBlogCommentInput,
  IBlogQueryParams,
  IBlogSearchParams
} from '../types/blog.types';

/**
 * Blog API endpoints
 */
export const blogApi = {
  /**
   * Get all blogs with optional filtering
   */
  getAllBlogs: (options: IBlogQueryParams = {}): string => {
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
    } = options;
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
    return `${apiBaseUrl}/blogs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  },

  /**
   * Search blogs by query
   */
  searchBlogs: (options: IBlogSearchParams): string => {
    const { query, limit = 10, fields = ["title", "content"], category = "", tags = "" } = options;
    if (!query || query.trim().length === 0) throw new Error('Search query is required');
    const queryParams = new URLSearchParams();
    queryParams.append('query', query.trim());
    queryParams.append('limit', String(limit));
    apiUtils.appendArrayParam('fields', fields, queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    apiUtils.appendArrayParam('tags', tags, queryParams);
    return `${apiBaseUrl}/blogs/search?${queryParams.toString()}`;
  },

  /**
   * Get featured blogs
   */
  getFeaturedBlogs: (options: {
    limit?: number;
    with_content?: boolean;
    category?: string;
    tags?: string;
    exclude_ids?: string[];
  } = {}): string => {
    const { limit = 6, with_content = false, category = "", tags = "", exclude_ids = [] } = options;
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    apiUtils.appendParam('with_content', with_content ? 'true' : 'false', queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    apiUtils.appendArrayParam('tags', tags, queryParams);
    apiUtils.appendArrayParam('exclude_ids', exclude_ids, queryParams);
    return `${apiBaseUrl}/blogs/featured?${queryParams.toString()}`;
  },

  /**
   * Get blogs by category
   */
  getBlogsByCategory: (category: string, options: { page?: number; limit?: number; sort_by?: string; sort_order?: string } = {}): string => {
    if (!category) throw new Error('Category is required');
    const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    apiUtils.appendParam('sort_by', sort_by, queryParams);
    apiUtils.appendParam('sort_order', sort_order, queryParams);
    return `${apiBaseUrl}/blogs/category/${category}?${queryParams.toString()}`;
  },

  /**
   * Get blogs by tag
   */
  getBlogsByTag: (tag: string, options: { page?: number; limit?: number; sort_by?: string; sort_order?: string } = {}): string => {
    if (!tag) throw new Error('Tag is required');
    const { page = 1, limit = 10, sort_by = "createdAt", sort_order = "desc" } = options;
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    apiUtils.appendParam('sort_by', sort_by, queryParams);
    apiUtils.appendParam('sort_order', sort_order, queryParams);
    return `${apiBaseUrl}/blogs/tag/${tag}?${queryParams.toString()}`;
  },

  /**
   * Get blog by slug
   */
  getBlogBySlug: (slug: string, incrementViews: boolean = true): string => {
    if (!slug) throw new Error('Blog slug is required');
    const queryParams = new URLSearchParams();
    queryParams.append('increment_views', incrementViews ? 'true' : 'false');
    return `${apiBaseUrl}/blogs/slug/${slug}?${queryParams.toString()}`;
  },

  /**
   * Create a blog
   */
  createBlog: (): string => `${apiBaseUrl}/blogs`,

  /**
   * Update a blog
   */
  updateBlog: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}`;
  },

  /**
   * Delete a blog
   */
  deleteBlog: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}`;
  },

  /**
   * Like a blog
   */
  likeBlog: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}/like`;
  },

  /**
   * Add a comment to a blog
   */
  addComment: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}/comment`;
  },

  /**
   * Delete a comment from a blog
   */
  deleteComment: (blogId: string, commentId: string): string => {
    if (!blogId) throw new Error('Blog ID is required');
    if (!commentId) throw new Error('Comment ID is required');
    return `${apiBaseUrl}/blogs/${blogId}/comment/${commentId}`;
  },

  /**
   * Update blog status
   */
  updateBlogStatus: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}/status`;
  },

  /**
   * Toggle featured status
   */
  toggleFeatured: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${id}/feature`;
  },

  /**
   * Get blog categories
   */
  getBlogCategories: (): string => `${apiBaseUrl}/blogs/categories`,

  /**
   * Get blog tags
   */
  getBlogTags: (options: { limit?: number; with_count?: boolean } = {}): string => {
    const { limit = 20, with_count = true } = options;
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    queryParams.append('with_count', with_count ? 'true' : 'false');
    return `${apiBaseUrl}/blogs/tags?${queryParams.toString()}`;
  },

  /**
   * Get related blogs
   */
  getRelatedBlogs: (options: { blogId: string; limit?: number; tags?: string; category?: string }): string => {
    const { blogId, limit = 3, tags = "", category = "" } = options;
    if (!blogId) throw new Error('Blog ID is required');
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    apiUtils.appendArrayParam('tags', tags, queryParams);
    apiUtils.appendArrayParam('category', category, queryParams);
    return `${apiBaseUrl}/blogs/${blogId}/related?${queryParams.toString()}`;
  },

  /**
   * Get blog analytics
   */
  getBlogAnalytics: (blogId: string): string => {
    if (!blogId) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/${blogId}/analytics`;
  },

  /**
   * Get blog by ID
   */
  getBlogById: (id: string): string => {
    if (!id) throw new Error('Blog ID is required');
    return `${apiBaseUrl}/blogs/id/${id}`;
  }
}; 