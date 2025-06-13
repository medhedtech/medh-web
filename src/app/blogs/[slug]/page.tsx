import { Metadata } from 'next';
import Image from 'next/image';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { CalendarDays, Clock, User, ArrowLeft, MessageCircle, Share2, Bookmark, ChevronLeft, ArrowRight, Eye, ThumbsUp, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { IBlog } from '@/types/blog.types';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { defaultMetadata } from '@/app/metadata';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Server-side fetch function for blog data by slug
async function fetchBlogDataBySlug(slug: string): Promise<IBlog | null> {
  try {
    if (!slug) return null;
    
    const url = `${API_BASE_URL}/blogs/slug/${encodeURIComponent(slug)}`;
    console.log("Fetching blog from URL:", url);
    
    const response = await fetch(url, { 
      next: { 
        revalidate: 3600, // Cache for 1 hour
        tags: [`blog-${slug}`]
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log("Blog data response:", { success: data.success, title: data.data?.title });
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return null;
  }
}

// Fetch related blogs
async function fetchRelatedBlogs(blogId: string, categories: string[], tags: string[]): Promise<IBlog[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '3');
    queryParams.append('status', 'published');
    queryParams.append('exclude_ids', blogId);
    
    if (categories.length > 0) {
      queryParams.append('category', categories[0]);
    } else if (tags.length > 0) {
      queryParams.append('tags', tags[0]);
    }
    
    const url = `${API_BASE_URL}/blogs?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

// Enhanced metadata generation for better SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return {
        title: 'Blog Details | Medh - Educational Insights & Expert Knowledge',
        description: 'Explore our comprehensive educational insights, expert knowledge, and learning resources on the Medh blog platform.',
      };
    }
    
    const blogData = await fetchBlogDataBySlug(slug);
    
    if (!blogData) {
      return {
        title: 'Blog Not Found | Medh',
        description: 'The requested blog post could not be found.',
      };
    }

    const title = `${blogData.title} | Medh Blog`;
    const description = blogData.description || blogData.meta_description || `Read about ${blogData.title} on Medh blog - your source for educational insights and expert knowledge.`;
    const imageUrl = blogData.upload_image || '/images/blog-default.jpg';
    const publishedTime = blogData.createdAt;
    const modifiedTime = blogData.updatedAt || blogData.createdAt;
    const authorName = blogData.author?.name || 'Medh Team';
    
    // Extract keywords from tags and categories
    const keywords = [
      ...(blogData.tags || []),
      ...(blogData.categories?.map(cat => cat.category_name) || []),
      'education',
      'learning',
      'blog',
      'medh'
    ];

    const canonical = `/blogs/${slug}`;

    return {
      ...defaultMetadata,
      title: blogData.meta_title || title,
      description: blogData.meta_description || description,
      keywords: keywords.join(', '),
      authors: [{ name: authorName }],
      publisher: 'Medh',
      alternates: {
        canonical,
      },
      openGraph: {
        ...defaultMetadata.openGraph,
        title: blogData.meta_title || title,
        description: blogData.meta_description || description,
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [authorName],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blogData.title,
          }
        ],
        url: canonical,
        section: blogData.categories?.[0]?.category_name || 'Education',
        tags: blogData.tags,
      },
      twitter: {
        ...defaultMetadata.twitter,
        title: blogData.meta_title || title,
        description: blogData.meta_description || description,
        images: [imageUrl],
        creator: `@medh`,
      },
      robots: {
        index: blogData.status === 'published',
        follow: true,
        googleBot: {
          index: blogData.status === 'published',
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Details | Medh',
      description: 'Explore our educational insights and expert knowledge on our blog',
    };
  }
}

interface BlogPageParams {
  slug: string;
}

type Props = {
  params: Promise<BlogPageParams>;
}

// Enhanced utility functions
const calculateReadTime = (content: string): string => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Recently published';
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

const formatDateISO = (dateString: string): string => {
  if (!dateString) return new Date().toISOString();
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Enhanced content processing for better HTML/Markdown support
const processContent = (content: string): string => {
  if (!content) return '';
  
  // Enhanced HTML processing with better typography and spacing
  let processedContent = content
    // Improve heading styles
    .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold text-gray-900 dark:text-white mt-12 mb-6 leading-tight">')
    .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-semibold text-gray-900 dark:text-white mt-10 mb-5 leading-tight">')
    .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 leading-tight">')
    .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 leading-tight">')
    .replace(/<h5([^>]*)>/g, '<h5$1 class="text-lg font-semibold text-gray-900 dark:text-white mt-5 mb-3 leading-tight">')
    .replace(/<h6([^>]*)>/g, '<h6$1 class="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2 leading-tight">')
    
    // Improve paragraph styles
    .replace(/<p([^>]*)>/g, '<p$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">')
    
    // Improve list styles
    .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300 ml-4">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300 ml-4">')
    .replace(/<li([^>]*)>/g, '<li$1 class="leading-relaxed">')
    
    // Improve link styles
    .replace(/<a([^>]*)>/g, '<a$1 class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium transition-colors">')
    
    // Improve blockquote styles
    .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-primary-500 pl-6 py-4 mb-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r-lg">')
    
    // Improve code styles
    .replace(/<code([^>]*)>/g, '<code$1 class="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-2 py-1 rounded text-sm font-mono">')
    .replace(/<pre([^>]*)>/g, '<pre$1 class="bg-gray-900 text-gray-100 p-6 rounded-lg mb-6 overflow-x-auto">')
    
    // Improve image styles
    .replace(/<img([^>]*)>/g, '<img$1 class="rounded-lg shadow-lg mb-6 max-w-full h-auto">');
  
  return processedContent;
};

// Loading component
function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="animate-pulse">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BlogDetails({ params }: Props) {
  const { slug } = await params;
  
  // Fetch blog data
  const blogData = await fetchBlogDataBySlug(slug);
  
  if (!blogData) {
    notFound();
  }
  
  // Fetch related blogs
  const relatedBlogs = await fetchRelatedBlogs(
    blogData._id, 
    blogData.categories?.map(cat => cat.category_name) || [], 
    blogData.tags || []
  );
  
  const readTime = calculateReadTime(blogData.description || '');
  const publishedDate = formatDate(blogData.createdAt);
  const publishedDateISO = formatDateISO(blogData.createdAt);
  
  return (
    <PageWrapper>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blogData.title,
            "description": blogData.description || blogData.meta_description,
            "image": blogData.upload_image,
            "author": {
              "@type": "Person",
              "name": blogData.author?.name || "Medh Team",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/team/${blogData.author?.name?.toLowerCase().replace(/\s+/g, '-')}`
            },
            "publisher": {
              "@type": "Organization",
              "name": "Medh",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/images/medh-logo.png`
              }
            },
            "datePublished": publishedDateISO,
            "dateModified": formatDateISO(blogData.updatedAt),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${slug}`
            },
            "keywords": blogData.tags?.join(', '),
            "articleSection": blogData.categories?.[0]?.category_name || 'Education',
            "wordCount": blogData.description?.split(/\s+/).length || 0,
            "timeRequired": `PT${calculateReadTime(blogData.description || '').match(/\d+/)?.[0] || '1'}M`,
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${slug}`
          })
        }}
      />
      
      <Suspense fallback={<BlogDetailLoading />}>
        <article className="min-h-screen bg-white dark:bg-gray-900">
          {/* Navigation Header */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link 
                  href="/blogs"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back to Blogs</span>
                </Link>
                
                <div className="flex items-center gap-4">
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Category and Tags */}
              {(blogData.categories && blogData.categories.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blogData.categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/blogs?category=${encodeURIComponent(category.category_name)}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {category.category_name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {blogData.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{blogData.author?.name || 'Medh Team'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <time dateTime={publishedDateISO}>{publishedDate}</time>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blogData.views || 0} views</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{blogData.likes || 0} likes</span>
                </div>
              </div>

              {/* Featured Image */}
              {blogData.upload_image && (
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={blogData.upload_image}
                    alt={blogData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                {blogData.description && (
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ 
                      __html: processContent(blogData.description) 
                    }} 
                  />
                )}
              </div>

              {/* External Link */}
              {blogData.blog_link && (
                <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl border border-primary-200 dark:border-primary-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Read Full Article
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Continue reading the complete article on the original source.
                      </p>
                    </div>
                    <Link
                      href={blogData.blog_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <span>Read More</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Tags */}
              {blogData.tags && blogData.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blogData.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/blogs?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Related Articles
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedBlogs.map((blog) => (
                      <Link
                        key={blog._id}
                        href={`/blogs/${blog.slug}`}
                        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {blog.upload_image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={blog.upload_image}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          
                          {blog.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                              {blog.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatDate(blog.createdAt)}</span>
                            <span>{calculateReadTime(blog.description || '')}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>
      </Suspense>
    </PageWrapper>
  );
}

// Static params generation for better build optimization
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?limit=100&status=published&fields=slug`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      const blogs = result.data || [];
      
      return blogs
        .filter((blog: IBlog) => blog.slug)
        .map((blog: IBlog) => ({
          slug: blog.slug,
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
} 