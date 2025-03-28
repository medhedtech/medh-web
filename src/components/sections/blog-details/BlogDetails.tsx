'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiBaseUrl, apiUrls } from "@/apis";
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, Calendar, User, Share2, Bookmark, Heart, 
  MessageCircle, Eye, ArrowLeft, Facebook, Twitter, 
  Linkedin, Copy, List, ChevronUp, ChevronRight
} from "lucide-react";

// Types and Interfaces
interface User {
  _id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface Category {
  _id: string;
  category_name: string;
  category_image?: string;
}

interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  content?: string;
  blog_link?: string;
  upload_image: string;
  author?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  categories: Category[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views: number;
  likes: number;
  comments: {
    user: User;
    content: string;
    createdAt: string;
  }[];
  meta_title?: string;
  meta_description?: string;
  reading_time?: number;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
}

interface BlogDetailsProps {
  blog: Blog;
  relatedBlogs?: Blog[];
}

// Import necessary components
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
import CommentForm from "@/components/shared/forms/CommentFome";
import ClientComment from "@/components/shared/blog-details/ClientComment";
import PopupVideo from "@/components/shared/popup/PopupVideo";

// Import fallback images
import blogImage21 from "@/assets/images/blog/blog_21.png";
import blogImage22 from "@/assets/images/blog/blog_22.png";
import blogImage23 from "@/assets/images/blog/blog_23.png";

// Add params interface
interface BlogParams {
  slug: string;
}

const BlogDetails: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const id = params?.id as string | undefined;
  
