/**
 * Interface for a blog comment
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

/**
 * Interface for a blog
 */
export interface IBlog {
  _id: string;
  id: string;
  title: string;
  slug: string;
  content?: string;
  description: string;
  blog_link: string | null;
  upload_image: string;
  author: {
    _id: string;
    email: string;
    name?: string;
  };
  categories: {
    _id: string;
    category_name: string;
    category_image: string;
  }[];
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
  reading_time: number;
  commentCount: number;
  __v: number;
}

/**
 * Interface for creating a blog
 */
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

/**
 * Interface for updating a blog
 */
export interface IBlogUpdateInput extends Partial<IBlogCreateInput> {
  featured?: boolean;
}

/**
 * Interface for adding a comment to a blog
 */
export interface IBlogCommentInput {
  content: string;
}

/**
 * Interface for toggling blog status
 */
export interface IBlogStatusUpdateInput {
  status: 'draft' | 'published' | 'archived';
}

/**
 * Interface for blog query parameters
 */
export interface IBlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  status?: string;
  category?: string | string[];
  tags?: string | string[];
  author?: string;
  date_range?: {
    start?: string;
    end?: string;
  };
  with_content?: boolean;
  count_only?: boolean;
  exclude_ids?: string[];
  featured?: boolean;
}

/**
 * Interface for blog search parameters
 */
export interface IBlogSearchParams {
  query: string;
  limit?: number;
  fields?: string[];
  category?: string;
  tags?: string;
}

/**
 * Interface for blog analytics
 */
export interface IBlogAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  view_history: {
    date: string;
    count: number;
  }[];
} 