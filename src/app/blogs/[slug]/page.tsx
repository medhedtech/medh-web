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
// Blog post content will be rendered inline

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch individual blog post with full content
async function fetchBlogPost(slugOrId: string): Promise<IBlog | null> {
  try {
    // Try fetching by slug first with content parameter
    let url = `${API_BASE_URL}/blogs/${slugOrId}?with_content=true`;
    let response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // If slug-based fetch fails, try ID-based fetch with content
    if (!response.ok) {
      url = `${API_BASE_URL}/blogs/id/${slugOrId}?with_content=true`;
      response = await fetch(url, {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const result = await response.json();
    console.log('Blog data received:', {
      title: result.data?.title,
      hasDescription: !!result.data?.description,
      descriptionLength: result.data?.description?.length,
      hasContent: !!result.data?.content,
      contentLength: result.data?.content?.length,
      hasMetaDescription: !!result.data?.meta_description,
      metaDescriptionLength: result.data?.meta_description?.length
    });
    
    return result.data || result;
  } catch (error) {
    console.error("Error fetching blog post:", error);
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

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
  const blog = await fetchBlogPost(slug);
    
  if (!blog) {
      return {
      title: 'Blog Post Not Found | Medh',
        description: 'The requested blog post could not be found.',
      };
    }

  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.description || 'Read this insightful article on Medh Blog.';
  const imageUrl = blog.upload_image || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/images/og-image.jpg`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${slug}`;
  
  return {
    ...defaultMetadata,
    title: `${title} | Medh Blog`,
    description,
    keywords: [
      ...(blog.tags || []),
      'education',
      'learning',
      'career development',
      'professional growth'
    ].join(', '),
    authors: blog.author?.name ? [{ name: blog.author.name }] : undefined,
      openGraph: {
        ...defaultMetadata.openGraph,
      title,
      description,
      url,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          alt: title,
        }
      ],
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author?.name ? [blog.author.name] : undefined,
      tags: blog.tags,
      },
      twitter: {
        ...defaultMetadata.twitter,
      title,
      description,
        images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?limit=100&status=published`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    const blogs = result.data || result || [];
    
    return blogs.map((blog: IBlog) => ({
      slug: blog.slug || blog._id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Main blog post page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await fetchBlogPost(slug);
  
  if (!blog) {
    notFound();
  }
  
  // Fetch related blogs
  const relatedBlogs = await fetchRelatedBlogs(
    blog._id, 
    blog.categories?.map(cat => cat.category_name) || [], 
    blog.tags || []
  );
  
  const readTime = calculateReadTime(blog.description || '');
  const publishedDate = formatDate(blog.createdAt);
  const publishedDateISO = formatDateISO(blog.createdAt);
  
  return (
    <PageWrapper>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.description || blog.meta_description,
            "image": blog.upload_image,
            "author": {
              "@type": "Person",
              "name": blog.author?.name || "Medh Editorial Team",
              "email": blog.author?.email
            },
            "publisher": {
              "@type": "Organization",
              "name": "Medh",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co',
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/images/logo.png`
              }
            },
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${slug}`,
            "datePublished": blog.createdAt,
            "dateModified": blog.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${slug}`
            },
            "keywords": blog.tags?.join(', '),
            "wordCount": blog.description?.split(' ').length || 0,
            "timeRequired": `PT${blog.reading_time || 5}M`,
            "articleSection": blog.categories?.[0]?.category_name || 'General',
            "inLanguage": "en-US",
            "isAccessibleForFree": true
          })
        }}
      />
      
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/blogs"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Blogs</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {(blog.categories && blog.categories.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.categories.map((category, index) => (
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{blog.author?.name || 'Medh Team'}</span>
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
                <span>{blog.views || 0} views</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{blog.likes || 0} likes</span>
              </div>
            </div>

            {blog.upload_image && (
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={blog.upload_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
            )}

            {/* Full Blog Content - Well Formatted */}
            <article className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-green-600 dark:prose-a:text-green-400 prose-blockquote:border-green-500 prose-code:text-green-600 dark:prose-code:text-green-400">
              
              {(() => {
                // Smart content detection - check all available content fields
                const contentFields = [
                  { field: 'content', value: blog.content },
                  { field: 'description', value: blog.description },
                  { field: 'meta_description', value: blog.meta_description },
                ];
                
                // Filter out empty/null fields and sort by length (longest first)
                const availableContent = contentFields
                  .filter(item => item.value && item.value.trim().length > 0)
                  .sort((a, b) => (b.value?.length || 0) - (a.value?.length || 0));
                
                console.log('Available content fields:', availableContent.map(item => ({
                  field: item.field,
                  length: item.value?.length || 0,
                  preview: (item.value?.substring(0, 100) || '') + '...'
                })));
                
                console.log('Blog data received:', {
                  hasContent: !!blog.content,
                  contentLength: blog.content?.length || 0,
                  hasDescription: !!blog.description,
                  descriptionLength: blog.description?.length || 0,
                  contentPreview: blog.content?.substring(0, 200) || 'No content'
                });
                
                if (availableContent.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-800 dark:text-yellow-300 mb-2">
                          ⚠️ No content available for this article
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          This article may be a placeholder or the content is being updated.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Use the longest available content as primary
                const primaryContent = availableContent[0];
                
                if (!primaryContent?.value) {
                  return (
                    <div className="text-center py-12">
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                        <p className="text-red-800 dark:text-red-300 mb-2">
                          ❌ Content Error
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Unable to load article content. Please try again later.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <>
                    {/* Primary Content (Longest) */}
                    <div 
                      className="blog-full-content prose prose-lg max-w-none dark:prose-invert
                        prose-headings:text-gray-900 dark:prose-headings:text-white
                        prose-p:text-gray-700 dark:prose-p:text-gray-300
                        prose-a:text-green-600 dark:prose-a:text-green-400
                        prose-strong:text-gray-900 dark:prose-strong:text-white
                        prose-code:text-green-600 dark:prose-code:text-green-400
                        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                        prose-blockquote:border-green-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300"
                      dangerouslySetInnerHTML={{ 
                        __html: enhancedProcessContent(primaryContent.value) 
                      }} 
                    />
                    
                    {/* Show content source info for transparency */}
                    <div className="not-prose mt-8 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-sm">📖</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                            Content Source: {primaryContent?.field?.charAt(0).toUpperCase() + primaryContent?.field?.slice(1)}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {(primaryContent?.value?.length || 0).toLocaleString()} characters • 
                            {Math.ceil((primaryContent?.value?.split(' ').length || 0) / 200)} min read
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show additional content if available and significantly different */}
                    {availableContent.length > 1 && availableContent[1]?.value && availableContent[1].value.length > 200 && (
                      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Additional Information
                        </h3>
                        <div 
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: enhancedProcessContent(availableContent[1].value || '') 
                          }} 
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          Source: {availableContent[1]?.field} • {availableContent[1]?.value?.length || 0} characters
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
              
            </article>
            


            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
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
      </main>
    </PageWrapper>
  );
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

// Convert markdown to HTML
const convertMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Convert headings (order matters - do ### before ##)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    
    // Convert bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      
      // Don't wrap headings in paragraphs
      if (trimmed.startsWith('<h')) {
        return trimmed;
      }
      
      // Wrap other content in paragraphs
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .filter(p => p)
    .join('\n');
  
  return html;
};

// Enhanced content processing for better formatting
const enhancedProcessContent = (content: string): string => {
  if (!content) return '';
  
  // First, clean up any HTML artifacts and code blocks
  let processedContent = content
    .replace(/```html\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>[\s\S]*?<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<header[^>]*>/gi, '')
    .replace(/<\/header>/gi, '')
    .replace(/<footer[^>]*>/gi, '')
    .replace(/<\/footer>/gi, '')
    .replace(/<section[^>]*>/gi, '')
    .replace(/<\/section>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .trim();
  
  // Convert markdown to HTML if content appears to be markdown
  if (processedContent.includes('##') || processedContent.includes('**')) {
    processedContent = convertMarkdownToHtml(processedContent);
  }
  
  // Then apply enhanced styling
  processedContent = processedContent
    // Enhanced paragraph styling with better spacing
    .replace(/<p([^>]*)>/g, '<p$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">')
    
    // Enhanced heading styles with better hierarchy
    .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold text-gray-900 dark:text-white mt-12 mb-8 leading-tight border-b border-gray-200 dark:border-gray-700 pb-4">')
    .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6 leading-tight">')
    .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 leading-tight">')
    .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 leading-tight">')
    .replace(/<h5([^>]*)>/g, '<h5$1 class="text-lg font-medium text-gray-800 dark:text-gray-200 mt-5 mb-3 leading-tight">')
    .replace(/<h6([^>]*)>/g, '<h6$1 class="text-base font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2 leading-tight">')
    
    // Enhanced list styling with better spacing
    .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc list-outside ml-6 mb-6 space-y-3">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal list-outside ml-6 mb-6 space-y-3">')
    .replace(/<li([^>]*)>/g, '<li$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">')
    
    // Enhanced link styling
    .replace(/<a([^>]*)>/g, '<a$1 class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline decoration-2 underline-offset-2 hover:decoration-green-500 transition-all duration-200 font-medium">')
    
    // Enhanced blockquote styling
    .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 pl-6 pr-4 py-4 my-8 italic text-lg text-gray-700 dark:text-gray-300 rounded-r-lg shadow-sm">')
    
    // Enhanced code styling
    .replace(/<code([^>]*)>/g, '<code$1 class="bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">')
    .replace(/<pre([^>]*)>/g, '<pre$1 class="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-6 rounded-lg overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 shadow-sm">')
    
    // Enhanced table styling
    .replace(/<table([^>]*)>/g, '<table$1 class="w-full border-collapse border border-gray-300 dark:border-gray-600 my-8 rounded-lg overflow-hidden shadow-sm">')
    .replace(/<th([^>]*)>/g, '<th$1 class="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">')
    .replace(/<td([^>]*)>/g, '<td$1 class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">')
    
    // Enhanced image styling
    .replace(/<img([^>]*)>/g, '<img$1 class="rounded-lg shadow-lg my-8 max-w-full h-auto border border-gray-200 dark:border-gray-700">')
    
    // Enhanced emphasis styling
    .replace(/<strong([^>]*)>/g, '<strong$1 class="font-bold text-gray-900 dark:text-white">')
    .replace(/<em([^>]*)>/g, '<em$1 class="italic text-gray-800 dark:text-gray-200">')
    
    // Enhanced horizontal rule
    .replace(/<hr([^>]*)>/g, '<hr$1 class="my-12 border-gray-300 dark:border-gray-600 border-t-2">')
    
    // Add proper spacing for divs and sections
    .replace(/<div([^>]*)>/g, '<div$1 class="mb-4">')
    .replace(/<section([^>]*)>/g, '<section$1 class="mb-8">');
  
  return processedContent;
}; 