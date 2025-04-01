import express, { Request, Response, NextFunction } from 'express';
import * as blogController from '../controllers/blogController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
/**
 * @route GET /blogs
 * @desc Get all blogs with optional filtering
 */
router.get('/', blogController.getAllBlogs);

/**
 * @route GET /blogs/search
 * @desc Search blogs by query
 */
router.get('/search', blogController.searchBlogs);

/**
 * @route GET /blogs/featured
 * @desc Get featured blogs
 */
router.get('/featured', blogController.getFeaturedBlogs);

/**
 * @route GET /blogs/categories
 * @desc Get all blog categories
 */
router.get('/categories', blogController.getBlogCategories);

/**
 * @route GET /blogs/tags
 * @desc Get all blog tags with optional count
 */
router.get('/tags', blogController.getBlogTags);

/**
 * @route GET /blogs/category/:category
 * @desc Get blogs by category
 */
router.get('/category/:category', blogController.getBlogsByCategory);

/**
 * @route GET /blogs/tag/:tag
 * @desc Get blogs by tag
 */
router.get('/tag/:tag', blogController.getBlogsByTag);

/**
 * @route GET /blogs/id/:id
 * @desc Get blog by ID
 */
router.get('/id/:id', blogController.getBlogById);

/**
 * @route GET /blogs/slug/:slug
 * @desc Get blog by slug
 */
router.get('/slug/:slug', blogController.getBlogBySlug);

/**
 * @route GET /blogs/:id/related
 * @desc Get related blogs
 */
router.get('/:id/related', blogController.getRelatedBlogs);

// Protected routes (require authentication)
router.use(authenticate);

/**
 * @route POST /blogs
 * @desc Create a new blog
 * @access Private
 */
router.post('/', blogController.createBlog);

/**
 * @route PUT /blogs/:id
 * @desc Update a blog
 * @access Private
 */
router.put('/:id', blogController.updateBlog);

/**
 * @route DELETE /blogs/:id
 * @desc Delete a blog
 * @access Private
 */
router.delete('/:id', blogController.deleteBlog);

/**
 * @route POST /blogs/:id/like
 * @desc Like/unlike a blog
 * @access Private
 */
router.post('/:id/like', blogController.likeBlog);

/**
 * @route POST /blogs/:id/comment
 * @desc Add a comment to a blog
 * @access Private
 */
router.post('/:id/comment', blogController.addComment);

/**
 * @route DELETE /blogs/:blogId/comment/:commentId
 * @desc Delete a comment from a blog
 * @access Private
 */
router.delete('/:blogId/comment/:commentId', blogController.deleteComment);

/**
 * @route PUT /blogs/:id/status
 * @desc Update blog status
 * @access Private
 */
router.put('/:id/status', blogController.updateBlogStatus);

/**
 * @route PUT /blogs/:id/feature
 * @desc Toggle featured status
 * @access Private
 */
router.put('/:id/feature', blogController.toggleFeatured);

/**
 * @route GET /blogs/:id/analytics
 * @desc Get blog analytics
 * @access Private
 */
router.get('/:id/analytics', blogController.getBlogAnalytics);

export default router; 