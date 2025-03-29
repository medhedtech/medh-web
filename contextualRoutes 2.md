# Contextual Routes - Medh Project

## Core Components
- `src/components/sections/blogs/Blogs.js` - Main blogs display component with filtering
- `src/components/sections/blogs/BlogCard.js` - Individual blog card with hover effects
- `src/components/sections/blogs/BlogsPrimary.js` - Primary blog page component

## API Related
- `src/utils/api.js` - Enhanced API client with caching and retry mechanism
- `src/apis/apiClient.js` - API client with interceptors
- `src/apis/index.js` - Comprehensive API endpoints with improved Blogs API
- `src/hooks/getQuery.hook.js` - Custom GET request hook

## Layout Components
- `src/components/layout/main/BlogsMain.js` - Main layout for blog pages
- `src/components/layout/main/dashboards/AdminBlogs.js` - Admin blogs management
- `src/components/layout/main/dashboards/AddBlogs.js` - Add new blog interface

## API Endpoints
- `/blogs/get` - Get all blogs with filtering options
- `/blogs/get/:id` - Get individual blog by ID
- `/blogs/featured` - Get featured or popular blogs
- `/blogs/related/:blogId` - Get related blogs for a specific blog
- `/blogs/categories` - Get all blog categories
- `/blogs/category/:categoryId` - Get blogs by category
- `/blogs/analytics/:blogId` - Get blog analytics
- `/blogs/interaction` - Log user interaction with blogs

## Navigation
- `/blogs` - Main blogs listing page
- `/blogs/[id]` - Individual blog post page
- `/blogs/category/[categoryId]` - Category-specific blog listing page 