  // State management with proper types
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState("5 min");
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!slug && !id) {
          throw new Error('Blog identifier (slug or ID) is required');
        }

        // Fetch blog details based on available identifier
        const blogResponse = await fetch(
          `${apiBaseUrl}${id ? apiUrls.Blogs.getBlogById(id) : apiUrls.Blogs.getBlogBySlug(slug!)}`
        );
        
        if (!blogResponse.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const blogData = await blogResponse.json();
        const blog = blogData.data || blogData; // Handle both direct data and nested data response
        setBlog(blog);
        setLikeCount(blog.likes || 0);

        // Fetch related blogs only if tags or categories exist
        if ((blog.tags?.length > 0 || blog.categories?.length > 0)) {
          const relatedResponse = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getRelatedBlogs({
            blogId: blog._id,
            limit: 3,
            tags: blog.tags?.join(',') || '',
            category: blog.categories?.join(',') || ''
          })}`);
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedBlogs(relatedData.blogs || []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching blog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [slug, id]);

  // Handle scroll and reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const totalHeight = contentRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const currentPosition = scrollTop + windowHeight;
        
        const contentBox = contentRef.current.getBoundingClientRect();
        const contentStart = scrollTop + contentBox.top;
        const contentEnd = contentStart + totalHeight;
        
        if (currentPosition >= contentEnd) {
          setReadingProgress(100);
        } else if (currentPosition <= contentStart) {
          setReadingProgress(0);
        } else {
          const progress = ((currentPosition - contentStart) / totalHeight) * 100;
          setReadingProgress(Math.min(progress, 100));
        }
        
        // Update active section in table of contents
        if (tableOfContents.length > 0) {
          const headingElements = tableOfContents.map(toc => document.getElementById(toc.id));
          for (let i = headingElements.length - 1; i >= 0; i--) {
            const heading = headingElements[i];
            if (heading && heading.getBoundingClientRect().top <= 100) {
              setActiveSection(heading.id);
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Handle click outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
      if (tocRef.current && !tocRef.current.contains(event.target as Node) && window.innerWidth < 768) {
        setIsTocOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Blog data effects
  useEffect(() => {
    if (blog) {
      // Calculate estimated read time based on content length
      if (blog.content) {
        const wordCount = blog.content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        setEstimatedReadTime(`${readTime} min read`);
      }

      // Check if blog is bookmarked
      const bookmarkedBlogs = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
      setIsBookmarked(bookmarkedBlogs.includes(blog._id));

      // Check if blog is liked
      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      setIsLiked(likedBlogs.includes(blog._id));
      
      // Generate table of contents
      setTimeout(() => {
        if (contentRef.current) {
          const headings = contentRef.current.querySelectorAll('h2, h3, h4');
          const toc = Array.from(headings).map((heading, index) => {
            if (!heading.id) {
              heading.id = `heading-${index}`;
            }
            return {
              id: heading.id,
              text: heading.textContent || '',
              level: parseInt(heading.tagName.substring(1))
            };
          });
          setTableOfContents(toc);
        }
      }, 500);
    }
  }, [blog]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Blog not found'}
        </h2>
        <Link href="/blogs" className="text-primary-600 hover:text-primary-700">
          Return to Blogs
        </Link>
      </div>
    );
  }

  // Format date if available
  const formattedDate = blog.createdAt 
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Recently Published";
  
  // Toggle bookmark with API call
  const toggleBookmark = async () => {
    try {
      const blogId = blog._id;
      const bookmarkedBlogs = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
      
      if (isBookmarked) {
        const updatedBookmarks = bookmarkedBlogs.filter((id: string) => id !== blogId);
        localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
      } else {
        bookmarkedBlogs.push(blogId);
        localStorage.setItem('bookmarkedBlogs', JSON.stringify(bookmarkedBlogs));
      }
      
      setIsBookmarked(!isBookmarked);
      
      // Note: If there's no specific bookmark endpoint in the API, we can track it locally
      // If a bookmark endpoint is added later, we can add the API call here
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  // Toggle like with API call
  const toggleLike = async () => {
    if (!blog) return;
    
    try {
      const response = await fetch(`${apiBaseUrl}${apiUrls.Blogs.likeBlog(blog._id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      
      if (isLiked) {
        const updatedLikes = likedBlogs.filter((id: string) => id !== blog._id);
        localStorage.setItem('likedBlogs', JSON.stringify(updatedLikes));
        setLikeCount(prev => prev - 1);
      } else {
        likedBlogs.push(blog._id);
        localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
        setLikeCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  
  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
      if (window.innerWidth < 768) {
        setIsTocOpen(false);
      }
    }
  };

  return (
    <section className="relative pb-16 md:pb-20 lg:pb-24">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
          initial={{ width: "0%" }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      <div className="container py-10 md:py-14 lg:py-16">
        {/* Back to blogs link */}
        <Link href="/blogs" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            <div data-aos="fade-up">
              {/* Featured Image */}
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <Image 
                  src={blog.upload_image || blogImage21} 
                  alt={blog.title || "Blog Image"} 
                  width={1200}
                  height={675}
                  className="w-full aspect-video object-cover"
                  priority
                />
                
                {/* Blog meta on image (mobile only) */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between md:hidden">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <Clock size={12} className="mr-1" />
                      {estimatedReadTime}
                    </span>
                    <span className="inline-flex items-center bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <Eye size={12} className="mr-1" />
                      {blog.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Blog Header */}
              <div className="mb-8">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {blog.title}
                </h1>
                
                {/* Meta information row */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <User size={16} className="text-primary-500" />
                    <span className="font-medium">{blog.author?.name || "Medh Team"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-primary-500" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1">
                    <Clock size={16} className="text-primary-500" />
                    <span>{estimatedReadTime}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1">
                    <Eye size={16} className="text-primary-500" />
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>
                
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        href={`/blogs?tag=${tag}`}
                        className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {/* Like button */}
                  <button 
                    onClick={toggleLike}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                      isLiked 
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart size={16} className={isLiked ? "fill-rose-600 dark:fill-rose-400" : ""} />
                    <span>{likeCount > 0 ? likeCount : ""}</span>
                  </button>
                  
                  {/* Bookmark button */}
                  <button 
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                      isBookmarked 
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Bookmark size={16} className={isBookmarked ? "fill-indigo-600 dark:fill-indigo-400" : ""} />
                    <span className="md:inline hidden">
                      {isBookmarked ? "Saved" : "Save"}
                    </span>
                  </button>
                  
                  {/* Share dropdown */}
                  <div className="relative" ref={shareRef}>
                    <button 
                      onClick={() => setIsShareOpen(!isShareOpen)}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Share2 size={16} />
                      <span className="md:inline hidden">Share</span>
                    </button>
                    
                    {isShareOpen && (
                      <div className="absolute top-full mt-2 right-0 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                          >
                            <Facebook size={18} className="text-blue-600" />
                            <span>Facebook</span>
                          </button>
                          <button 
                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                          >
                            <Twitter size={18} className="text-sky-500" />
                            <span>Twitter</span>
                          </button>
                          <button 
                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                          >
                            <Linkedin size={18} className="text-blue-700" />
                            <span>LinkedIn</span>
                          </button>
                          <button 
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
                          >
                            <Copy size={18} className="text-gray-600 dark:text-gray-400" />
                            <span>{copySuccess ? "Copied!" : "Copy link"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Table of Contents button (mobile only) */}
                  <button 
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="md:hidden flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
              
              {/* Mobile ToC dropdown */}
              {isTocOpen && (
                <div 
                  ref={tocRef}
                  className="md:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Table of Contents</h3>
                  <div className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`flex items-center text-sm ${
                          activeSection === item.id
                            ? 'text-primary-600 dark:text-primary-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        } hover:text-primary-600 dark:hover:text-primary-400 w-full text-left pl-${(item.level - 2) * 4}`}
                      >
                        <ChevronRight size={14} className={`mr-1 ${activeSection === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Blog Content */}
              <div 
                ref={contentRef}
                className="blog-content prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300 prose-img:rounded-xl prose-strong:text-gray-900 dark:prose-strong:text-white mb-10"
              >
                {blog.content ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  <div className="text-gray-600 dark:text-gray-400">
                    <p>No content available for this blog post.</p>
                    {blog.blog_link && (
                      <p className="mt-4">
                        <a 
                          href={blog.blog_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Visit original article →
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Author & Tags Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                      {blog.author?.name?.[0] || blog.title[0]?.toUpperCase() || "M"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {blog.author?.name || "Medh Team"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Education expert and content creator at Medh. Passionate about making learning accessible to everyone.
                    </p>
                    <div className="flex gap-2">
                      <Link href="/blogs" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                        View More Articles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
                <ClientComment />
                <div className="mt-10">
                  <CommentForm />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Desktop Table of Contents */}
              <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Table of Contents</h3>
                <div className="space-y-3">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center text-sm ${
                        activeSection === item.id
                          ? 'text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      } hover:text-primary-600 dark:hover:text-primary-400 w-full text-left transition-colors pl-${(item.level - 2) * 3}`}
                    >
                      <ChevronRight size={14} className={`mr-1.5 ${activeSection === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Related Blogs */}
              {relatedBlogs && relatedBlogs.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link 
                        href={`/blogs/${relatedBlog._id}`} 
                        key={relatedBlog._id}
                        className="flex gap-3 group"
                      >
                        <div className="shrink-0 w-20 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={relatedBlog.upload_image || '/images/blog/default.png'}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(relatedBlog.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Blog Sidebar component */}
              <BlogsSidebar />
              
              {/* Back to top button */}
              <div className="fixed bottom-6 right-6 z-40">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
