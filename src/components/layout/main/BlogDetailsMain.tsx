"use client";
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BlogData } from '@/hooks/useBlog.hook';
import { useBlog } from '@/hooks/useBlog.hook';
import { Heart, Share2, MessageCircle, Clock, Tag, ChevronRight, AlertCircle } from 'lucide-react';
import { showToast } from '@/utils/toastManager';

interface BlogDetailsMainProps {
  blog: BlogData;
  relatedBlogs: BlogData[];
}

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
}

const BlogDetailsMain: FC<BlogDetailsMainProps> = ({ blog, relatedBlogs }) => {
  const { likeBlog, addComment, loading, postLoading, isAuthenticated } = useBlog(blog._id);
  const [author, setAuthor] = useState<Author | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [commentText, setCommentText] = useState('');

  // Fetch author and categories data
  useEffect(() => {
    const fetchAuthorAndCategories = async () => {
      try {
        if (blog.author) {
          // Fetch author data
          const authorRes = await fetch(`/api/users/${blog.author}`);
          if (!authorRes.ok) {
            console.warn('Failed to fetch author data');
            // Set default author data
            setAuthor({
              _id: 'default',
              name: 'Medh Team',
              email: ''
            });
          } else {
            const authorData = await authorRes.json();
            if (authorData.success) {
              setAuthor(authorData.data);
            } else {
              setAuthor({
                _id: 'default',
                name: 'Medh Team',
                email: ''
              });
            }
          }
        } else {
          // Set default author if no author ID
          setAuthor({
            _id: 'default',
            name: 'Medh Team',
            email: ''
          });
        }

        // Fetch categories data only if categories exist
        if (blog.categories && blog.categories.length > 0) {
          const categoriesPromises = blog.categories.map(async categoryId => {
            try {
              const res = await fetch(`/api/categories/${categoryId}`);
              if (!res.ok) return null;
              const data = await res.json();
              return data.success ? data.data : null;
            } catch (err) {
              console.warn(`Failed to fetch category ${categoryId}:`, err);
              return null;
            }
          });
          
          const categoriesData = await Promise.all(categoriesPromises);
          setCategories(categoriesData.filter(Boolean));
        }
      } catch (error) {
        console.error('Error fetching author or categories:', error);
        // Set default author on error
        setAuthor({
          _id: 'default',
          name: 'Medh Team',
          email: ''
        });
      }
    };

    fetchAuthorAndCategories();
  }, [blog.author, blog.categories]);

  const handleLike = async () => {
    await likeBlog();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: blog.title,
        text: blog.description || blog.title,
        url: window.location.href,
      });
    } catch (error) {
      toast.info('Share URL copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    const success = await addComment({ content: commentText });
    if (success) {
      setCommentText('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <article className="relative">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full rounded-3xl overflow-hidden mb-8">
        <Image
          src={blog.upload_image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {blog.title}
          </motion.h1>
          <div className="flex items-center gap-4 text-white/80">
            {author && (
              <>
                <Image
                  src={author.email ? `https://gravatar.com/avatar/${author.email}?s=200` : '/images/default-avatar.png'}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 ml-4">
              <Clock className="w-4 h-4" />
              <span>{blog.reading_time} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Link 
                key={category._id}
                href={`/blogs/category/${category._id}`}
                className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition"
              >
                {category.category_name}
              </Link>
            ))}
            {blog.tags.map((tag) => (
              <span 
                key={tag}
                className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                <Tag className="w-3 h-3 inline-block mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Blog Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Interaction Buttons */}
          <div className="flex items-center gap-4 py-6 border-t border-b dark:border-gray-800">
            <button
              onClick={handleLike}
              disabled={postLoading}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition ${
                isAuthenticated 
                  ? "bg-primary/10 hover:bg-primary/20 text-primary"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${blog.likes > 0 && isAuthenticated ? 'fill-current' : ''}`} />
              <span>{blog.likes} Likes</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Comments ({blog.comments?.length || 0})</h3>
            
            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={postLoading}
                />
                <button
                  type="submit"
                  disabled={postLoading}
                  className="mt-2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {postLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <AlertCircle className="w-5 h-5" />
                  <p>Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link> to comment on this article</p>
                </div>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div key={comment._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="/images/default-avatar.png"
                        alt="Commenter"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">User</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.createdAt ? format(new Date(comment.createdAt), 'MMM dd, yyyy') : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Related Blogs */}
          <div className="sticky top-24">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog._id}
                  href={`/blogs/${relatedBlog._id}`}
                  className="group block"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-2">
                    <Image
                      src={relatedBlog.upload_image}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-primary transition line-clamp-2">
                    {relatedBlog.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{relatedBlog.reading_time} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetailsMain; 